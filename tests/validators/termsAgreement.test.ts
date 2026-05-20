import { describe, it, expect } from 'vitest';
import { validateTermsAgreement } from '@/lib/validators/termsAgreement';

describe('validateTermsAgreement', () => {
  it('passes when both required boxes checked', () => {
    expect(validateTermsAgreement({ terms: true, network: true, requireNetwork: true }).ok).toBe(true);
  });
  it('fails when terms not checked', () => {
    const r = validateTermsAgreement({ terms: false, network: true, requireNetwork: true });
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error('expected failure');
    expect(r.message).toMatch(/terms/i);
  });
  it('fails when network confirmation not checked but required', () => {
    const r = validateTermsAgreement({ terms: true, network: false, requireNetwork: true });
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error('expected failure');
    expect(r.message).toMatch(/network/i);
  });
  it('passes when network confirmation not required', () => {
    expect(validateTermsAgreement({ terms: true, network: false, requireNetwork: false }).ok).toBe(true);
  });
});
