export type ValidationResult = { ok: true } | { ok: false; message: string };

const TRC20_RE = /^T[A-Za-z0-9]{33}$/;

export function validateTrc20(input: string): ValidationResult {
  if (!input) return { ok: false, message: 'Address is required' };
  if (!TRC20_RE.test(input)) return { ok: false, message: 'Invalid TRC20 address' };
  return { ok: true };
}
