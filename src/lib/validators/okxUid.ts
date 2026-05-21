import type { ValidationResult } from './trc20';

// Per spec §5.7: no client-side format check. Empty / whitespace-only is
// rejected; everything else is stored raw and verified manually by ops at
// payout time (CS SOP D, §10.1).
export function validateOkxUid(input: string): ValidationResult {
  const value = input.trim();
  if (!value) return { ok: false, message: 'OKX UID is required' };
  return { ok: true };
}
