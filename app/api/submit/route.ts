import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '../../lib/schema';
import type { WebhookPayload, SubmitResponse } from '../../lib/types';
import { API_TIMEOUT_MS, PRODUCT_ASSIGNEE_MAP } from '../../lib/constants';
import { findByEmail } from '../../lib/googleSheets';
import { buildNextUrl } from '../../lib/fillout';

// Simple in-memory rate limiter (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

// Generate UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Warn if webhook URL is not configured (on first request)
let webhookUrlWarned = false;

export async function POST(request: NextRequest): Promise<NextResponse<SubmitResponse>> {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { status: 'error', message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Extract custom webhook URL and dev password if provided (for testing)
    const { _webhookUrl, _devPassword, ...formBody } = body as {
      _webhookUrl?: string;
      _devPassword?: string;
      [key: string]: unknown
    };

    // Verify dev password if custom webhook URL is provided
    const devPasswordCorrect = _devPassword === process.env.DEV_PASSWORD;
    const isDevBypass = Boolean(_webhookUrl && devPasswordCorrect);

    // Use custom webhook URL only if password is correct, otherwise use env variable
    const webhookUrl = isDevBypass
      ? _webhookUrl!
      : process.env.MAKE_WEBHOOK_URL;

    if (!webhookUrl) {
      if (!webhookUrlWarned) {
        console.warn('[API] MAKE_WEBHOOK_URL is not configured. Set it in .env.local or provide a custom URL.');
        webhookUrlWarned = true;
      }
      return NextResponse.json(
        { status: 'error', message: 'No webhook URL configured. Please enter a webhook URL for testing.' },
        { status: 500 }
      );
    }

    // Log if using custom webhook (for debugging)
    if (_webhookUrl && devPasswordCorrect) {
      console.log('[API] Using custom webhook URL (dev bypass)');
    } else if (_webhookUrl && !devPasswordCorrect) {
      console.log('[API] Custom webhook URL ignored - incorrect password');
    }

    // Server-side validation using Zod schema
    const parseResult = contactFormSchema.safeParse(formBody);
    if (!parseResult.success) {
      const errorMessages = parseResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json(
        { status: 'error', message: `Validation failed: ${errorMessages}` },
        { status: 400 }
      );
    }

    const formData = parseResult.data;

    // Validate product has valid assignee mapping
    const assignee = PRODUCT_ASSIGNEE_MAP[formData.product];
    if (!assignee) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid product selected.' },
        { status: 400 }
      );
    }

    // Generate lead identifiers
    const leadId = generateUUID();
    const createdAt = new Date().toISOString();
    const source = isDevBypass ? 'dev-bypass' : 'landing-form';

    // --- DEV BYPASS: Skip Sheets, send directly to custom webhook ---
    if (isDevBypass) {
      const payload: WebhookPayload = {
        leadId,
        createdAt,
        source,
        contact: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
        product: formData.product,
        message: formData.message || null,
        routing: { assignee },
      };

      console.log('[API] Dev bypass - sending to custom webhook:', JSON.stringify(payload, null, 2));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!webhookResponse.ok) {
          const responseText = await webhookResponse.text().catch(() => 'No response body');
          return NextResponse.json(
            {
              status: 'error',
              message: `Webhook failed: ${webhookResponse.status} ${webhookResponse.statusText}`,
              error: { status: webhookResponse.status, statusText: webhookResponse.statusText, details: responseText },
            },
            { status: webhookResponse.status }
          );
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
        return NextResponse.json(
          { status: 'error', message: `Webhook error: ${errorMessage}`, error: { type: 'network', details: errorMessage } },
          { status: 502 }
        );
      }

      const nextUrl = buildNextUrl({ leadId, fullName: formData.fullName, email: formData.email, phone: formData.phone, assignee });
      return NextResponse.json({ status: 'ok', message: 'Dev bypass successful.', nextUrl, leadId });
    }

    // --- PRODUCTION FLOW: Google Sheets duplicate check ---

    // Check for duplicate email
    let isDuplicate: boolean;
    try {
      isDuplicate = await findByEmail(formData.email);
    } catch (sheetsError) {
      const errorMessage = sheetsError instanceof Error ? sheetsError.message : 'Unknown error';
      console.error('[API] Google Sheets findByEmail error:', errorMessage);
      return NextResponse.json(
        { status: 'error', message: 'Service temporarily unavailable. Please try again later.', error: { type: 'sheets', details: errorMessage } },
        { status: 500 }
      );
    }

    if (isDuplicate) {
      console.log('[API] Duplicate email detected:', formData.email);
      return NextResponse.json(
        { status: 'duplicate', message: 'You have already submitted a request. Our team will get back to you soon.' },
        { status: 409 }
      );
    }

    // --- Send webhook to Make.com (best effort) ---
    const payload: WebhookPayload = {
      leadId,
      createdAt,
      source,
      contact: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },
      product: formData.product,
      message: formData.message || null,
      routing: { assignee },
    };

    try {
      console.log('[API] Sending webhook to Make.com:', JSON.stringify(payload, null, 2));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!webhookResponse.ok) {
        const responseText = await webhookResponse.text().catch(() => 'No response body');
        console.error('[API] Make webhook error (best effort):', {
          status: webhookResponse.status,
          body: responseText,
        });
      } else {
        console.log('[API] Make webhook sent successfully:', {
          leadId,
          email: formData.email,
          product: formData.product,
          assignee,
          timestamp: createdAt,
        });
      }
    } catch (webhookError) {
      // Best effort: log the error but don't fail the request
      const errorMessage = webhookError instanceof Error ? webhookError.message : 'Unknown error';
      console.error('[API] Make webhook failed (best effort):', errorMessage);
    }

    // --- Build redirect URL ---
    const nextUrl = buildNextUrl({
      leadId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      assignee,
    });

    return NextResponse.json({
      status: 'ok',
      message: 'Thank you! Redirecting...',
      nextUrl,
      leadId,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API] Unexpected error:', errorMessage);
    return NextResponse.json(
      {
        status: 'error',
        message: `Server error: ${errorMessage}`,
        error: { type: 'server', details: errorMessage }
      },
      { status: 500 }
    );
  }
}
