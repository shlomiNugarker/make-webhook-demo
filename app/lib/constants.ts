import type { SelectOption } from './types';

export const MEETING_TIME_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select time...' },
  { value: 'morning', label: 'Morning (9:00-12:00)' },
  { value: 'afternoon', label: 'Afternoon (12:00-17:00)' },
  { value: 'evening', label: 'Evening (17:00-20:00)' },
];

export const PRODUCT_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select product...' },
  { value: 'product-a', label: 'Product A' },
  { value: 'product-b', label: 'Product B' },
  { value: 'product-c', label: 'Product C' },
];

// Initial form state
export const INITIAL_FORM_DATA = {
  name: '',
  email: '',
  phone: '',
  meeting_time: '',
  location: '',
  product: '',
};

// API config
export const API_TIMEOUT_MS = 10000; // 10 seconds
