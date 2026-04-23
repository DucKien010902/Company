import { NextRequest, NextResponse } from 'next/server';
import { buildBackendUrl } from '@/lib/backend';
import { ACCESS_TOKEN_COOKIE } from '@/lib/session-server';
import { parseDurationToSeconds } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const response = await fetch(buildBackendUrl('auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    cache: 'no-store',
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    return NextResponse.json(payload, { status: response.status });
  }

  const nextResponse = NextResponse.json({ success: true, permissions: payload.permissions ?? [] });
  nextResponse.cookies.set({
    name: ACCESS_TOKEN_COOKIE,
    value: payload.accessToken,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: parseDurationToSeconds(payload.expiresIn),
  });

  return nextResponse;
}
