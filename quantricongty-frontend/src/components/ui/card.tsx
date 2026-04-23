import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('card', className)}>{children}</section>;
}

export function CardHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="card-header">
      <div>
        <h3 className="card-title">{title}</h3>
        {description ? <p className="card-description">{description}</p> : null}
      </div>
      {actions ? <div className="card-actions">{actions}</div> : null}
    </div>
  );
}
