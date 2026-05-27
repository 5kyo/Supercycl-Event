import { en } from '@/content/en';

/**
 * Replaces CampaignHero in the Hub once `eventEnded(state)` is true. The rest
 * of the Hub (cards, ProgressTracker, etc.) stays mounted so users can still
 * see their final reward state; this hero only signals "festival is over."
 */
export function CampaignHeroEnded() {
  return (
    <section className="relative overflow-hidden px-6 py-8 text-center lg:px-16 lg:py-12">
      <div
        aria-hidden
        className="aura aura-accent"
        style={{ top: -80, right: -60, width: 260, height: 260 }}
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="upper-label text-text-tertiary">{en.eventClosed.eyebrow}</p>
        <h1
          className="mt-md font-bold"
          style={{
            fontSize: 'clamp(28px, 5vw, 44px)',
            lineHeight: 0.98,
            letterSpacing: '-0.03em',
          }}
        >
          {en.eventClosed.titleLine1}
          <br />
          <span className="accent-text">{en.eventClosed.titleLine2}</span>
        </h1>
        <p className="mt-md text-body-md text-text-secondary-strong">
          {en.eventClosed.subtitle}
        </p>
      </div>
    </section>
  );
}
