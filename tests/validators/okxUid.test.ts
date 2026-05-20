import { describe, it, expect } from 'vitest';
import { validateOkxUid } from '@/lib/validators/okxUid';

describe('validateOkxUid', () => {
  it('accepts 6-20 digit numeric UID', () => {
    expect(validateOkxUid('123456').ok).toBe(true);
    expect(validateOkxUid('12345678901234567890').ok).toBe(true);
  });
  it('rejects too-short UID', () => {
    expect(validateOkxUid('12345').ok).toBe(false);
  });
  it('rejects too-long UID', () => {
    expect(validateOkxUid('123456789012345678901').ok).toBe(false);
  });
  it('rejects non-numeric characters', () => {
    expect(validateOkxUid('1234abc').ok).toBe(false);
  });
  it('rejects empty input', () => {
    expect(validateOkxUid('').ok).toBe(false);
  });
  it('trims surrounding whitespace before validating', () => {
    expect(validateOkxUid('  123456  ').ok).toBe(true);
  });
});
