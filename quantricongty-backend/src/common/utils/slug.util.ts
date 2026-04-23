export function normalizeKeyword(value?: string | null) {
  if (!value) return '';

  return value
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}
