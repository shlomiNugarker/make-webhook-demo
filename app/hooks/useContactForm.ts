'use client';

import { useState, useCallback } from 'react';
import type { ContactFormData, FormErrors, ToastState } from '../lib/types';
import { validateForm, hasErrors, normalizePhone } from '../lib/validation';
import { INITIAL_FORM_DATA, API_TIMEOUT_MS } from '../lib/constants';

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [customWebhookUrl, setCustomWebhookUrl] = useState('');
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: 'success',
    message: '',
  });

  // Update a single field
  const updateField = useCallback((field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Show toast notification
  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
  }, []);

  // Hide toast notification
  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
  }, []);

  // Submit form
  const submitForm = useCallback(async () => {
    // Validate form
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      return;
    }

    setIsLoading(true);

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Normalize phone before sending
          phone: normalizePhone(formData.phone),
          // Include custom webhook URL if provided (for testing)
          _webhookUrl: customWebhookUrl || undefined,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok) {
        showToast('success', data.message || 'Form submitted successfully!');
        resetForm();
      } else {
        // Handle specific error codes
        if (response.status === 400) {
          showToast('error', data.message || 'Validation failed. Please check your input.');
        } else if (response.status === 504) {
          showToast('error', 'Request timed out. Please try again.');
        } else {
          showToast('error', data.message || 'Something went wrong. Please try again.');
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        showToast('error', 'Request timed out. Please try again.');
      } else {
        console.error('Form submission error:', error);
        showToast('error', 'Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, customWebhookUrl, showToast, resetForm]);

  return {
    formData,
    errors,
    isLoading,
    toast,
    customWebhookUrl,
    updateField,
    setCustomWebhookUrl,
    submitForm,
    hideToast,
  };
}
