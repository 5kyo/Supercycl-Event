'use client';

import { en } from '@/content/en';
import { useMockState, daysUntilEnd } from '@/lib/mock-state';

/**
 * CampaignHero — compact campaign intro shown only to logged-out users.
 * Replaces the full-canvas LandingHero. The hero block carries the only login
 * CTA: inline under the copy on mobile, in the right column next to a small
 * D-X label on desktop.
 */
export function CampaignHero() {
  const { state, dispatch } = useMockState();
  const days = daysUntilEnd(state);
  const signIn = () => dispatch({ type: 'SET_AUTH', status: 'logged_in' });

  return (
    <section className="relative overflow-hidden px-6 py-8 lg:px-16 lg:py-12">
      <div
        aria-hidden
        className="aura aura-accent"
        style={{ top: -60, right: -40, width: 220, height: 220 }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="flex flex-col">
          <p className="upper-label" style={{ color: 'var(--accent)' }}>
            Mobile launch festival
          </p>
          <h1
            className="mt-3 font-bold"
            style={{
              fontSize: 'clamp(28px, 5vw, 44px)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
            }}
          >
            Trade{' '}
            <span style={{ color: 'var(--text-tertiary)' }}>$500</span>
            <span className="text-text-tertiary"> → Get </span>
            <span className="accent-text tabnum font-mono">20</span>
            <span className="text-accent-light" style={{ fontSize: '0.55em', marginLeft: 6 }}>
              USDT
            </span>
          </h1>
          <p className="mt-md text-body-md text-text-secondary-strong">
            Then answer 13 questions —{' '}
            <span className="text-accent font-semibold">100 ICX</span> for your time.
          </p>
          <p className="mt-xs text-body-sm text-text-tertiary">{en.meta.tagline}</p>

          {/* Mobile inline CTA — primary entry point on small screens. */}
          <button
            type="button"
            onClick={signIn}
            className="btn-primary mt-lg w-full lg:hidden"
            style={{ height: 52, fontSize: 15 }}
          >
            Sign in with OKX to start
          </button>
        </div>

        {/* Desktop right column — compact D-X above the sign-in button. */}
        <div className="hidden shrink-0 lg:flex lg:flex-col lg:items-stretch lg:gap-3">
          <span
            className="tabnum accent-text self-end font-mono font-bold"
            style={{ fontSize: 28, lineHeight: 1 }}
          >
            D-{days}
          </span>
          <button
            type="button"
            onClick={signIn}
            className="btn-primary"
            style={{ height: 52, padding: '0 26px', fontSize: 15 }}
          >
            Sign in with OKX to start
          </button>
        </div>
      </div>
    </section>
  );
}
