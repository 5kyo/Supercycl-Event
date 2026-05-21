'use client';

import { en } from '@/content/en';
import { useMockState, daysUntilEnd } from '@/lib/mock-state';

/**
 * CampaignHero — compact campaign intro for both auth states.
 *
 * Logged-out: D-X + Sign in button (right column on desktop, inline on mobile).
 * Logged-in: D-X + the user's $X / $500 progress chip with a thin progress bar
 * (replaces Sign in). The same hero block carries campaign context across the
 * whole flow.
 */
export function CampaignHero() {
  const { state, dispatch } = useMockState();
  const days = daysUntilEnd(state);
  const loggedOut = state.authStatus === 'logged_out';
  const signIn = () => dispatch({ type: 'SET_AUTH', status: 'logged_in' });
  const pct = Math.max(0, Math.min(100, (state.tradingVolume / 500) * 100));

  const progressChip = (
    <div className="flex flex-col gap-1" style={{ minWidth: 180 }}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="upper-label text-text-tertiary">My volume</span>
        <span className="tabnum font-mono text-body-sm text-text-secondary-strong">
          ${state.tradingVolume} <span className="text-text-tertiary">/ $500</span>
        </span>
      </div>
      <div
        className="h-1 w-full overflow-hidden rounded-full"
        style={{ background: 'var(--surface-track)' }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: 'var(--accent-gradient)',
            transition: 'width 800ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </div>
    </div>
  );

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

          {/* Mobile right-side substitute — placed in flow under the copy. */}
          <div className="mt-lg lg:hidden">
            {loggedOut ? (
              <button
                type="button"
                onClick={signIn}
                className="btn-primary"
                style={{
                  height: 48,
                  padding: '0 22px',
                  fontSize: 15,
                  alignSelf: 'flex-start',
                  boxShadow:
                    '0 8px 28px rgba(0,230,118,0.45), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px rgba(0,230,118,0.22)',
                  animation: 'event-pulse 2.4s ease-in-out infinite',
                }}
              >
                Sign in
              </button>
            ) : (
              progressChip
            )}
          </div>
        </div>

        {/* Desktop right column — D-X above either Sign in or progress chip. */}
        <div className="hidden shrink-0 lg:flex lg:flex-col lg:items-end lg:gap-3">
          <span
            className="tabnum accent-text font-mono font-bold"
            style={{ fontSize: 28, lineHeight: 1 }}
          >
            D-{days}
          </span>
          {loggedOut ? (
            <button
              type="button"
              onClick={signIn}
              className="btn-primary"
              style={{
                height: 48,
                padding: '0 22px',
                fontSize: 15,
                boxShadow:
                  '0 8px 28px rgba(0,230,118,0.45), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px rgba(0,230,118,0.22)',
                animation: 'event-pulse 2.4s ease-in-out infinite',
              }}
            >
              Sign in
            </button>
          ) : (
            progressChip
          )}
        </div>
      </div>
    </section>
  );
}
