'use client';

import { ReactNode } from 'react';
import { useSessionUser } from '@/components/session-provider';

export function PermissionGate({ permission, children }: { permission: string; children: ReactNode }) {
  const { hasPermission } = useSessionUser();
  if (!hasPermission(permission)) return null;
  return <>{children}</>;
}
