'use client';

import { en } from '@/content/en';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { useMockState, volumeReachedNoOkx } from '@/lib/mock-state';

/**
 * MyProgressMeter — Festival direction.
 *
 * Was: small label + ProgressBar + two-line stats below.
 * Now: a single large "$237" stat as the visual anchor, followed by progress
 * bar with milestone markers and a friendly micro-copy line.
 *
 * Numbers are tabular-nums and sit at display-lg+ size so they dominate the
 * card — addressing the "밋밋함" feedback by giving the screen a clear focal
 * point. No new imports beyond what was already used.
 */
export function MyProgressMeter() {
  const { state } = useMockState();
  const remaining = Math.max(0, 500 - state.tradingVolume);
  const pct = Math.min(100, Math.round((state.tradingVolume / 500) * 100));
  const halfReached = state.tradingVolume >= 250;

  return (
    <section className="mx-auto max-w-6xl px-6 py-md">
      <div
        className="card-elevated relative flex flex-col overflow-hidden"
        style={{ padding: 24 }}
      >
        {/* aura */}
        <div
          aria-hidden
          className="event-aura event-aura-accent"
          style={{ top: -40, right: -40, width: 200, height: 200, opacity: 0.6 }}
        />

        <div className="relative flex flex-col gap-md">
          {/* Header row — label on the left, OKX-first guard pill on the
              right (desktop only). Pulling the pill up here frees the line
              under the big stat from a long warning and keeps the eye on
              the number; on mobile the pill stays inline below the stat
              because there isn't horizontal room for a header-right chip. */}
          <div className="flex items-start justify-between gap-3">
            <p className="text-label-sm uppercase tracking-[0.22em] text-text-secondary">
              Cumulative volume on Supercycl
            </p>
            {volumeReachedNoOkx(state) && (
              <span
                className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-amber/40 bg-amber/15 px-2.5 py-1 text-label-sm font-medium text-amber"
                data-testid="volume-needs-okx-desktop"
              >
                <span aria-hidden>⚠</span>
                {en.progress.remainingNeedsOkx}
              </span>
            )}
          </div>

          {/* Big stat — primary anchor */}
          <div className="flex items-baseline gap-2">
            <span
              className="font-bold text-text-primary"
              style={{
                fontSize: 'clamp(40px, 11vw, 64px)',
                lineHeight: 0.9,
                letterSpacing: '-0.035em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              ${state.tradingVolume}
            </span>
            <span className="text-text-tertiary font-mono text-body-lg">
              / $500
            </span>
            <span
              className="ml-2 rounded-full px-2 py-0.5 text-label-sm"
              style={{
                background: 'var(--info-tint, rgba(41,182,246,0.12))',
                color: 'var(--info)',
              }}
            >
              {pct}%
            </span>
          </div>

          {/* Friendly line — when volume is met but OKX is still unlinked,
              show the amber OKX-first guard pill inline (mobile only; the
              desktop copy lives in the header row above). Otherwise show
              the remaining-to-goal helper text on every breakpoint. */}
          {volumeReachedNoOkx(state) ? (
            <span
              className="inline-flex md:hidden items-center gap-1.5 self-start rounded-full border border-amber/40 bg-amber/15 px-2.5 py-1 text-label-sm font-medium text-amber"
              data-testid="volume-needs-okx"
            >
              <span aria-hidden>⚠</span>
              {en.progress.remainingNeedsOkx}
            </span>
          ) : (
            <p className="text-body-md text-text-secondary-strong">
              <span className="text-accent font-semibold">
                {en.progress.remaining(remaining)}
              </span>
            </p>
          )}

          {/* Progress bar */}
          <ProgressBar
            value={state.tradingVolume}
            max={500}
            ariaLabel="trading volume"
          />

          {/* Milestone scale */}
          <div className="flex justify-between font-mono text-body-sm text-text-tertiary">
            <span>$0</span>
            <span className={halfReached ? 'text-accent' : ''}>$250</span>
            <span>$500</span>
          </div>
        </div>
      </div>
    </section>
  );
}
