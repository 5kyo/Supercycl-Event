import type { ValidationResult } from './trc20';

// Tentative — refine when OKX UID spec is finalized (Open Issue F-1 in design doc)
const OKX_UID_RE = /^\d{6,20}$/;

export function validateOkxUid(input: string): ValidationResult {
  const value = input.trim();
  if (!value) return { ok: false, message: 'OKX UID is required' };
  if (!OKX_UID_RE.test(value)) return { ok: false, message: 'Invalid OKX UID' };
  return { ok: true };
}
