'use client';

import { LandingHero } from './LandingHero';
import { RewardSummaryCard } from './RewardSummaryCard';
import { ThreeStepGuide } from './ThreeStepGuide';
import { JoinCta } from './JoinCta';
import { LiveSlotCounter } from '@/components/shared/LiveSlotCounter';
import { useMockState } from '@/lib/mock-state';

export function Landing() {
  const { state } = useMockState();
  return (
    <main>
      <LandingHero />
      <section className="mx-auto max-w-6xl px-6">
        <LiveSlotCounter remaining={state.slotsRemaining} />
      </section>
      <RewardSummaryCard />
      <ThreeStepGuide />
      <JoinCta />
    </main>
  );
}
