'use client';

import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';

type StepState = 'done' | 'inProgress' | 'locked';

function badge(s: StepState): { text: string; cls: string } {
  switch (s) {
    case 'done':       return { text: en.hub.stepDone, cls: 'text-mono-green' };
    case 'inProgress': return { text: en.hub.stepInProgress, cls: 'text-blue' };
    case 'locked':     return { text: en.hub.stepLocked, cls: 'text-muted' };
  }
}

export function ProgressTracker() {
  const { state } = useMockState();
  const step1: StepState = state.hasOkxLinked ? 'done' : 'inProgress';
  const step2: StepState =
    state.tradingVolume >= 500 ? 'done' :
    state.hasOkxLinked         ? 'inProgress' : 'locked';
  const step3: StepState =
    state.surveyCompleted          ? 'done' :
    state.tradingVolume >= 500     ? 'inProgress' : 'locked';

  const rows = [
    { num: 1, label: en.steps.step1, state: step1 },
    { num: 2, label: en.steps.step2, state: step2 },
    { num: 3, label: en.steps.step3, state: step3 },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-4">
      <h2 className="mb-3 text-lg font-semibold">My progress</h2>
      <ol className="flex flex-col gap-2">
        {rows.map(r => {
          const b = badge(r.state);
          return (
            <li key={r.num} className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
              <span className="flex items-center gap-3">
                <span className="event-countdown-numerals text-mono-green">{r.num}</span>
                <span>{r.label}</span>
              </span>
              <span className={`text-sm ${b.cls}`}>{b.text}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
