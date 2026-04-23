import { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type ColorOrbitLoaderProps = {
  className?: string;
  label?: string;
};

export function ColorOrbitLoader({ className, label = 'Đang tải dữ liệu' }: ColorOrbitLoaderProps) {
  const segments = Array.from({ length: 8 }, (_, index) => index);

  return (
    <div className={cn('color-orbit-loader', className)} role="status" aria-live="polite" aria-label={label}>
      <div className="color-orbit-loader-track">
        {segments.map((segment) => (
          <span
            key={segment}
            className="color-orbit-segment"
            style={{ ['--segment-index' as string]: segment } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
