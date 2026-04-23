import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export function buttonClass(variant: ButtonVariant = 'primary') {
  return cn(
    'button',
    variant === 'primary' && 'button-primary',
    variant === 'secondary' && 'button-secondary',
    variant === 'ghost' && 'button-ghost',
    variant === 'danger' && 'button-danger',
  );
}

export function Button({
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: ButtonVariant }) {
  return (
    <button className={cn(buttonClass(variant), className)} {...props}>
      {children}
    </button>
  );
}
