import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';
import { Input } from './ui/Input';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError | undefined;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, error, id, ...inputProps },
  ref,
) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {label}
      </label>
      <Input id={id} ref={ref} {...inputProps} className="mt-1" />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message}</p>}
    </div>
  );
});
