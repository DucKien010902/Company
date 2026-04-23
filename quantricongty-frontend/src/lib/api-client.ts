import { ApiErrorPayload, ListQuery, PaginatedResponse } from '@/types';

export class ApiError extends Error {
  status: number;
  details?: ApiErrorPayload;

  constructor(message: string, status: number, details?: ApiErrorPayload) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function buildPath(path: string, query?: ListQuery) {
  const url = new URL(path, 'http://local.internal');
  if (query?.page) url.searchParams.set('page', String(query.page));
  if (query?.limit) url.searchParams.set('limit', String(query.limit));
  if (query?.search) url.searchParams.set('search', query.search);
  return `${url.pathname}${url.search}`;
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const details = payload as ApiErrorPayload | undefined;
    const rawMessage = details?.message;
    const message = Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage || details?.error || 'Request failed';
    throw new ApiError(message, response.status, details);
  }

  return payload as T;
}

export function makeCrudApi<TItem, TCreate, TUpdate>(resource: string) {
  return {
    list(query?: ListQuery) {
      return requestJson<PaginatedResponse<TItem>>(buildPath(`/api/proxy/${resource}`, query));
    },
    get(id: string) {
      return requestJson<TItem>(`/api/proxy/${resource}/${id}`);
    },
    create(payload: TCreate) {
      return requestJson<TItem>(`/api/proxy/${resource}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    update(id: string, payload: TUpdate) {
      return requestJson<TItem>(`/api/proxy/${resource}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },
    remove(id: string) {
      return requestJson<{ success: boolean }>(`/api/proxy/${resource}/${id}`, {
        method: 'DELETE',
      });
    },
  };
}
