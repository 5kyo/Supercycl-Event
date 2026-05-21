'use client';

import { en } from '@/content/en';
import { useMockState, daysUntilEnd } from '@/lib/mock-state';
import { LoginCta } from './LoginCta';

/**
 * CampaignHero — compact campaign intro shown only to logged-out users.
 * Replaces the full-canvas LandingHero. Slots/D-X live in the dimmed Hub body
 * below (HubHeader · SlotTension), so this hero stays minimal: festival label,
 * core promise, ICX subline, and a D-X chip on desktop.
 */
export function CampaignHero() {
  const { state } = useMockState();
  const days = daysUntilEnd(state);

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

          {/* Mobile-only inline login CTA — primary entry point on small screens. */}
          <div className="mt-lg lg:hidden">
            <LoginCta variant="inline" />
          </div>
        </div>

        {/* Desktop D-X chip — small, lives next to the copy. */}
        <div className="hidden lg:flex lg:flex-col lg:items-end lg:gap-2">
          <span className="upper-label text-text-tertiary">Ends in</span>
          <span
            className="tabnum accent-text font-mono font-bold"
            style={{ fontSize: 44, lineHeight: 1 }}
          >
            D-{days}
          </span>
          <span
            className="font-mono text-text-tertiary"
            style={{ fontSize: 11, letterSpacing: '0.1em' }}
          >
            JUL 07 · 23:59 KST
          </span>
        </div>
      </div>
    </section>
  );
}
