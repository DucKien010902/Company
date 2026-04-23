const DEFAULT_API_BASE_URL = 'http://localhost:5003/api';

export function getApiBaseUrl() {
  const raw = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}

export function buildBackendUrl(path: string) {
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${getApiBaseUrl()}/${normalized}`;
}
