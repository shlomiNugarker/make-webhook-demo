import type { SelectOption } from './types';

export const PRODUCT_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select product...' },
  { value: 'product-a', label: 'Product A' },
  { value: 'product-b', label: 'Product B' },
  { value: 'product-c', label: 'Product C' },
];

export const MEETING_MEDIUM_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select medium...' },
  { value: 'online', label: 'Online' },
  { value: 'phone', label: 'Phone' },
];

// Product to assignee mapping
export const PRODUCT_ASSIGNEE_MAP: Record<string, string> = {
  'product-a': 'shlomi',
  'product-b': 'maor',
  'product-c': 'maor',
};

// API config
export const API_TIMEOUT_MS = 10000; // 10 seconds
