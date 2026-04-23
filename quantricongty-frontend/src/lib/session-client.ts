import type { SessionUser } from '@/types';

export function parseSessionUserFromBrowser(value?: string | null): SessionUser | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as SessionUser;
  } catch {
    return null;
  }
}

export function hasClientPermission(sessionUser: SessionUser | null | undefined, permission: string) {
  if (!sessionUser) return false;
  return sessionUser.permissions.includes(permission as never);
}
