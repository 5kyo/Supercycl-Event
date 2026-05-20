'use client';

import { useState } from 'react';
import { HubHeader } from './HubHeader';
import { ProgressTracker } from './ProgressTracker';
import { MyProgressMeter } from './MyProgressMeter';
import { UsdtRewardCard } from './UsdtRewardCard';
import { IcxRewardCard } from './IcxRewardCard';
import { HubCtaBar } from './HubCtaBar';
import { LiveSlotCounter } from '@/components/shared/LiveSlotCounter';
import { useMockState } from '@/lib/mock-state';
import { UsdtRegistrationModal } from '@/components/modals/UsdtRegistrationModal';
import { IcxRegistrationModal } from '@/components/modals/IcxRegistrationModal';
import { SurveyModal } from '@/components/modals/SurveyModal';

export function Hub() {
  const { state } = useMockState();
  const [open, setOpen] = useState<'usdt' | 'icx' | 'survey' | null>(null);

  return (
    <main className="pb-24 lg:pb-12">
      <HubHeader />
      <ProgressTracker />
      <section className="mx-auto max-w-6xl px-6">
        <LiveSlotCounter remaining={state.slotsRemaining} />
      </section>
      <MyProgressMeter />
      <section className="mx-auto grid max-w-6xl gap-4 px-6 py-4 lg:grid-cols-2">
        <UsdtRewardCard onRegister={() => setOpen('usdt')} />
        <IcxRewardCard onRegister={() => setOpen('icx')} />
      </section>
      <HubCtaBar onStartSurvey={() => setOpen('survey')} />

      {open === 'usdt' && <UsdtRegistrationModal onClose={() => setOpen(null)} />}
      {open === 'icx' && <IcxRegistrationModal onClose={() => setOpen(null)} />}
      {open === 'survey' && <SurveyModal onClose={() => setOpen(null)} />}
    </main>
  );
}
