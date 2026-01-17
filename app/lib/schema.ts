import { z } from 'zod';

// Phone normalization helper
const normalizePhone = (phone: string) => phone.replace(/[\s\-\(\)]/g, '');

// Israeli phone validation
const israeliPhoneSchema = z
  .string()
  .min(1, 'Phone is required')
  .transform(normalizePhone)
  .refine((val) => /^05\d{8}$/.test(val), {
    message: 'Please enter a valid Israeli phone (05X-XXXXXXX)',
  });

// Contact form validation schema
export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: israeliPhoneSchema,
  product: z
    .string()
    .min(1, 'Please select a product')
    .refine((val) => ['product-a', 'product-b', 'product-c'].includes(val), {
      message: 'Please select a valid product',
    }),
  message: z.string(),
  meetingDatetime: z.string(),
  meetingMedium: z.string(),
});

// Infer TypeScript type from schema
export type ContactFormData = z.infer<typeof contactFormSchema>;

// Form input type (before transformation)
export type ContactFormInput = z.input<typeof contactFormSchema>;
