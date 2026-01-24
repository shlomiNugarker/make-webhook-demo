import type { SelectOption } from './types';

export const PRODUCT_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select service...' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'automation', label: 'Automation & Integrations' },
  { value: 'fullstack', label: 'Full Stack Project' },
];

// Service to assignee mapping
// Shlomi = Web Developer, Maor = Automation Expert
export const PRODUCT_ASSIGNEE_MAP: Record<string, string> = {
  'web-development': 'shlomi',
  'automation': 'maor',
  'fullstack': 'shlomi',
};

// API config
export const API_TIMEOUT_MS = 10000; // 10 seconds

// Fillout integration
export const FILLOUT_QUESTIONNAIRE_URL = 'https://forms.fillout.com/t/bwpjAGxTrDus';
export const FILLOUT_MAOR_MEETING_URL = 'https://make-webhook-demo.fillout.com/meeting-with-maor';
