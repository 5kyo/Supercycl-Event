import type { ValidationResult } from './trc20';

// Pragmatic RFC 5322 subset — no whitespace, requires TLD
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(input: string): ValidationResult {
  if (!input) return { ok: false, message: 'Email is required' };
  if (!EMAIL_RE.test(input)) return { ok: false, message: 'Invalid email' };
  return { ok: true };
}
