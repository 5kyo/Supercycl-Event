'use client';

import { DesktopTopBar } from './DesktopTopBar';
import { LandingHero } from './LandingHero';
import { RewardSummaryCard } from './RewardSummaryCard';
import { ThreeStepGuide } from './ThreeStepGuide';

export function Landing() {
  return (
    <main>
      <DesktopTopBar />
      <LandingHero />
      <RewardSummaryCard />
      <ThreeStepGuide />
    </main>
  );
}
