import type { ValidationResult } from './trc20';

export function validateTermsAgreement(input: {
  terms: boolean;
  network: boolean;
  requireNetwork: boolean;
}): ValidationResult {
  if (!input.terms) return { ok: false, message: 'You must agree to the terms to continue' };
  if (input.requireNetwork && !input.network) {
    return { ok: false, message: 'You must confirm the network warning to continue' };
  }
  return { ok: true };
}
