'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';
import { Toaster } from 'sonner';
import { GlobalLoadingOverlay } from '@/components/loading/global-loading-overlay';
import { RouteLoadingProvider } from '@/components/loading/route-loading-provider';
import { SessionUser } from '@/types';
import { SessionProvider } from '@/components/session-provider';

export function Providers({ children, sessionUser }: { children: ReactNode; sessionUser: SessionUser | null }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <SessionProvider sessionUser={sessionUser}>
      <RouteLoadingProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <GlobalLoadingOverlay />
          <Toaster position="top-right" richColors />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </RouteLoadingProvider>
    </SessionProvider>
  );
}
