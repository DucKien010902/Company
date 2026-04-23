import { cn } from '@/lib/utils';

export function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'success' | 'warning' }) {
  return <span className={cn('badge', tone === 'success' && 'badge-success', tone === 'warning' && 'badge-warning')}>{children}</span>;
}
