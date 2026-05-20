'use client';

import { en } from '@/content/en';
import { CountdownTimer } from '@/components/shared/CountdownTimer';
import { CAMPAIGN_END, useMockState, daysUntilEnd } from '@/lib/mock-state';

/**
 * LandingHero — V2 Festival direction (full canvas fidelity).
 *
 * Layout (mobile):
 *   1. Top ticker (always visible — Festival energy)
 *   2. Auras: accent + cyan + magenta (decorative only)
 *   3. Big stacked statement "Trade $500. Get 20 USDT" + tagline + 13Q hint
 *   4. 2-col grid below hero: slots + D-29
 */
export function LandingHero() {
  const { state } = useMockState();
  const days = daysUntilEnd(state);
  const slots = state.slotsRemaining;
  const pct = Math.max(0, Math.min(100, (slots / 500) * 100));

  return (
    <>
      {/* Top ticker tape — runs LIVE on all viewports */}
      <div
        aria-hidden
        className="relative z-[1] flex h-9 items-center overflow-hidden border-b border-border-subtle"
        style={{ background: 'rgba(0,0,0,0.3)' }}
      >
        <div className="ticker-track upper-label" style={{ color: 'var(--text-secondary-strong)' }}>
          {[0, 1].map((dup) => (
            <span key={dup} className="inline-flex gap-6 pr-6">
              <span className="text-accent">● LIVE</span>
              <span>{slots} / 500 SLOTS</span>
              <span>D-{days} LEFT</span>
              <span>{en.meta.tagline}</span>
              <span>20 USDT + 100 ICX</span>
              <span>JUN 8 — JUL 7</span>
            </span>
          ))}
        </div>
      </div>

      <section className="relative overflow-hidden px-6 py-8 lg:px-16 lg:py-16">
        {/* Festival auras: accent + cyan + magenta */}
        <div
          aria-hidden
          className="aura aura-accent"
          style={{ top: -80, right: -60, width: 280, height: 280 }}
        />
        <div
          aria-hidden
          className="aura aura-cyan hidden lg:block"
          style={{ top: 80, left: -100, width: 260, height: 260 }}
        />
        <div
          aria-hidden
          className="aura aura-magenta"
          style={{ top: 200, right: -80, width: 220, height: 220 }}
        />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col">
            <p className="upper-label" style={{ color: 'var(--accent)' }}>
              Mobile launch festival
            </p>
            {/* Big statement — accent number is the loudest element */}
            <h1
              className="mt-3 font-bold"
              style={{
                fontSize: 'clamp(48px, 13vw, 96px)',
                lineHeight: 0.92,
                letterSpacing: '-0.035em',
                color: 'var(--text-primary)',
              }}
            >
              <span>Trade</span>
              <br />
              <span style={{ color: 'var(--text-tertiary)' }}>$500.</span>
              <br />
              <span>Get </span>
              <span
                className="accent-text tabnum font-mono"
              >
                20
              </span>
              <span className="text-accent-light" style={{ fontSize: '0.4em', marginLeft: 8 }}>
                USDT
              </span>
            </h1>

            {/* Sub-line with vertical accent rule */}
            <div className="mt-md flex items-center gap-md">
              <div
                aria-hidden
                className="shrink-0"
                style={{
                  width: 4,
                  height: 36,
                  borderRadius: 2,
                  background: 'var(--accent-gradient)',
                }}
              />
              <p className="text-body-md text-text-secondary-strong lg:text-body-lg">
                Then answer 13 questions —{' '}
                <span className="text-accent font-semibold">100 ICX</span> for your time.
              </p>
            </div>

            <p className="mt-md text-body-md text-text-secondary lg:text-body-lg">
              {en.meta.tagline}
            </p>
          </div>

          {/* Desktop countdown card (mobile uses the SlotTension + below grid) */}
          <div className="hidden lg:block">
            <div className="card-elevated px-6 py-5">
              <CountdownTimer endDate={CAMPAIGN_END} />
            </div>
          </div>
        </div>

        {/* Mobile-only 2-col grid: Slots + Ends-in */}
        <div className="relative mt-2xl grid grid-cols-2 gap-sm lg:hidden">
          <div className="card" style={{ padding: 16 }}>
            <p className="upper-label">Slots</p>
            <div className="mt-xs flex items-baseline gap-1">
              <span
                className="tabnum font-mono font-bold text-accent"
                style={{ fontSize: 32, lineHeight: 1 }}
              >
                {slots}
              </span>
              <span className="text-text-tertiary text-body-md">/ 500</span>
            </div>
            <div
              className="event-shimmer mt-md overflow-hidden"
              style={{ height: 3, background: 'var(--surface-track)', borderRadius: 2 }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: 'var(--accent-gradient)',
                }}
              />
            </div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <p className="upper-label">Ends in</p>
            <div className="mt-xs">
              <span
                className="tabnum accent-text font-mono font-bold"
                style={{ fontSize: 32, lineHeight: 1 }}
              >
                D-{days}
              </span>
            </div>
            <p
              className="mt-md font-mono text-text-tertiary"
              style={{ fontSize: 11, letterSpacing: '0.1em' }}
            >
              JUL 07 · 23:59 KST
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
