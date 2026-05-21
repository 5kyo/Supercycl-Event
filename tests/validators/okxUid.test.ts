import { describe, it, expect } from 'vitest';
import { validateOkxUid } from '@/lib/validators/okxUid';

describe('validateOkxUid', () => {
  it('accepts any non-empty raw input (no format check per spec §5.7)', () => {
    expect(validateOkxUid('123456').ok).toBe(true);
    expect(validateOkxUid('12345678901234567890').ok).toBe(true);
    // No length / charset restriction — ops verifies at payout time
    expect(validateOkxUid('12345').ok).toBe(true);
    expect(validateOkxUid('123456789012345678901').ok).toBe(true);
    expect(validateOkxUid('1234abc').ok).toBe(true);
    expect(validateOkxUid('user@example').ok).toBe(true);
  });
  it('rejects empty input', () => {
    expect(validateOkxUid('').ok).toBe(false);
  });
  it('rejects whitespace-only input', () => {
    expect(validateOkxUid('   ').ok).toBe(false);
  });
  it('trims surrounding whitespace before validating', () => {
    expect(validateOkxUid('  123456  ').ok).toBe(true);
  });
});
