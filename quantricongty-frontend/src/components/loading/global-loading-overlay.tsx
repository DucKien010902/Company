'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { ColorOrbitLoader } from '@/components/loading/color-orbit-loader';
import { useRouteLoading } from '@/components/loading/route-loading-provider';
import { cn } from '@/lib/utils';

const SHOW_DELAY_MS = 100;
const MIN_VISIBLE_MS = 100;

export function GlobalLoadingOverlay() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const { isRouteLoading } = useRouteLoading();
  const shouldShow = isRouteLoading || isFetching > 0 || isMutating > 0;
  const [visible, setVisible] = useState(false);
  const visibleAtRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (shouldShow) {
      if (!visible) {
        timeoutRef.current = setTimeout(() => {
          visibleAtRef.current = Date.now();
          setVisible(true);
        }, SHOW_DELAY_MS);
      }

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    if (!visible) {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    const elapsed = visibleAtRef.current ? Date.now() - visibleAtRef.current : 0;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    timeoutRef.current = setTimeout(() => {
      visibleAtRef.current = null;
      setVisible(false);
    }, remaining);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [shouldShow, visible]);

  return (
    <div
      className={cn('global-loading-overlay', visible && 'global-loading-overlay-visible')}
      aria-hidden={!visible}
    >
      <ColorOrbitLoader className="global-loading-spinner" />
    </div>
  );
}
