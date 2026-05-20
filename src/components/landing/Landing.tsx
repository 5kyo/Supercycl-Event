'use client';

import { DesktopTopBar } from './DesktopTopBar';
import { LandingHero } from './LandingHero';
import { RewardSummaryCard } from './RewardSummaryCard';
import { ThreeStepGuide } from './ThreeStepGuide';
import { JoinCta } from './JoinCta';

export function Landing() {
  return (
    <main>
      <DesktopTopBar />
      <LandingHero />
      <RewardSummaryCard />
      <ThreeStepGuide />
      <JoinCta />
    </main>
  );
}
