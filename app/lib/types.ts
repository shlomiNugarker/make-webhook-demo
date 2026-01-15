// Form field values (what user inputs)
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  meeting_time: string;
  location: string;
  product: string;
}

// Payload sent to API/webhook
export interface WebhookPayload extends ContactFormData {
  submitted_at: string;
  source: 'landing-page';
}

// Form field errors
export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  meeting_time?: string;
  location?: string;
  product?: string;
}

// API response
export interface SubmitResponse {
  success: boolean;
  message: string;
}

// Toast notification
export interface ToastState {
  show: boolean;
  type: 'success' | 'error';
  message: string;
}

// Dropdown option
export interface SelectOption {
  value: string;
  label: string;
}
