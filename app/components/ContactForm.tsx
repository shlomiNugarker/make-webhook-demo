'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { contactFormSchema, type ContactFormData } from '../lib/schema';
import { PRODUCT_OPTIONS, API_TIMEOUT_MS } from '../lib/constants';
import type { ToastState, SubmitResponse } from '../lib/types';
import Toast from './Toast';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Briefcase, Send, Loader2, Settings } from 'lucide-react';

export default function ContactForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customWebhookUrl, setCustomWebhookUrl] = useState('');
  const [devPassword, setDevPassword] = useState('');
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: 'success',
    message: '',
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      product: '',
      message: '',
    },
  });

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          _webhookUrl: customWebhookUrl || undefined,
          _devPassword: devPassword || undefined,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result: SubmitResponse = await response.json();

      switch (result.status) {
        case 'ok':
          reset();
          if (result.nextUrl?.startsWith('http')) {
            window.open(result.nextUrl, '_blank');
          } else {
            router.push(result.nextUrl || '/thank-you');
          }
          break;
        case 'duplicate':
          showToast('error', result.message || 'You have already submitted a request.');
          break;
        case 'error':
        default: {
          let errorMessage = result.message || 'Something went wrong.';
          if (result.error) {
            const { status, statusText, details, type } = result.error;
            if (status && statusText) {
              errorMessage = `Error ${status}: ${statusText}`;
            }
            if (details) {
              errorMessage += ` - ${details}`;
            }
            if (type) {
              errorMessage = `[${type.toUpperCase()}] ${errorMessage}`;
            }
          }
          showToast('error', errorMessage);
          break;
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
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={72}
            height={72}
            className="w-14 sm:w-18  mx-auto mb-4 rounded-xl"
          />
          <CardTitle className="text-xl sm:text-2xl">Get in Touch</CardTitle>
          <CardDescription className="text-base">
            Fill out the form below and we&apos;ll get back to you within 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Contact Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Contact Information</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.fullName}
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.email}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="054-1234567"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.phone}
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Project Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <span>Project Details</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">
                  Service <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="product"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_OPTIONS.filter(opt => opt.value).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.product && (
                  <p className="text-sm text-destructive">{errors.product.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your project, goals, and timeline..."
                  rows={4}
                  disabled={isSubmitting}
                  {...register('message')}
                />
              </div>
            </div>

            {/* Developer Testing Section */}
            <Separator />
            <div className="space-y-4">
                  <details className="group">
                    <summary className="flex items-center gap-2 cursor-pointer list-none text-sm font-medium text-muted-foreground">
                      <Settings className="w-4 h-4" />
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        Developer Testing
                      </span>
                      <svg
                        className="w-4 h-4 ml-auto transition-transform group-open:rotate-90"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </summary>
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="devPassword">Developer Password</Label>
                        <Input
                          id="devPassword"
                          type="password"
                          value={devPassword}
                          onChange={(e) => setDevPassword(e.target.value)}
                          disabled={isSubmitting}
                          placeholder="Enter password to enable custom webhook"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="webhookUrl">Custom Webhook URL</Label>
                        <Input
                          id="webhookUrl"
                          type="url"
                          value={customWebhookUrl}
                          onChange={(e) => setCustomWebhookUrl(e.target.value)}
                          disabled={isSubmitting || !devPassword}
                          placeholder="https://webhook.site/... or https://hook.make.com/..."
                        />
                        <p className="text-xs text-muted-foreground">
                          Get a test URL from{' '}
                          <a
                            href="https://webhook.site"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline"
                          >
                            webhook.site
                          </a>
                        </p>
                      </div>
                    </div>
                  </details>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 sm:py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Toast toast={toast} onClose={hideToast} />
    </>
  );
}
