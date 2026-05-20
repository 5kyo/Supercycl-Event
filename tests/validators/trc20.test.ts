import { describe, it, expect } from 'vitest';
import { validateTrc20 } from '@/lib/validators/trc20';

describe('validateTrc20', () => {
  it('accepts a canonical TRC20 address', () => {
    expect(validateTrc20('TPL66VK2gCXNCN7tXKZK6VeNcVtmJP5sxQ')).toEqual({ ok: true });
  });
  it('rejects empty input', () => {
    expect(validateTrc20('').ok).toBe(false);
  });
  it('rejects address not starting with T', () => {
    expect(validateTrc20('XPL66VK2gCXNCN7tXKZK6VeNcVtmJP5sxQ').ok).toBe(false);
  });
  it('rejects address with wrong length', () => {
    expect(validateTrc20('TPL66VK2gCXNCN7tXKZK6VeNcVtmJP5sxQAA').ok).toBe(false);
  });
  it('rejects address with invalid characters', () => {
    expect(validateTrc20('TPL66VK2gCXNCN7tXKZK6VeNcVtmJP5sx!@').ok).toBe(false);
  });
});
