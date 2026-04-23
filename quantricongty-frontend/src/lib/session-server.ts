import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { SessionUser } from '@/types';

export const ACCESS_TOKEN_COOKIE = 'cc_access_token';

function decodeBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

export function decodeAccessTokenToSessionUser(accessToken: string): SessionUser | null {
  try {
    const [, payload] = accessToken.split('.');
    if (!payload) return null;

    const parsed = JSON.parse(decodeBase64Url(payload)) as SessionUser;
    if (!parsed.email || !Array.isArray(parsed.permissions) || !Array.isArray(parsed.roleIds)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function getServerAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getServerSessionUser(): Promise<SessionUser | null> {
  const accessToken = await getServerAccessToken();
  if (!accessToken) return null;

  return decodeAccessTokenToSessionUser(accessToken);
}

export async function requireServerSessionUser(): Promise<SessionUser> {
  const user = await getServerSessionUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}
