import type { ValidationResult } from './trc20';

const ICON_RE = /^hx[0-9a-f]{40}$/;

export function validateIconAddress(input: string): ValidationResult {
  if (!input) return { ok: false, message: 'ICON address is required' };
  if (!ICON_RE.test(input)) return { ok: false, message: 'Invalid ICON address' };
  return { ok: true };
}
