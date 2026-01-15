'use client';

import { useEffect } from 'react';
import type { ToastState } from '../lib/types';

interface ToastProps {
  toast: ToastState;
  onClose: () => void;
  autoCloseMs?: number;
}

export default function Toast({
  toast,
  onClose,
  autoCloseMs = 5000,
}: ToastProps) {
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(onClose, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [toast.show, onClose, autoCloseMs]);

  if (!toast.show) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed bottom-4 right-4 max-w-sm w-full p-4 rounded-lg shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {isSuccess ? (
            <svg
              className="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
            {toast.message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className={`
              inline-flex rounded-md p-1.5
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${isSuccess
                ? 'text-green-500 hover:bg-green-100 focus:ring-green-600'
                : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
              }
            `}
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
