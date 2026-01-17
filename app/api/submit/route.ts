import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '../../lib/schema';
import type { WebhookPayload, SubmitResponse } from '../../lib/types';
import { API_TIMEOUT_MS, PRODUCT_ASSIGNEE_MAP } from '../../lib/constants';

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
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Get webhook URL from environment variable
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;

    if (!webhookUrl) {
      if (!webhookUrlWarned) {
        console.warn('[API] MAKE_WEBHOOK_URL is not configured. Set it in .env.local');
        webhookUrlWarned = true;
      }
      return NextResponse.json(
        { success: false, message: 'Webhook URL not configured.' },
        { status: 500 }
      );
    }

    // Server-side validation using Zod schema
    const parseResult = contactFormSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMessages = parseResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json(
        { success: false, message: `Validation failed: ${errorMessages}` },
        { status: 400 }
      );
    }

    const formData = parseResult.data;

    // Validate product has valid assignee mapping
    const assignee = PRODUCT_ASSIGNEE_MAP[formData.product];
    if (!assignee) {
      return NextResponse.json(
        { success: false, message: 'Invalid product selected.' },
        { status: 400 }
      );
    }

    // Build webhook payload with new contract structure
    const payload: WebhookPayload = {
      leadId: generateUUID(),
      createdAt: new Date().toISOString(),
      source: 'make-webhook-demo',
      contact: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },
      product: formData.product,
      message: formData.message || null,
      meeting: {
        medium: formData.meetingMedium || null,
        datetime: formData.meetingDatetime ? new Date(formData.meetingDatetime).toISOString() : null,
      },
      routing: {
        assignee,
      },
    };

    // Log payload for debugging
    console.log('[API] Payload to Make.com:', JSON.stringify(payload, null, 2));

    // Send to Make.com webhook with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!webhookResponse.ok) {
        console.error('[API] Make webhook returned error:', webhookResponse.status);
        return NextResponse.json(
          { success: false, message: 'Failed to process your request. Please try again.' },
          { status: 500 }
        );
      }

      console.log('[API] Form submitted successfully:', {
        leadId: payload.leadId,
        email: formData.email,
        product: formData.product,
        assignee: payload.routing.assignee,
        timestamp: payload.createdAt,
      });

      return NextResponse.json({
        success: true,
        message: 'Thank you! We will contact you soon.',
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('[API] Make webhook timeout');
        return NextResponse.json(
          { success: false, message: 'Request timed out. Please try again.' },
          { status: 504 }
        );
      }

      throw fetchError;
    }

  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
