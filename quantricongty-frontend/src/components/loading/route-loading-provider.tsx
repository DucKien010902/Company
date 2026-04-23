'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

type RouteLoadingContextValue = {
  isRouteLoading: boolean;
  startRouteLoading: () => void;
};

const RouteLoadingContext = createContext<RouteLoadingContextValue | null>(null);

export function RouteLoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  useEffect(() => {
    setIsRouteLoading(false);
  }, [pathname]);

  const value = useMemo<RouteLoadingContextValue>(
    () => ({
      isRouteLoading,
      startRouteLoading: () => setIsRouteLoading(true),
    }),
    [isRouteLoading],
  );

  return <RouteLoadingContext.Provider value={value}>{children}</RouteLoadingContext.Provider>;
}

export function useRouteLoading() {
  const context = useContext(RouteLoadingContext);
  if (!context) {
    throw new Error('useRouteLoading must be used within RouteLoadingProvider');
  }

  return context;
}
