'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { TermsViewerModal } from './TermsViewerModal';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';
import { validateIconAddress, validateTermsAgreement } from '@/lib/validators';

export function IcxRegistrationModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = useMockState();
  const [addr, setAddr] = useState('');
  const [termsOk, setTermsOk] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTerms, setShowTerms] = useState(false);

  function submit() {
    const errs: Record<string, string> = {};
    const a = validateIconAddress(addr);
    if (!a.ok) errs.addr = a.message;
    const t = validateTermsAgreement({ terms: termsOk, network: false, requireNetwork: false });
    if (!t.ok) errs.terms = t.message;
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    dispatch({ type: 'SET_ICX_ADDRESS', address: addr.trim() });
    dispatch({ type: 'SET_ICX_PAYOUT_STATUS', status: '대기' });
    onClose();
  }

  return (
    <>
      <Modal title={en.modal.icx.title} onClose={onClose}>
        <label className="flex flex-col gap-xs">
          <span className="text-label-lg text-text-secondary">{en.modal.icx.addressLabel}</span>
          <input
            aria-invalid={!!errors.addr}
            aria-describedby={errors.addr ? 'err-addr' : undefined}
            value={addr}
            onChange={e => setAddr(e.target.value)}
            className="input"
          />
          {errors.addr && <span id="err-addr" className="text-body-sm text-sell">{errors.addr}</span>}
        </label>
        <label className="mt-lg flex items-start gap-sm text-body-md">
          <input type="checkbox" checked={termsOk} onChange={e => setTermsOk(e.target.checked)} className="mt-1 accent-accent" />
          <span>
            {en.modal.icx.termsCheck}{' '}
            <button type="button" onClick={() => setShowTerms(true)} className="text-accent underline hover:text-accent-light">
              {en.cta.viewTerms}
            </button>
          </span>
        </label>
        {errors.terms && <p className="text-body-sm text-sell">{errors.terms}</p>}
        <div className="mt-2xl flex justify-end gap-md">
          <button type="button" onClick={onClose} className="btn-secondary-sm">
            Cancel
          </button>
          <button type="button" onClick={submit} className="btn-primary-sm">
            {en.modal.icx.submit}
          </button>
        </div>
      </Modal>
      {showTerms && <TermsViewerModal onClose={() => setShowTerms(false)} />}
    </>
  );
}
