// Form field values (what user inputs)
export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  product: string;
  message: string;
  meetingDatetime: string;
  meetingMedium: string;
}

// Payload sent to Make.com webhook
export interface WebhookPayload {
  leadId: string;
  createdAt: string;
  source: string;
  contact: {
    fullName: string;
    email: string;
    phone: string;
  };
  product: string;
  message: string | null;
  meeting: {
    medium: string | null;
    datetime: string | null;
  };
  routing: {
    assignee: string;
  };
}

// Form field errors
export interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  product?: string;
  message?: string;
  meetingDatetime?: string;
  meetingMedium?: string;
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
