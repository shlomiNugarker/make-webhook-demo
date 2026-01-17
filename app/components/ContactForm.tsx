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
