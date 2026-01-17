'use client';

import { useContactForm } from '../hooks/useContactForm';
import { PRODUCT_OPTIONS, MEETING_MEDIUM_OPTIONS } from '../lib/constants';
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
    updateField,
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
            id="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={(value) => updateField('fullName', value)}
            error={errors.fullName}
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

        {/* Product Section */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Product Interest
          </h3>
          <SelectField
            id="product"
            label="Product"
            value={formData.product}
            onChange={(value) => updateField('product', value)}
            options={PRODUCT_OPTIONS}
            error={errors.product}
            required
            disabled={isLoading}
          />

          <FormField
            id="message"
            label="Message"
            type="textarea"
            value={formData.message}
            onChange={(value) => updateField('message', value)}
            disabled={isLoading}
            placeholder="Tell us more about your needs..."
            rows={3}
          />
        </div>

        {/* Meeting Section */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Schedule a Meeting (Optional)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="meetingDatetime"
              label="Date & Time"
              type="datetime-local"
              value={formData.meetingDatetime}
              onChange={(value) => updateField('meetingDatetime', value)}
              disabled={isLoading}
            />

            <SelectField
              id="meetingMedium"
              label="Meeting Type"
              value={formData.meetingMedium}
              onChange={(value) => updateField('meetingMedium', value)}
              options={MEETING_MEDIUM_OPTIONS}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="pt-4">
          <SubmitButton isLoading={isLoading}>
            Send Message
          </SubmitButton>
        </div>
      </form>

      <Toast toast={toast} onClose={hideToast} />
    </>
  );
}
