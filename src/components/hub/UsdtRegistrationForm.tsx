'use client';

import { useState } from 'react';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';
import { validateTrc20, validateOkxUid, validateEmail } from '@/lib/validators';

type Props = {
  /** Called after a successful submit. Modal passes onClose; card omits. */
  onSuccess?: () => void;
  /** When provided, renders a Cancel button next to Submit (modal-only). */
  onCancel?: () => void;
};

/**
 * UsdtRegistrationForm — shared form body for USDT payout-address registration.
 *
 * Renders the receiving method picker (Wallet/Exchange), the matching fields,
 * network/terms checkboxes, validation errors, and a Submit button. Dispatches
 * `SET_USDT_REGISTRATION` and `SET_USDT_PAYOUT_STATUS('PENDING_PAYOUT')` on success — the
 * same contract the modal used to own.
 *
 * Used inline inside `UsdtRewardCard` (no Cancel) and inside
 * `UsdtRegistrationModal` (Cancel renders alongside the modal close).
 */
export function UsdtRegistrationForm({ onSuccess, onCancel }: Props) {
  const { dispatch } = useMockState();
  const [method, setMethod] = useState<'wallet' | 'exchange'>('exchange');
  const [trc20, setTrc20] = useState('');
  const [okxUid, setOkxUid] = useState('');
  const [email, setEmail] = useState('');
  const [networkOk, setNetworkOk] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    const errs: Record<string, string> = {};

    if (method === 'wallet') {
      if (!networkOk) errs.network = 'You must confirm the network warning to continue';
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
    dispatch({ type: 'SET_USDT_PAYOUT_STATUS', status: 'PENDING_PAYOUT' });
    onSuccess?.();
  }

  return (
    <>
      <p
        id="usdt-method-label"
        className="mb-2 text-label-sm uppercase tracking-[0.22em] text-text-secondary"
      >
        Receiving method
      </p>
      <div
        className="mb-lg grid grid-cols-2 gap-sm rounded-lg border border-border-subtle p-1"
        style={{ background: 'var(--surface-2)' }}
        role="radiogroup"
        aria-labelledby="usdt-method-label"
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
              role="radio"
              aria-checked={selected}
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
          <div className="flex flex-col gap-1">
            <label className="flex items-start gap-sm text-body-md">
              <input
                type="checkbox"
                checked={networkOk}
                onChange={(e) => setNetworkOk(e.target.checked)}
                className="mt-1 accent-accent"
              />
              <span>{en.modal.usdt.networkCheck}</span>
            </label>
            <p className="pl-6 text-body-sm text-warning">
              ⚠ {en.modal.usdt.trc20Warning}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-md">
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

      {errors.network && <p className="mt-lg text-body-sm text-sell">{errors.network}</p>}

      <div className="mt-lg flex gap-md">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary-sm flex-1">
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={submit}
          className="btn-primary-sm"
          style={onCancel ? { flex: 2 } : { alignSelf: 'flex-start' }}
        >
          {en.modal.usdt.submit}
        </button>
      </div>
    </>
  );
}
