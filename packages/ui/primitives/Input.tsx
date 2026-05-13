import type { InputHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  helpText?: string;
  error?: string;
}

export function Input({ id, label, helpText, error, className, ...props }: InputProps) {
  const describedBy = error ? `${id}-error` : helpText ? `${id}-help` : undefined;
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-[0.12em] text-gold-500"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={clsx(
          "bg-ivory-200 border border-ink-300 px-4 py-3 text-base text-ink-900",
          "focus:border-gold-500 focus:bg-ivory-50 outline-none transition-colors",
          error && "border-error-500",
          className,
        )}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-error-500">{error}</p>
      )}
      {!error && helpText && (
        <p id={`${id}-help`} className="text-sm text-ink-500">{helpText}</p>
      )}
    </div>
  );
}
