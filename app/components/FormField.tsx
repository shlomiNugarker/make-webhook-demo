interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'datetime-local' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
}

export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder,
  rows = 3,
}: FormFieldProps) {
  const errorId = `${id}-error`;

  const baseClasses = `
    w-full px-4 py-2.5 border rounded-lg shadow-sm bg-white
    text-gray-900 placeholder:text-gray-400
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
    disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500
    ${error
      ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
      : 'border-gray-200 hover:border-gray-300'
    }
  `;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className={baseClasses}
        />
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600 flex items-center gap-1" role="alert">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
