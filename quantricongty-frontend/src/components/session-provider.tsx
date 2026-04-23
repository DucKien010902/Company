'use client';

import { createContext, ReactNode, useContext, useMemo } from 'react';
import { SessionUser } from '@/types';
import { hasClientPermission } from '@/lib/session-client';

interface SessionContextValue {
  sessionUser: SessionUser | null;
  hasPermission: (permission: string) => boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children, sessionUser }: { children: ReactNode; sessionUser: SessionUser | null }) {
  const value = useMemo(
    () => ({
      sessionUser,
      hasPermission: (permission: string) => hasClientPermission(sessionUser, permission),
    }),
    [sessionUser],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessionUser() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionUser must be used inside SessionProvider');
  }
  return context;
}
