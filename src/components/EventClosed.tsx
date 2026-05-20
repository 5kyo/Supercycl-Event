'use client';

import { useMockState, isQualifiedForUsdt } from '@/lib/mock-state';

/**
 * V2 Event Closed — shown post Jul 7 to ALL users (logged in or out).
 * Final stats + Aug 6 registration cutoff warning + supercycl app CTA.
 */
type Props = { onRegisterUsdt: () => void; onRegisterIcx: () => void };

export function EventClosed({ onRegisterUsdt, onRegisterIcx }: Props) {
  const { state } = useMockState();
  const needsUsdt = isQualifiedForUsdt(state) && state.usdtPayoutStatus !== '완료';
  const needsIcx = state.surveyCompleted && state.icxPayoutStatus !== '완료';
  const stillCanRegister = needsUsdt || needsIcx;

  const onRegister = needsUsdt ? onRegisterUsdt : needsIcx ? onRegisterIcx : undefined;

  const stats: {
    v: string;
    sub: string;
    color: 'accent' | 'primary' | 'warning';
  }[] = [
    { v: '527', sub: 'traders qualified', color: 'accent' },
    { v: '738', sub: 'surveys completed', color: 'primary' },
    { v: '$1.2M', sub: 'total volume traded', color: 'primary' },
    { v: 'D-29', sub: 'cutoff to register', color: 'warning' },
  ];

  return (
    <main className="relative" style={{ paddingBottom: 32 }}>
      <div
        aria-hidden
        className="aura aura-accent"
        style={{ top: -80, right: -60, width: 260, height: 260 }}
      />
      <div
        aria-hidden
        className="aura aura-cyan"
        style={{ top: 200, left: -100, width: 220, height: 220 }}
      />

      <section className="relative mx-auto max-w-6xl px-6 py-md">
        <p className="upper-label text-text-tertiary">JUL 07 · 23:59 KST · ENDED</p>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-2xl">
        <h1
          className="font-bold"
          style={{ fontSize: 44, lineHeight: 0.98, letterSpacing: '-0.03em' }}
        >
          That&apos;s
          <br />
          <span className="accent-text">a wrap.</span>
        </h1>
        <p className="mt-md text-body-md text-text-secondary-strong">
          Mobile Launch Festival ended Jul 7, 2026. Reward registration closes{' '}
          <b className="text-text-primary">Aug 6</b>.
        </p>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-md">
        <h2 className="mb-md upper-label">Festival in numbers</h2>
        <div className="grid grid-cols-2 gap-sm">
          {stats.map((s) => (
            <div key={s.sub} className="card" style={{ padding: 16 }}>
              <div
                className="tabnum font-bold"
                style={{
                  fontSize: 28,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  color:
                    s.color === 'accent'
                      ? 'var(--accent)'
                      : s.color === 'warning'
                      ? 'var(--warning)'
                      : 'var(--text-primary)',
                }}
              >
                {s.v}
              </div>
              <p className="mt-xs text-body-sm text-text-tertiary">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {stillCanRegister && onRegister && (
        <section className="relative mx-auto max-w-6xl px-6 py-md">
          <div
            className="card-elevated relative overflow-hidden"
            style={{
              padding: 18,
              background: 'linear-gradient(135deg, rgba(255,167,38,0.10), transparent)',
              border: '1px solid var(--warning-border)',
            }}
          >
            <div className="flex items-start gap-md">
              <span
                className="inline-flex items-center justify-center font-bold shrink-0"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(255,167,38,0.2)',
                  color: 'var(--warning)',
                  fontSize: 13,
                }}
                aria-hidden
              >
                !
              </span>
              <div>
                <p className="text-title-sm text-warning" style={{ fontSize: 13 }}>
                  Haven&apos;t registered yet?
                </p>
                <p
                  className="mt-1 text-body-sm"
                  style={{ color: 'rgba(255,167,38,0.75)' }}
                >
                  You have until Aug 6 to register your wallet. After that, rewards expire.
                </p>
                <button
                  type="button"
                  onClick={onRegister}
                  className="btn-primary-sm mt-md"
                >
                  Register now →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="relative mx-auto max-w-6xl px-6 py-md">
        <a
          href="https://supercycl-mobile.vercel.app"
          className="btn-secondary w-full"
        >
          Open Supercycl app →
        </a>
      </section>
    </main>
  );
}
