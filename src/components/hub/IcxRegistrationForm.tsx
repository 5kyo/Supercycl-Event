'use client';

import { useState } from 'react';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';
import { validateIconAddress } from '@/lib/validators';

type Props = {
  /** Called after a successful submit. Modal passes onClose; card omits. */
  onSuccess?: () => void;
  /** When provided, renders a Cancel button next to Submit (modal-only). */
  onCancel?: () => void;
};

/**
 * IcxRegistrationForm — shared form body for ICX payout-address registration.
 *
 * Renders the ICON address input, the helper expander, the terms checkbox,
 * and Submit. Dispatches `SET_ICX_ADDRESS` + `SET_ICX_PAYOUT_STATUS('PENDING_PAYOUT')`
 * on success — the same contract the modal used to own.
 *
 * Used inline inside `IcxRewardCard` and inside `IcxRegistrationModal`.
 */
export function IcxRegistrationForm({ onSuccess, onCancel }: Props) {
  const { dispatch } = useMockState();
  const [addr, setAddr] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    const errs: Record<string, string> = {};
    const a = validateIconAddress(addr);
    if (!a.ok) errs.addr = a.message;
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    dispatch({ type: 'SET_ICX_ADDRESS', address: addr.trim() });
    dispatch({ type: 'SET_ICX_PAYOUT_STATUS', status: 'PENDING_PAYOUT' });
    onSuccess?.();
  }

  return (
    <>
      <label className="flex flex-col gap-xs">
        <span className="flex justify-between text-label-lg text-text-secondary">
          <span>{en.modal.icx.addressLabel}</span>
          <span
            className="font-mono text-text-tertiary"
            style={{ fontSize: 10, letterSpacing: '0.08em' }}
          >
            STARTS WITH HX
          </span>
        </span>
        <input
          aria-invalid={!!errors.addr}
          aria-describedby={errors.addr ? 'err-addr' : undefined}
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          className="input"
          placeholder="hxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        />
        {errors.addr && (
          <span id="err-addr" className="text-body-sm text-sell">
            {errors.addr}
          </span>
        )}
      </label>

      <details
        className="mt-md rounded-md"
        style={{
          padding: 12,
          background: 'var(--surface-2)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <summary
          className="flex cursor-pointer items-center gap-sm text-body-md text-text-secondary-strong"
          style={{ fontWeight: 500 }}
        >
          <span className="text-info">ℹ</span>
          How do I find my ICON wallet?
        </summary>
        <ul
          className="mt-md list-disc text-body-sm text-text-tertiary"
          style={{ paddingLeft: 18, lineHeight: 1.6 }}
        >
          <li>Hana Wallet — Settings → Wallet info</li>
          <li>ICONex — top of the main screen</li>
          <li>Centralized exchanges work too (ICX deposit address)</li>
        </ul>
      </details>

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
          {en.modal.icx.submit}
        </button>
      </div>
    </>
  );
}
