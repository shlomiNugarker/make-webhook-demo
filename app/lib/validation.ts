import type { ContactFormData, FormErrors } from './types';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Israeli phone regex (after normalization)
const PHONE_REGEX = /^05\d{8}$/;

/**
 * Normalize phone number by removing spaces, dashes, parentheses
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validate Israeli phone number (05X-XXXXXXX format)
 */
export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return PHONE_REGEX.test(normalized);
}

/**
 * Validate name (minimum 2 characters)
 */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

/**
 * Validate entire form and return errors object
 */
export function validateForm(data: ContactFormData): FormErrors {
  const errors: FormErrors = {};

  // Full name validation (required)
  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (!isValidName(data.fullName)) {
    errors.fullName = 'Name must be at least 2 characters';
  }

  // Email validation (required)
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation (required)
  if (!data.phone.trim()) {
    errors.phone = 'Phone is required';
  } else if (!isValidPhone(data.phone)) {
    errors.phone = 'Please enter a valid Israeli phone (05X-XXXXXXX)';
  }

  // Product validation (required)
  if (!data.product) {
    errors.product = 'Please select a product';
  }

  // Optional fields: message, meetingDatetime, meetingMedium
  // No validation required

  return errors;
}

/**
 * Check if form has any errors
 */
export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}
