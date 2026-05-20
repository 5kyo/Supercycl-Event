import { en } from '@/content/en';
import { CountdownTimer } from '@/components/shared/CountdownTimer';
import { CAMPAIGN_END } from '@/lib/mock-state';

export function LandingHero() {
  return (
    <section className="event-gradient px-6 py-12 lg:px-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-widest text-muted">{en.meta.period}</p>
          <h1 className="text-3xl font-bold leading-tight lg:text-5xl">{en.meta.title}</h1>
          <p className="text-lg text-muted lg:text-xl">{en.meta.tagline}</p>
        </div>
        <div className="hidden lg:block">
          <CountdownTimer endDate={CAMPAIGN_END} />
        </div>
      </div>
    </section>
  );
}
