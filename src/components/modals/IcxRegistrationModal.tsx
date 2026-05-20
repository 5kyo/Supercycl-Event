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
        <label className="flex flex-col gap-1">
          <span className="text-sm">{en.modal.icx.addressLabel}</span>
          <input
            aria-invalid={!!errors.addr}
            aria-describedby={errors.addr ? 'err-addr' : undefined}
            value={addr}
            onChange={e => setAddr(e.target.value)}
            className="rounded-md bg-bg/40 px-3 py-2 ring-1 ring-muted/20"
          />
          {errors.addr && <span id="err-addr" className="text-xs text-red">{errors.addr}</span>}
        </label>
        <label className="mt-4 flex items-start gap-2 text-sm">
          <input type="checkbox" checked={termsOk} onChange={e => setTermsOk(e.target.checked)} />
          <span>
            {en.modal.icx.termsCheck}{' '}
            <button type="button" onClick={() => setShowTerms(true)} className="text-mono-green underline">
              {en.cta.viewTerms}
            </button>
          </span>
        </label>
        {errors.terms && <p className="text-xs text-red">{errors.terms}</p>}
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={submit} className="rounded-lg bg-mono-green px-5 py-2 font-semibold text-bg">
            {en.modal.icx.submit}
          </button>
        </div>
      </Modal>
      {showTerms && <TermsViewerModal onClose={() => setShowTerms(false)} />}
    </>
  );
}
