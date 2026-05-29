import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  highlight?: boolean;
};

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  highlight?: boolean;
  labelClassName?: string;
};

function inputClass(highlight?: boolean, compact?: boolean) {
  const base = compact ? 'ext-input-compact' : 'ext-input';
  return highlight ? `${base} ${base}--highlighted` : base;
}

export function FormInput({
  label,
  highlight,
  className = '',
  ...inputProps
}: InputProps) {
  return (
    <div>
      <label className="text-secondary font-medium block mb-1">{label}</label>
      <input
        {...inputProps}
        className={cn(inputClass(highlight), className)}
      />
    </div>
  );
}

export function FormTextarea({
  label,
  highlight,
  labelClassName,
  className = '',
  ...textareaProps
}: TextareaProps) {
  return (
    <div>
      <label className={cn('text-secondary font-medium block mb-1', labelClassName)}>
        {label}
      </label>
      <textarea
        {...textareaProps}
        className={cn(inputClass(highlight), 'resize-none', className)}
      />
    </div>
  );
}

type CompactInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  highlight?: boolean;
};

export function FormCompactInput({
  label,
  highlight,
  className = '',
  ...inputProps
}: CompactInputProps) {
  return (
    <div>
      <label className="text-secondary font-medium block mb-1 text-[11px]">
        {label}
      </label>
      <input
        {...inputProps}
        className={cn(inputClass(highlight, true), className)}
      />
    </div>
  );
}
