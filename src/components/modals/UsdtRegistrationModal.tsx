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
        <fieldset className="mb-4 flex flex-col gap-2">
          <legend className="sr-only">Receiving method</legend>
          <label className="flex items-center gap-3 rounded-lg bg-bg/40 p-3">
            <input type="radio" name="m" checked={method === 'wallet'} onChange={() => setMethod('wallet')} />
            {en.modal.usdt.methodWallet}
          </label>
          <label className="flex items-center gap-3 rounded-lg bg-bg/40 p-3">
            <input type="radio" name="m" checked={method === 'exchange'} onChange={() => setMethod('exchange')} />
            {en.modal.usdt.methodExchange}
          </label>
        </fieldset>

        {method === 'wallet' ? (
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm">{en.modal.usdt.trc20Label}</span>
              <input
                aria-invalid={!!errors.trc20}
                aria-describedby={errors.trc20 ? 'err-trc20' : undefined}
                value={trc20}
                onChange={e => setTrc20(e.target.value)}
                className="rounded-md bg-bg/40 px-3 py-2 ring-1 ring-muted/20"
              />
              {errors.trc20 && <span id="err-trc20" className="text-xs text-red">{errors.trc20}</span>}
            </label>
            <p className="rounded-md bg-amber/10 p-3 text-xs text-amber">{en.modal.usdt.trc20Warning}</p>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={networkOk} onChange={e => setNetworkOk(e.target.checked)} />
              {en.modal.usdt.networkCheck}
            </label>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted">{en.modal.usdt.exchangeFixed}</p>
            <label className="flex flex-col gap-1">
              <span className="text-sm">{en.modal.usdt.okxUidLabel}</span>
              <input
                aria-invalid={!!errors.okxUid}
                aria-describedby={errors.okxUid ? 'err-okxUid' : undefined}
                value={okxUid}
                onChange={e => setOkxUid(e.target.value)}
                className="rounded-md bg-bg/40 px-3 py-2 ring-1 ring-muted/20"
              />
              {errors.okxUid && <span id="err-okxUid" className="text-xs text-red">{errors.okxUid}</span>}
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm">{en.modal.usdt.okxEmailLabel}</span>
              <input
                type="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'err-email' : undefined}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="rounded-md bg-bg/40 px-3 py-2 ring-1 ring-muted/20"
              />
              {errors.email && <span id="err-email" className="text-xs text-red">{errors.email}</span>}
            </label>
          </div>
        )}

        <label className="mt-4 flex items-start gap-2 text-sm">
          <input type="checkbox" checked={termsOk} onChange={e => setTermsOk(e.target.checked)} />
          <span>
            {en.modal.usdt.termsCheck}{' '}
            <button type="button" onClick={() => setShowTerms(true)} className="text-mono-green underline">
              {en.cta.viewTerms}
            </button>
          </span>
        </label>
        {errors.terms && <p className="text-xs text-red">{errors.terms}</p>}

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={submit} className="rounded-lg bg-mono-green px-5 py-2 font-semibold text-bg">
            {en.modal.usdt.submit}
          </button>
        </div>
      </Modal>
      {showTerms && <TermsViewerModal onClose={() => setShowTerms(false)} />}
    </>
  );
}
