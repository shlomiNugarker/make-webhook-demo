'use client';

import { useContactForm } from '../hooks/useContactForm';
import { MEETING_TIME_OPTIONS, PRODUCT_OPTIONS } from '../lib/constants';
import FormField from './FormField';
import SelectField from './SelectField';
import SubmitButton from './SubmitButton';
import Toast from './Toast';

export default function ContactForm() {
  const {
    formData,
    errors,
    isLoading,
    toast,
    customWebhookUrl,
    updateField,
    setCustomWebhookUrl,
    submitForm,
    hideToast,
  } = useContactForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Contact Info Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Contact Information
          </h3>
          <FormField
            id="name"
            label="Full Name"
            value={formData.name}
            onChange={(value) => updateField('name', value)}
            error={errors.name}
            required
            disabled={isLoading}
            placeholder="John Doe"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => updateField('email', value)}
              error={errors.email}
              required
              disabled={isLoading}
              placeholder="john@example.com"
            />

            <FormField
              id="phone"
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(value) => updateField('phone', value)}
              error={errors.phone}
              required
              disabled={isLoading}
              placeholder="054-1234567"
            />
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Preferences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              id="meeting_time"
              label="Meeting Time"
              value={formData.meeting_time}
              onChange={(value) => updateField('meeting_time', value)}
              options={MEETING_TIME_OPTIONS}
              disabled={isLoading}
            />

            <SelectField
              id="product"
              label="Product Interest"
              value={formData.product}
              onChange={(value) => updateField('product', value)}
              options={PRODUCT_OPTIONS}
              disabled={isLoading}
            />
          </div>

          <FormField
            id="location"
            label="Location"
            value={formData.location}
            onChange={(value) => updateField('location', value)}
            disabled={isLoading}
            placeholder="Tel Aviv, Israel"
          />
        </div>

        {/* Webhook URL for Testing */}
        <div className="pt-4 border-t border-gray-100">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <svg
                className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                Developer Testing
              </span>
            </summary>
            <div className="mt-4 pl-6">
              <label
                htmlFor="webhookUrl"
                className="block text-sm font-medium text-gray-600 mb-1.5"
              >
                Webhook URL
              </label>
              <input
                id="webhookUrl"
                type="url"
                value={customWebhookUrl}
                onChange={(e) => setCustomWebhookUrl(e.target.value)}
                disabled={isLoading}
                placeholder="https://hook.make.com/... or https://webhook.site/..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm transition-colors"
              />
              <p className="mt-2 text-xs text-gray-500">
                Get a test URL from{' '}
                <a
                  href="https://webhook.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  webhook.site
                </a>
                {' '}or enter your Make.com webhook URL
              </p>
            </div>
          </details>
        </div>

        <div className="pt-2">
          <SubmitButton isLoading={isLoading}>
            Send Message
          </SubmitButton>
        </div>
      </form>

      <Toast toast={toast} onClose={hideToast} />
    </>
  );
}
