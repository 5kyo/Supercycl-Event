'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { TermsViewerModal } from './TermsViewerModal';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';
import { validateIconAddress, validateTermsAgreement } from '@/lib/validators';

/**
 * V2 Festival ICX Modal — reward banner ("Survey complete · 13/13" + 100 ICX),
 * input with "starts with hx" badge, helper expander for finding wallet.
 */
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
        {/* Reward banner */}
        <div
          className="relative mb-lg overflow-hidden rounded-lg"
          style={{
            padding: '20px 18px',
            background:
              'linear-gradient(135deg, rgba(217,70,239,0.12), rgba(0,230,118,0.06))',
            border: '1px solid var(--accent-border-soft)',
          }}
        >
          <div
            aria-hidden
            className="aura aura-accent"
            style={{ top: -30, right: -30, width: 120, height: 120 }}
          />
          <div className="relative flex items-center justify-between gap-md">
            <div>
              <p
                className="font-mono uppercase text-accent"
                style={{ fontSize: 11, letterSpacing: '0.18em' }}
              >
                ✓ Survey complete · 13 / 13
              </p>
              <p className="mt-1 text-body-md text-text-primary">
                Tell us where to send your ICX.
              </p>
            </div>
            <div className="text-right">
              <div
                className="tabnum font-bold text-text-primary"
                style={{ fontSize: 36, lineHeight: 1 }}
              >
                100
              </div>
              <div className="mt-1 text-label-sm text-text-secondary">ICX</div>
            </div>
          </div>
        </div>

        {/* Wallet address input */}
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

        {/* Helper expander */}
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

        {/* Terms */}
        <label
          className="mt-lg flex cursor-pointer items-start gap-sm rounded-md text-body-md"
          style={{ padding: 12, background: 'var(--surface-2)' }}
        >
          <input
            type="checkbox"
            checked={termsOk}
            onChange={(e) => setTermsOk(e.target.checked)}
            className="mt-1 accent-accent"
          />
          <span>
            {en.modal.icx.termsCheck}{' '}
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

        {/* Footer 1:2 ratio */}
        <div className="mt-2xl flex gap-md">
          <button type="button" onClick={onClose} className="btn-secondary-sm flex-1">
            Cancel
          </button>
          <button type="button" onClick={submit} className="btn-primary-sm" style={{ flex: 2 }}>
            {en.modal.icx.submit}
          </button>
        </div>
      </Modal>
      {showTerms && <TermsViewerModal onClose={() => setShowTerms(false)} />}
    </>
  );
}
