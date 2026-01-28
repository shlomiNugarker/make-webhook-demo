import { FILLOUT_MAOR_MEETING_URL } from './constants';

export interface FilloutParams {
  leadId: string;
  fullName: string;
  email: string;
  phone: string;
  assignee: string;
}

/**
 * Build the next URL to redirect the user to after successful submission.
 * - automation (Maor) → Fillout questionnaire with prefilled params
 * - web-development / fullstack (Shlomi) → /thank-you (Calendly CTA)
 */
export function buildNextUrl(params: FilloutParams): string {
  if (params.assignee === 'maor') {
    const url = new URL(FILLOUT_MAOR_MEETING_URL);
    url.searchParams.set('leadId', params.leadId);
    url.searchParams.set('fullName', params.fullName);
    url.searchParams.set('email', params.email);
    url.searchParams.set('phone', params.phone);
    url.searchParams.set('assignee', params.assignee);
    return url.toString();
  }

  // Shlomi (web-development, fullstack) → local thank-you page with Calendly
  return '/thank-you';
}
