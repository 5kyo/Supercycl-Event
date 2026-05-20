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
    <section className="mx-auto max-w-6xl px-6 py-md">
      <div className="card-elevated flex flex-col gap-md" style={{ padding: '20px' }}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-label-lg text-text-secondary">
            {en.progress.volume(state.tradingVolume)}
          </span>
          <span className="text-label-sm text-text-tertiary">
            {en.progress.daysLeft(days)}
          </span>
        </div>
        <ProgressBar value={state.tradingVolume} max={500} ariaLabel="trading volume" />
        <div className="flex items-center justify-between text-label-lg">
          <span className="text-accent">{en.progress.remaining(remaining)}</span>
          <span className="text-text-tertiary">{en.progress.slotsLeft(state.slotsRemaining)}</span>
        </div>
      </div>
    </section>
  );
}
