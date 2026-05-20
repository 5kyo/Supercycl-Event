'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { TermsViewerModal } from './TermsViewerModal';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';
import {
  validateTrc20,
  validateOkxUid,
  validateEmail,
  validateTermsAgreement,
} from '@/lib/validators';

/**
 * UsdtRegistrationModal — Festival direction.
 *
 * Functional changes: NONE. Same validation, dispatch, and submit flow.
 *
 * Visual changes:
 *  · Replaces the muted Modal title with a reward banner that shows
 *    "🎉 Slot #N / 500 secured" + a giant "20 USDT" tag at the right.
 *    This re-states the user's win at the top of the form — a small but
 *    direct push on the "register receiving info" conversion.
 *  · Method picker becomes a segmented control instead of stacked radios
 *    (single-line, easier scan on mobile).
 *  · Submit/cancel layout uses 1:2 ratio so the primary CTA dominates.
 *
 * All field labels, validators, and the dispatch contract are untouched.
 */
export function UsdtRegistrationModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useMockState();
  const [method, setMethod] = useState<'wallet' | 'exchange'>('wallet');
  const [trc20, setTrc20] = useState('');
  const [okxUid, setOkxUid] = useState('');
  const [email, setEmail] = useState('');
  const [networkOk, setNetworkOk] = useState(false);
  const [termsOk, setTermsOk] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTerms, setShowTerms] = useState(false);

  // Display slot # — derived from slots taken so far (1..500).
  const slotNumber = Math.max(1, 500 - state.slotsRemaining);

  function submit() {
    const errs: Record<string, string> = {};
    const requireNetwork = method === 'wallet';
    const terms = validateTermsAgreement({
      terms: termsOk,
      network: networkOk,
      requireNetwork,
    });
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
      registration:
        method === 'wallet'
          ? { status: 'wallet', trc20Address: trc20.trim() }
          : { status: 'exchange', okxUid: okxUid.trim(), email: email.trim() },
    });
    dispatch({ type: 'SET_USDT_PAYOUT_STATUS', status: '대기' });
    onClose();
  }

  return (
    <>
      <Modal title={en.modal.usdt.title} onClose={onClose} size="lg">
        {/* Reward banner — replaces the muted top area with a festive context strip */}
        <div
          className="relative mb-lg overflow-hidden rounded-lg"
          style={{
            padding: '20px 18px',
            background:
              'linear-gradient(135deg, rgba(0,230,118,0.18), rgba(0,230,118,0.04))',
            border: '1px solid var(--accent-border-soft)',
          }}
        >
          <div
            aria-hidden
            className="event-aura event-aura-accent"
            style={{ top: -30, right: -30, width: 140, height: 140 }}
          />
          <div className="relative flex items-center justify-between gap-md">
            <div>
              <p className="text-label-sm uppercase tracking-[0.18em] text-accent">
                🎉 Slot #{slotNumber} / 500 secured
              </p>
              <p className="mt-1 text-body-md text-text-primary">
                Tell us where to send it.
              </p>
            </div>
            <div className="text-right">
              <div
                className="font-bold text-accent"
                style={{
                  fontSize: 36,
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.02em',
                }}
              >
                20
              </div>
              <div className="mt-1 text-label-sm text-accent-light">USDT</div>
            </div>
          </div>
        </div>

        {/* Method picker — segmented control */}
        <p className="mb-2 text-label-sm uppercase tracking-[0.22em] text-text-secondary">
          Receiving method
        </p>
        <div
          className="mb-lg grid grid-cols-2 gap-sm rounded-lg border border-border-subtle p-1"
          style={{ background: 'var(--surface-2)' }}
          role="tablist"
          aria-label="USDT receiving method"
        >
          {(
            [
              { id: 'wallet', label: en.modal.usdt.methodWallet },
              { id: 'exchange', label: en.modal.usdt.methodExchange },
            ] as const
          ).map((opt) => {
            const selected = method === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setMethod(opt.id)}
                className="rounded-md py-3 text-body-md font-semibold transition-all"
                style={{
                  background: selected ? 'var(--accent-gradient)' : 'transparent',
                  color: selected ? 'var(--text-inverse)' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {method === 'wallet' ? (
          <div className="flex flex-col gap-md">
            <label className="flex flex-col gap-xs">
              <span className="flex justify-between text-label-lg text-text-secondary">
                {en.modal.usdt.trc20Label}
                <span className="font-mono text-body-sm tracking-[0.08em] text-text-tertiary">
                  STARTS WITH T
                </span>
              </span>
              <input
                aria-invalid={!!errors.trc20}
                aria-describedby={errors.trc20 ? 'err-trc20' : undefined}
                value={trc20}
                onChange={(e) => setTrc20(e.target.value)}
                className="input"
                placeholder="TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
              {errors.trc20 && (
                <span id="err-trc20" className="text-body-sm text-sell">
                  {errors.trc20}
                </span>
              )}
            </label>
            <div
              className="rounded-md p-3 text-body-sm"
              style={{
                background: 'rgba(255,167,38,0.10)',
                color: 'var(--warning)',
                border: '1px solid rgba(255,167,38,0.25)',
              }}
            >
              {en.modal.usdt.trc20Warning}
            </div>
            <label className="flex items-start gap-sm text-body-md">
              <input
                type="checkbox"
                checked={networkOk}
                onChange={(e) => setNetworkOk(e.target.checked)}
                className="mt-1 accent-accent"
              />
              <span>{en.modal.usdt.networkCheck}</span>
            </label>
          </div>
        ) : (
          <div className="flex flex-col gap-md">
            <p className="text-label-lg text-text-secondary">
              {en.modal.usdt.exchangeFixed}
            </p>
            <label className="flex flex-col gap-xs">
              <span className="text-label-lg text-text-secondary">
                {en.modal.usdt.okxUidLabel}
              </span>
              <input
                aria-invalid={!!errors.okxUid}
                aria-describedby={errors.okxUid ? 'err-okxUid' : undefined}
                value={okxUid}
                onChange={(e) => setOkxUid(e.target.value)}
                className="input"
              />
              {errors.okxUid && (
                <span id="err-okxUid" className="text-body-sm text-sell">
                  {errors.okxUid}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-xs">
              <span className="text-label-lg text-text-secondary">
                {en.modal.usdt.okxEmailLabel}
              </span>
              <input
                type="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'err-email' : undefined}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
              {errors.email && (
                <span id="err-email" className="text-body-sm text-sell">
                  {errors.email}
                </span>
              )}
            </label>
          </div>
        )}

        <label className="mt-lg flex items-start gap-sm text-body-md">
          <input
            type="checkbox"
            checked={termsOk}
            onChange={(e) => setTermsOk(e.target.checked)}
            className="mt-1 accent-accent"
          />
          <span>
            {en.modal.usdt.termsCheck}{' '}
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-accent underline hover:text-accent-light"
            >
              {en.cta.viewTerms}
            </button>
          </span>
        </label>
        {errors.terms && <p className="text-body-sm text-sell">{errors.terms}</p>}

        {/* Footer — primary dominates with 1:2 ratio */}
        <div className="mt-2xl flex gap-md">
          <button type="button" onClick={onClose} className="btn-secondary-sm flex-1">
            Cancel
          </button>
          <button type="button" onClick={submit} className="btn-primary-sm flex-[2]">
            {en.modal.usdt.submit}
          </button>
        </div>
      </Modal>
      {showTerms && <TermsViewerModal onClose={() => setShowTerms(false)} />}
    </>
  );
}
