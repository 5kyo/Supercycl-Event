import { describe, it, expect } from 'vitest';
import { validateIconAddress } from '@/lib/validators/iconAddress';

describe('validateIconAddress', () => {
  it('accepts hx + 40 hex chars', () => {
    expect(validateIconAddress('hx' + 'a'.repeat(40)).ok).toBe(true);
    expect(validateIconAddress('hx0123456789abcdef0123456789abcdef01234567').ok).toBe(true);
  });
  it('rejects wrong prefix', () => {
    expect(validateIconAddress('hy' + 'a'.repeat(40)).ok).toBe(false);
  });
  it('rejects wrong length', () => {
    expect(validateIconAddress('hx' + 'a'.repeat(39)).ok).toBe(false);
    expect(validateIconAddress('hx' + 'a'.repeat(41)).ok).toBe(false);
  });
  it('rejects uppercase hex (canonicalized lowercase)', () => {
    expect(validateIconAddress('hx' + 'A'.repeat(40)).ok).toBe(false);
  });
  it('rejects non-hex chars', () => {
    expect(validateIconAddress('hx' + 'z'.repeat(40)).ok).toBe(false);
  });
});
