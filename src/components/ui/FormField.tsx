import React from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
}

/**
 * Shared form field wrapper — label, input slot, error text.
 * Replaces the duplicated FormGroup inline function across all step components.
 */
export function FormField({
  label,
  required = false,
  error,
  children,
  className = "",
  hint,
}: FormFieldProps) {
  return (
    <div className={`flex flex-col ${className}`}> {/* Removed gap-1.5 to use label margin */}
      <label className="gov-label !mb-1.5">
        {label}
        {required && <span className="required" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[10px] text-slate-400 mt-1 font-medium italic">{hint}</p>
      )}
      {error && (
        <p className="text-[10px] font-bold text-red-600 mt-1 uppercase tracking-tight" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
