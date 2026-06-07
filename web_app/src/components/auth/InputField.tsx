import { AlertCircle, LucideIcon } from 'lucide-react';
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
  touched?: boolean;
}

export default function InputField({
  label,
  icon: Icon,
  error,
  touched,
  className = '',
  ...props
}: InputFieldProps) {
  const hasError = error && touched;

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon
            size={18}
            className={hasError ? 'text-red-400' : 'text-[#8eaccd]'}
          />
        </div>
        <input
          {...props}
          className={`w-full pl-11 pr-4 py-3 bg-gray-50/50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm placeholder:text-gray-300 ${
            hasError
              ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
              : 'border-gray-100 focus:ring-[#8eaccd]/50 focus:border-[#8eaccd]'
          } ${className}`}
        />
      </div>
      {hasError && (
        <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}
