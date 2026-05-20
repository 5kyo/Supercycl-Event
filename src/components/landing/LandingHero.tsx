'use client';

import { en } from '@/content/en';
import { CountdownTimer } from '@/components/shared/CountdownTimer';
import { CAMPAIGN_END } from '@/lib/mock-state';

/**
 * LandingHero — Festival direction.
 *
 * Mobile-first big-statement layout (was: muted gradient title).
 * Replaces the gradient-text H1 with a stacked "Trade $500 / Get 20 USDT"
 * statement whose accent numeral is the loudest element on the page.
 * Adds a slow ticker tape under the hero on lg+ for festival rhythm.
 */
export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-6 py-12 lg:px-16 lg:py-20">
      {/* Decorative auras — pure background, never under text */}
      <div
        aria-hidden
        className="event-aura event-aura-accent"
        style={{ top: -80, right: -60, width: 320, height: 320 }}
      />
      <div
        aria-hidden
        className="event-aura event-aura-cyan hidden lg:block"
        style={{ top: 80, left: -100, width: 280, height: 280 }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-3xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-md">
          <p className="text-label-sm uppercase tracking-[0.22em] text-accent">
            {en.meta.period}
          </p>
          {/* Big statement — accent number is the loudest element */}
          <h1
            className="font-bold text-text-primary"
            style={{
              fontSize: 'clamp(48px, 12vw, 96px)',
              lineHeight: 0.92,
              letterSpacing: '-0.035em',
            }}
          >
            <span>Trade</span>
            <br />
            <span className="text-text-tertiary">$500.</span>
            <br />
            <span>Get </span>
            <span
              className="font-mono"
              style={{
                backgroundImage: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                fontVariantNumeric: 'tabular-nums',
              }}
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

        <div className="hidden lg:block">
          <div className="card-elevated px-6 py-5">
            <CountdownTimer endDate={CAMPAIGN_END} />
          </div>
        </div>
      </div>

      {/* Festival ticker — desktop only, decorative */}
      <div
        aria-hidden
        className="relative z-[1] mt-3xl hidden h-9 items-center overflow-hidden rounded-md border border-border-subtle bg-black/30 lg:flex"
      >
        <div className="event-ticker-track text-label-sm uppercase tracking-[0.18em] text-text-secondary-strong">
          {[0, 1].map((dup) => (
            <span key={dup} className="inline-flex gap-7 pr-7">
              <span className="text-accent">● LIVE</span>
              <span>{en.meta.period}</span>
              <span>{en.meta.tagline}</span>
              <span>20 USDT + 100 ICX</span>
              <span>FIRST 500 TRADERS</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
