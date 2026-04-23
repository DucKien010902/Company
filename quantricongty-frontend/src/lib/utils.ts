import { RelatedRecord } from '@/types';

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function relationLabel(value?: string | RelatedRecord | null) {
  if (!value) return '-';
  if (typeof value === 'string') return value;
  return value.fullName || value.displayName || value.name || value.code || value.email || value._id;
}

export function parseMultiline(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function stringifyJson(value: unknown) {
  if (!value || (typeof value === 'object' && Object.keys(value as Record<string, unknown>).length === 0)) {
    return '{}';
  }
  return JSON.stringify(value, null, 2);
}

export function safeParseJson(value: string) {
  if (!value.trim()) return {};
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    throw new Error('JSON không hợp lệ. Vui lòng kiểm tra lại định dạng trường tuỳ chỉnh.');
  }
}

export function parseDurationToSeconds(value?: string) {
  if (!value) return 86400;
  const match = value.trim().match(/^(\d+)([smhd])$/i);
  if (!match) return 86400;
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit === 's') return amount;
  if (unit === 'm') return amount * 60;
  if (unit === 'h') return amount * 60 * 60;
  return amount * 60 * 60 * 24;
}
