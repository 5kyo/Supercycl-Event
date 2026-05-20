'use client';

import { en } from '@/content/en';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { useMockState } from '@/lib/mock-state';
import { daysUntilEnd } from '@/lib/mock-state';

export function MyProgressMeter() {
  const { state } = useMockState();
  const remaining = Math.max(0, 500 - state.tradingVolume);
  const days = daysUntilEnd(state);

  return (
    <section className="mx-auto max-w-6xl px-6 py-4">
      <div className="flex flex-col gap-3 rounded-xl bg-surface p-5 ring-1 ring-mono-green/20">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-sm text-muted">{en.progress.volume(state.tradingVolume)}</span>
          <span className="text-sm text-muted">{en.progress.daysLeft(days)}</span>
        </div>
        <ProgressBar value={state.tradingVolume} max={500} ariaLabel="trading volume" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-mono-green">{en.progress.remaining(remaining)}</span>
          <span className="text-muted">{en.progress.slotsLeft(state.slotsRemaining)}</span>
        </div>
      </div>
    </section>
  );
}
