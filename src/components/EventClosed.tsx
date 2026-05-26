'use client';

import { en } from '@/content/en';

/**
 * Post-campaign goodbye page. Renders a minimal "thanks for riding with us"
 * hero + recap + open-app CTA for every visitor. With in-product address
 * registration removed, there is no longer a per-user "claim your reward"
 * card — outstanding payouts are pushed by the operator via OKX Internal
 * Transfer to the linked UID without any further user action.
 */
export function EventClosed() {
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

      <section className="relative mx-auto max-w-6xl px-6 py-2xl text-center">
        <p className="upper-label text-text-tertiary">{en.eventClosed.eyebrow}</p>
        <h1
          className="mt-md font-bold"
          style={{ fontSize: 44, lineHeight: 0.98, letterSpacing: '-0.03em' }}
        >
          {en.eventClosed.titleLine1}
          <br />
          <span className="accent-text">{en.eventClosed.titleLine2}</span>
        </h1>
        <p className="mt-md text-body-md text-text-secondary-strong">
          {en.eventClosed.subtitle}
        </p>
      </section>

      <section
        className="relative mx-auto max-w-6xl px-6 py-md"
        style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center justify-around text-center">
          <div>
            <div className="tabnum font-bold" style={{ fontSize: 18, lineHeight: 1 }}>
              {en.eventClosed.recap.traderCount}
            </div>
            <p className="upper-label text-text-tertiary mt-xs" style={{ fontSize: 10 }}>
              {en.eventClosed.recap.traderLabel}
            </p>
          </div>
          <div>
            <div className="tabnum font-bold" style={{ fontSize: 18, lineHeight: 1 }}>
              {en.eventClosed.recap.surveyCount}
            </div>
            <p className="upper-label text-text-tertiary mt-xs" style={{ fontSize: 10 }}>
              {en.eventClosed.recap.surveyLabel}
            </p>
          </div>
          <div>
            <div className="tabnum font-bold" style={{ fontSize: 18, lineHeight: 1 }}>
              {en.eventClosed.recap.volumeAmount}
            </div>
            <p className="upper-label text-text-tertiary mt-xs" style={{ fontSize: 10 }}>
              {en.eventClosed.recap.volumeLabel}
            </p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-md">
        <a
          href="https://supercycl-mobile.vercel.app"
          className="btn-secondary w-full"
        >
          {en.eventClosed.openApp} →
        </a>
      </section>
    </main>
  );
}
