'use client';

import { HubHeader } from './HubHeader';
import { useMockState } from '@/lib/mock-state';

/** V2 Hub — Completed, both rewards paid. */
export function HubCompleted() {
  const { state } = useMockState();

  const payouts = [
    {
      kind: 'USDT' as const,
      amount: '20',
      date: state.usdtPayoutStatus === '완료' ? 'Paid' : 'Pending',
      tx: state.usdtTxHash,
      tint: 'rgba(0,230,118,0.06)',
    },
    {
      kind: 'ICX' as const,
      amount: '100',
      date: state.icxPayoutStatus === '완료' ? 'Paid' : 'Pending',
      tx: state.icxTxHash,
      tint: 'rgba(34,211,238,0.06)',
    },
  ];

  return (
    <>
      <HubHeader />
      <section className="mx-auto max-w-6xl px-6 py-md">
        <p className="upper-label text-accent">● PAID</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-md">
        <h1
          className="font-bold"
          style={{ fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.025em' }}
        >
          You&apos;re <span className="accent-text">all set.</span>
          <br />
          <span className="text-text-tertiary">Thanks for joining.</span>
        </h1>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-md">
        <h2 className="mb-md upper-label">Payouts</h2>
        {payouts.map((r) => (
          <article
            key={r.kind}
            className="card-elevated relative mb-sm overflow-hidden"
            style={{
              padding: 18,
              background: `linear-gradient(135deg, ${r.tint}, transparent)`,
            }}
          >
            <div className="flex items-baseline justify-between">
              <div>
                <span className="chip chip-accent">✓ {r.date}</span>
                <div className="mt-md flex items-baseline gap-1">
                  <span
                    className="tabnum font-bold"
                    style={{ fontSize: 30, lineHeight: 1 }}
                  >
                    {r.amount}
                  </span>
                  <span className="text-text-secondary text-label-lg">{r.kind}</span>
                </div>
              </div>
            </div>
            {r.tx && (
              <div
                className="mt-md flex items-center justify-between"
                style={{ paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}
              >
                <span className="upper-label" style={{ fontSize: 10 }}>
                  Transaction
                </span>
                <a
                  className="font-mono text-accent"
                  style={{ fontSize: 12, letterSpacing: '0.04em' }}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  {r.tx.slice(0, 8)}…{r.tx.slice(-4)} ↗
                </a>
              </div>
            )}
          </article>
        ))}
      </section>

      {/* Keep-trading CTA */}
      <section className="mx-auto max-w-6xl px-6 py-md">
        <div
          className="flex items-center gap-md rounded-lg"
          style={{
            padding: '16px 18px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            className="inline-flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'var(--accent-tint)',
              fontSize: 18,
            }}
            aria-hidden
          >
            🚀
          </div>
          <div className="flex-1">
            <p className="text-title-sm" style={{ fontSize: 14 }}>
              Keep trading on Supercycl
            </p>
            <p className="mt-1 text-body-sm text-text-tertiary">
              The festival&apos;s over — the platform isn&apos;t.
            </p>
          </div>
          <a
            href="https://supercycl-mobile.vercel.app"
            className="text-accent font-bold"
            style={{ fontSize: 14 }}
          >
            →
          </a>
        </div>
      </section>
    </>
  );
}
