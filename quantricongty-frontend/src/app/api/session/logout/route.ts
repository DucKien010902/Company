import { NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE } from '@/lib/session-server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ACCESS_TOKEN_COOKIE,
    value: '',
    path: '/',
    httpOnly: true,
    expires: new Date(0),
  });
  return response;
}
