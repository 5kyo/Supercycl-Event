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

// TEMPORARY stub modals — replaced by Tasks 14-16
function StubModal({ id, onClose }: { id: string; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`stub-${id}`}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div className="rounded-xl bg-surface-solid p-8" onClick={e => e.stopPropagation()}>
        <p className="mb-4">[Stub modal: {id}]</p>
        <button onClick={onClose} className="rounded bg-mono-green px-4 py-2 text-bg">Close</button>
      </div>
    </div>
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

      {open && <StubModal id={open} onClose={() => setOpen(null)} />}
    </main>
  );
}
