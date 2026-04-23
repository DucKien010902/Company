import { ReactNode } from 'react';

export function FormField({
  label,
  htmlFor,
  description,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {description ? <span className="field-description">{description}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}
