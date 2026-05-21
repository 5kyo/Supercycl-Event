'use client';

import { HubHeader } from './HubHeader';
import { useMockState, isQualifiedForUsdt, REGISTRATION_CUTOFF } from '@/lib/mock-state';
import { shortDate } from '@/content/en';

/** V2 Hub — Expired (past registration cutoff with un-registered rewards). */
export function HubExpired() {
  const { state } = useMockState();
  const slot = state.userSlotNumber ?? Math.max(1, 500 - state.slotsRemaining);
  const cutoffLabel = shortDate(REGISTRATION_CUTOFF);

  const items = [
    isQualifiedForUsdt(state) && state.usdtPayoutStatus !== 'PAID'
      ? {
          label: 'USDT · Trade reward',
          amount: '20',
          unit: 'USDT',
          note: `Slot #${slot} secured · ${cutoffLabel} cutoff missed`,
        }
      : null,
    state.surveyCompleted && state.icxPayoutStatus !== 'PAID'
      ? {
          label: 'ICX · Survey reward',
          amount: '100',
          unit: 'ICX',
          note: `Survey completed · ${cutoffLabel} cutoff missed`,
        }
      : null,
  ].filter(Boolean) as { label: string; amount: string; unit: string; note: string }[];

  return (
    <>
      <HubHeader />
      <section className="mx-auto max-w-6xl px-6 py-md">
        <p className="upper-label text-text-tertiary">EXPIRED · {cutoffLabel.toUpperCase()}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-md">
        <h1
          className="font-bold text-text-secondary-strong"
          style={{ fontSize: 28, lineHeight: 1.1, letterSpacing: '-0.02em' }}
        >
          Registration window
          <br />
          <span className="text-text-tertiary">has closed.</span>
        </h1>
        <p className="mt-md text-body-md text-text-secondary">
          Your reward expired because no receiving info was registered before {cutoffLabel}, 2026.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-md">
        <h2 className="mb-md upper-label">What happened</h2>
        {items.map((r) => (
          <article
            key={r.label}
            className="mb-sm relative"
            style={{
              padding: 16,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex items-baseline justify-between">
              <div>
                <p className="upper-label" style={{ fontSize: 10 }}>
                  {r.label}
                </p>
                <div className="mt-xs flex items-baseline gap-1">
                  <span
                    className="tabnum font-bold text-text-tertiary"
                    style={{
                      fontSize: 26,
                      lineHeight: 1,
                      textDecoration: 'line-through',
                      textDecorationColor: 'rgba(255,255,255,0.2)',
                    }}
                  >
                    {r.amount}
                  </span>
                  <span className="text-label-sm text-text-tertiary">{r.unit}</span>
                </div>
              </div>
              <span className="chip chip-muted">Expired</span>
            </div>
            <p className="mt-md text-body-sm text-text-tertiary">{r.note}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-md">
        <p className="text-body-sm text-text-tertiary text-center">
          For exceptions, contact{' '}
          <a className="text-accent" href="mailto:support@supercycl.io">
            support@supercycl.io
          </a>
          .
        </p>
      </section>
    </>
  );
}
