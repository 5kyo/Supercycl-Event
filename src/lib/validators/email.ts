import type { ValidationResult } from './trc20';

// Pragmatic RFC 5322 subset — no whitespace, requires TLD with non-dot segments
const EMAIL_RE = /^[^\s@.]+(?:\.[^\s@.]+)*@[^\s@.]+(?:\.[^\s@.]+)+$/;

export function validateEmail(input: string): ValidationResult {
  const value = input.trim();
  if (!value) return { ok: false, message: 'Email is required' };
  if (!EMAIL_RE.test(value)) return { ok: false, message: 'Invalid email' };
  return { ok: true };
}
