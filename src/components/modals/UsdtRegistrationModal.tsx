'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { TermsViewerModal } from './TermsViewerModal';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';
import { validateTrc20, validateOkxUid, validateEmail, validateTermsAgreement } from '@/lib/validators';

export function UsdtRegistrationModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = useMockState();
  const [method, setMethod] = useState<'wallet' | 'exchange'>('wallet');
  const [trc20, setTrc20] = useState('');
  const [okxUid, setOkxUid] = useState('');
  const [email, setEmail] = useState('');
  const [networkOk, setNetworkOk] = useState(false);
  const [termsOk, setTermsOk] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTerms, setShowTerms] = useState(false);

  function submit() {
    const errs: Record<string, string> = {};
    const requireNetwork = method === 'wallet';
    const terms = validateTermsAgreement({ terms: termsOk, network: networkOk, requireNetwork });
    if (!terms.ok) errs.terms = terms.message;

    if (method === 'wallet') {
      const v = validateTrc20(trc20);
      if (!v.ok) errs.trc20 = v.message;
    } else {
      const u = validateOkxUid(okxUid);
      if (!u.ok) errs.okxUid = u.message;
      const e = validateEmail(email);
      if (!e.ok) errs.email = e.message;
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    dispatch({
      type: 'SET_USDT_REGISTRATION',
      registration: method === 'wallet'
        ? { status: 'wallet', trc20Address: trc20.trim() }
        : { status: 'exchange', okxUid: okxUid.trim(), email: email.trim() },
    });
    dispatch({ type: 'SET_USDT_PAYOUT_STATUS', status: '대기' });
    onClose();
  }

  return (
    <>
      <Modal title={en.modal.usdt.title} onClose={onClose} size="lg">
        <fieldset className="mb-lg flex flex-col gap-sm">
          <legend className="sr-only">Receiving method</legend>
          <label
            className="flex items-center gap-md rounded-md cursor-pointer transition-colors"
            style={{
              background: method === 'wallet' ? 'var(--accent-tint)' : 'var(--surface-2)',
              border: method === 'wallet' ? '1px solid var(--accent-border-soft)' : '1px solid var(--border-subtle)',
              padding: '14px',
            }}
          >
            <input type="radio" name="m" checked={method === 'wallet'} onChange={() => setMethod('wallet')} className="accent-accent" />
            <span className="text-body-md">{en.modal.usdt.methodWallet}</span>
          </label>
          <label
            className="flex items-center gap-md rounded-md cursor-pointer transition-colors"
            style={{
              background: method === 'exchange' ? 'var(--accent-tint)' : 'var(--surface-2)',
              border: method === 'exchange' ? '1px solid var(--accent-border-soft)' : '1px solid var(--border-subtle)',
              padding: '14px',
            }}
          >
            <input type="radio" name="m" checked={method === 'exchange'} onChange={() => setMethod('exchange')} className="accent-accent" />
            <span className="text-body-md">{en.modal.usdt.methodExchange}</span>
          </label>
        </fieldset>

        {method === 'wallet' ? (
          <div className="flex flex-col gap-md">
            <label className="flex flex-col gap-xs">
              <span className="text-label-lg text-text-secondary">{en.modal.usdt.trc20Label}</span>
              <input
                aria-invalid={!!errors.trc20}
                aria-describedby={errors.trc20 ? 'err-trc20' : undefined}
                value={trc20}
                onChange={e => setTrc20(e.target.value)}
                className="input"
              />
              {errors.trc20 && <span id="err-trc20" className="text-body-sm text-sell">{errors.trc20}</span>}
            </label>
            <p
              className="rounded-md text-body-sm"
              style={{
                background: 'rgba(255,167,38,0.10)',
                color: 'var(--warning)',
                border: '1px solid rgba(255,167,38,0.25)',
                padding: '12px',
              }}
            >
              {en.modal.usdt.trc20Warning}
            </p>
            <label className="flex items-start gap-sm text-body-md">
              <input type="checkbox" checked={networkOk} onChange={e => setNetworkOk(e.target.checked)} className="mt-1 accent-accent" />
              <span>{en.modal.usdt.networkCheck}</span>
            </label>
          </div>
        ) : (
          <div className="flex flex-col gap-md">
            <p className="text-label-lg text-text-secondary">{en.modal.usdt.exchangeFixed}</p>
            <label className="flex flex-col gap-xs">
              <span className="text-label-lg text-text-secondary">{en.modal.usdt.okxUidLabel}</span>
              <input
                aria-invalid={!!errors.okxUid}
                aria-describedby={errors.okxUid ? 'err-okxUid' : undefined}
                value={okxUid}
                onChange={e => setOkxUid(e.target.value)}
                className="input"
              />
              {errors.okxUid && <span id="err-okxUid" className="text-body-sm text-sell">{errors.okxUid}</span>}
            </label>
            <label className="flex flex-col gap-xs">
              <span className="text-label-lg text-text-secondary">{en.modal.usdt.okxEmailLabel}</span>
              <input
                type="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'err-email' : undefined}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
              />
              {errors.email && <span id="err-email" className="text-body-sm text-sell">{errors.email}</span>}
            </label>
          </div>
        )}

        <label className="mt-lg flex items-start gap-sm text-body-md">
          <input type="checkbox" checked={termsOk} onChange={e => setTermsOk(e.target.checked)} className="mt-1 accent-accent" />
          <span>
            {en.modal.usdt.termsCheck}{' '}
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
            {en.modal.usdt.submit}
          </button>
        </div>
      </Modal>
      {showTerms && <TermsViewerModal onClose={() => setShowTerms(false)} />}
    </>
  );
}
