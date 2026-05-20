'use client';

import { LandingHero } from './LandingHero';
import { RewardSummaryCard } from './RewardSummaryCard';
import { ThreeStepGuide } from './ThreeStepGuide';
import { JoinCta } from './JoinCta';
import { SlotTension } from '@/components/shared/SlotTension';

export function Landing() {
  return (
    <main>
      <LandingHero />
      <section className="mx-auto max-w-6xl px-6">
        <SlotTension size="lg" />
      </section>
      <RewardSummaryCard />
      <ThreeStepGuide />
      <JoinCta />
    </main>
  );
}
