export const toNullableString = (value?: string | null): string | null => {
  if (value == null) return null;
  const v = value.trim();
  return v === '' ? null : v;
};

export const toBoolean = (value?: string | null): boolean => {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return ['true', '1', 'yes', 'y'].includes(normalized);
};

export const toNullableInt = (value?: string | null): number | null => {
  if (!value || value.trim() === '') return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

export const toNullableFloat = (value?: string | null): number | null => {
  if (!value || value.trim() === '') return null;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
};

export const toSlug = (value: string): string => value.trim().toLowerCase();

export const normalizeEnum = <T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback?: T,
): T => {
  const normalized = value?.trim().toUpperCase() as T | undefined;

  if (normalized && allowed.includes(normalized)) {
    return normalized;
  }

  if (fallback) return fallback;

  throw new Error(`Invalid enum value: ${value}`);
};