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
        <span className="upper-label text-text-tertiary">My volume on Supercycl</span>
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

  // Pre-login eligibility hint. Inline, subtle — placed under the Sign in CTA
  // so non-YouthMeta visitors learn the entry criterion before bouncing
  // through the Supercycl login round-trip (spec §7.2).
  const youthMetaNotice = (
    <p
      className="text-text-tertiary"
      style={{ fontSize: 12, lineHeight: 1.5, marginTop: 10 }}
    >
      <span aria-hidden style={{ marginRight: 4 }}>ⓘ</span>
      {en.hero.youthMetaNotice} ·{' '}
      <a
        href={
          process.env.NEXT_PUBLIC_YOUTHMETA_JOIN_URL || 'https://youthmeta.com'
        }
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline-offset-2 hover:underline"
      >
        {en.hero.youthMetaLearnLink}
      </a>
    </p>
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
          <p
            className="uppercase text-text-tertiary"
            style={{ fontSize: 11, letterSpacing: '0.22em' }}
          >
            {en.meta.eventLabel}
          </p>
          {/* Mobile-only status strip — desktop carries the same info in the
              right column. Keeps LIVE + days-left visible at narrow widths
              so phone users see "currently running, N days remaining". */}
          <div className="mt-1 flex items-center gap-2 lg:hidden">
            <span
              className="inline-flex items-center gap-1.5 font-mono uppercase text-accent"
              style={{ fontSize: 11, letterSpacing: '0.22em' }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: '0 0 8px var(--accent)',
                  animation: 'event-pulse 1.6s ease-in-out infinite',
                }}
              />
              LIVE
            </span>
            <span aria-hidden style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span
              className="tabnum font-mono text-text-secondary-strong"
              style={{ fontSize: 13 }}
            >
              {days} {days === 1 ? 'day' : 'days'} left
            </span>
          </div>
          <h1
            className="mt-3 font-bold lg:mt-2"
            style={{
              fontSize: 'clamp(28px, 5vw, 44px)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
            }}
          >
            Trade $500 → Get{' '}
            <span className="accent-text tabnum font-mono">20</span>
            <span className="text-accent-light" style={{ fontSize: '0.55em', marginLeft: 6 }}>
              USDT
            </span>
          </h1>

          {/* Mobile right-side substitute — placed in flow under the copy. */}
          <div className="mt-lg lg:hidden">
            {loggedOut ? (
              <>
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
                {youthMetaNotice}
              </>
            ) : (
              progressChip
            )}
          </div>
        </div>

        {/* Desktop right column — LIVE badge + "N days left" above either Sign
            in or progress chip. The pulse on the dot signals "currently running"
            so the days remaining no longer reads as "until the event starts". */}
        <div className="hidden shrink-0 lg:flex lg:flex-col lg:items-end lg:gap-1.5">
          <span
            className="inline-flex items-center gap-1.5 font-mono uppercase text-accent"
            style={{ fontSize: 12, letterSpacing: '0.22em' }}
          >
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 10px var(--accent)',
                animation: 'event-pulse 1.6s ease-in-out infinite',
              }}
            />
            LIVE
          </span>
          <span className="mb-3 tabnum font-mono text-body-md text-text-secondary-strong">
            {days} {days === 1 ? 'day' : 'days'} left
          </span>
          {loggedOut ? (
            <>
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
              <div className="text-right">{youthMetaNotice}</div>
            </>
          ) : (
            progressChip
          )}
        </div>
      </div>
    </section>
  );
}
