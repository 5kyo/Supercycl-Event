'use client';

import { en } from '@/content/en';
import { HubHeader } from './HubHeader';
import { useMockState, daysUntilEnd } from '@/lib/mock-state';

/**
 * V2 Hub — Qualified, receiving info needed.
 * Triggered when user hit $500 trading volume but hasn't registered USDT
 * payout details yet.
 */
type Props = { onRegisterUsdt: () => void };

export function HubPending({ onRegisterUsdt }: Props) {
  const { state } = useMockState();
  const days = daysUntilEnd(state);
  const slot = state.userSlotNumber ?? Math.max(1, 500 - state.slotsRemaining);

  return (
    <>
      <HubHeader />
      <section
        className="relative mx-auto max-w-6xl px-6 py-md"
        style={{ zIndex: 1 }}
      >
        <p className="upper-label text-accent">● D-{days} · QUALIFIED</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-md">
        <span className="chip chip-accent" style={{ marginBottom: 12 }}>
          ✓ Slot #{slot} secured
        </span>
        <h1
          className="mt-md font-bold"
          style={{ fontSize: 34, lineHeight: 1.05, letterSpacing: '-0.025em' }}
        >
          $500 hit.
          <br />
          <span className="accent-text">20 USDT</span> is yours.
        </h1>
        <p className="mt-md text-body-md text-text-secondary">
          Just register where to send it — payouts every Monday 10:00 KST.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-md">
        <h2 className="mb-md upper-label">Your rewards</h2>

        <article
          className="card-elevated relative mb-sm overflow-hidden"
          style={{
            padding: 18,
            background:
              'linear-gradient(135deg, rgba(0,230,118,0.12), rgba(0,230,118,0.02))',
            border: '1px solid var(--accent-border-soft)',
          }}
        >
          <div
            aria-hidden
            className="aura"
            style={{
              top: -30,
              right: -30,
              width: 130,
              height: 130,
              background:
                'radial-gradient(circle, rgba(0,230,118,0.35), transparent 70%)',
            }}
          />
          <div className="relative">
            <span className="chip chip-warn">⏳ Receiving info needed</span>
            <div className="mt-md flex items-baseline gap-1">
              <span
                className="accent-text tabnum font-bold"
                style={{ fontSize: 36, lineHeight: 1 }}
              >
                20
              </span>
              <span className="text-accent-light text-label-lg">USDT</span>
            </div>
            <p className="mt-md text-body-sm text-text-tertiary">
              Register before Aug 6 to receive payout.
            </p>
            <button
              type="button"
              onClick={onRegisterUsdt}
              className="btn-primary-sm mt-md"
              style={{ height: 38, padding: '0 14px' }}
            >
              {en.cta.registerUsdt} →
            </button>
          </div>
        </article>

        <article className="card" style={{ padding: 18 }}>
          <span className="chip chip-muted">Opens Jun 29</span>
          <div className="mt-md flex items-baseline gap-1">
            <span
              className="tabnum font-bold text-text-primary"
              style={{ fontSize: 36, lineHeight: 1 }}
            >
              100
            </span>
            <span className="text-text-secondary text-label-lg">ICX</span>
          </div>
          <p className="mt-md text-body-sm text-text-tertiary">
            Survey opens after the trading phase.
          </p>
        </article>
      </section>
    </>
  );
}
