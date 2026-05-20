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

// TEMPORARY survey stub modal — replaced by Task 16
import { Modal } from '@/components/modals/Modal';
function SurveyStub({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="[Stub] Survey" onClose={onClose}>
      <p className="text-sm">Survey modal will be implemented in Task 16.</p>
      <div className="mt-4 flex justify-end">
        <button type="button" onClick={onClose} className="rounded-lg bg-mono-green px-4 py-2 text-sm font-semibold text-bg">OK</button>
      </div>
    </Modal>
  );
}

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
      {open === 'survey' && <SurveyStub onClose={() => setOpen(null)} />}
    </main>
  );
}
