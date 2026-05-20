import type { ValidationResult } from './trc20';

const ICON_RE = /^hx[0-9a-f]{40}$/;

export function validateIconAddress(input: string): ValidationResult {
  const value = input.trim();
  if (!value) return { ok: false, message: 'ICON address is required' };
  if (!ICON_RE.test(value)) return { ok: false, message: 'Invalid ICON address' };
  return { ok: true };
}
