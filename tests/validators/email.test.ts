import { describe, it, expect } from 'vitest';
import { validateEmail } from '@/lib/validators/email';

describe('validateEmail', () => {
  it('accepts canonical addresses', () => {
    expect(validateEmail('user@example.com').ok).toBe(true);
    expect(validateEmail('a.b+tag@sub.example.co.kr').ok).toBe(true);
  });
  it('rejects missing @', () => {
    expect(validateEmail('userexample.com').ok).toBe(false);
  });
  it('rejects missing TLD', () => {
    expect(validateEmail('user@example').ok).toBe(false);
  });
  it('rejects whitespace', () => {
    expect(validateEmail('user @example.com').ok).toBe(false);
  });
  it('rejects empty', () => {
    expect(validateEmail('').ok).toBe(false);
  });
  it('rejects consecutive dots in domain', () => {
    expect(validateEmail('user@example..com').ok).toBe(false);
  });
  it('rejects consecutive dots in local part', () => {
    expect(validateEmail('us..er@example.com').ok).toBe(false);
  });
  it('trims leading/trailing whitespace before validating', () => {
    expect(validateEmail('  user@example.com  ').ok).toBe(true);
  });
});
