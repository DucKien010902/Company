import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { buildBackendUrl } from '@/lib/backend';
import { ACCESS_TOKEN_COOKIE } from '@/lib/session-server';

type RouteContext = { params: Promise<{ path: string[] }> };

async function forward(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const targetUrl = `${buildBackendUrl(path.join('/'))}${request.nextUrl.search}`;
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('cookie');
  headers.set('authorization', `Bearer ${token}`);

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: 'no-store',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text();
  }

  const backendResponse = await fetch(targetUrl, init);
  const responseText = await backendResponse.text();
  const nextResponse = new NextResponse(responseText, { status: backendResponse.status });
  const contentType = backendResponse.headers.get('content-type');
  if (contentType) nextResponse.headers.set('content-type', contentType);
  return nextResponse;
}

export async function GET(request: NextRequest, context: RouteContext) {
  return forward(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return forward(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return forward(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return forward(request, context);
}
