import { en } from '@/content/en';
import { CountdownTimer } from '@/components/shared/CountdownTimer';
import { CAMPAIGN_END } from '@/lib/mock-state';

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-6 py-16 lg:px-16 lg:py-24">
      {/* Inner radial accent — sits behind hero content, complements body glow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[640px] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0,230,118,0.18), transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-md">
          <p className="text-label-sm uppercase tracking-[0.22em] text-accent">
            {en.meta.period}
          </p>
          <h1
            className="text-4xl font-bold leading-tight lg:text-6xl"
            style={{
              backgroundImage: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {en.meta.title}
          </h1>
          <p className="text-body-lg text-text-secondary lg:text-xl">{en.meta.tagline}</p>
        </div>
        <div className="hidden lg:block">
          <div className="card-elevated px-6 py-5">
            <CountdownTimer endDate={CAMPAIGN_END} />
          </div>
        </div>
      </div>
    </section>
  );
}
