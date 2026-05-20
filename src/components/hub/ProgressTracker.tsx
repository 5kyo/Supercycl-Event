'use client';

import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';

type StepState = 'done' | 'inProgress' | 'locked';

function badge(s: StepState): { text: string; cls: string } {
  switch (s) {
    case 'done':       return { text: en.hub.stepDone, cls: 'text-accent' };
    case 'inProgress': return { text: en.hub.stepInProgress, cls: 'text-info' };
    case 'locked':     return { text: en.hub.stepLocked, cls: 'text-text-tertiary' };
  }
}

function chipClass(s: StepState): string {
  if (s === 'inProgress') return 'step-chip step-chip-active';
  if (s === 'done') return 'step-chip';
  return 'step-chip opacity-50';
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
    <section className="mx-auto max-w-6xl px-6 py-md">
      <h2 className="mb-md text-title-md">My progress</h2>
      <ol className="flex flex-col gap-sm">
        {rows.map(r => {
          const b = badge(r.state);
          return (
            <li
              key={r.num}
              className="card flex items-center justify-between"
              style={{ padding: '14px 18px' }}
            >
              <span className="flex items-center gap-md">
                <span className={chipClass(r.state)} aria-hidden>{r.num}</span>
                <span className="text-body-lg">{r.label}</span>
              </span>
              <span className={`text-label-lg ${b.cls}`}>{b.text}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
