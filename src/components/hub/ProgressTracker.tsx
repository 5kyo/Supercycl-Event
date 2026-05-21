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
  const loggedOut = state.authStatus === 'logged_out';
  // Strict sequential gating — each step's "done" requires the prior step to
  // also be done, so debug-drawer combos like (hasOkxLinked=false +
  // tradingVolume=500) can't paint step 2 green while step 1 still shows
  // "In progress".
  const step1Done = state.hasOkxLinked;
  const step2Done = step1Done && state.tradingVolume >= 500;
  const step3Done = step2Done && state.surveyCompleted;

  const step1: StepState = step1Done ? 'done' : 'inProgress';
  const step2: StepState = step2Done ? 'done' : step1Done ? 'inProgress' : 'locked';
  const step3: StepState = step3Done ? 'done' : step2Done ? 'inProgress' : 'locked';

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
          const cls = loggedOut ? 'step-chip opacity-50' : chipClass(r.state);
          return (
            <li
              key={r.num}
              className="card flex items-center justify-between"
              style={{ padding: '14px 18px' }}
            >
              <span className="flex items-center gap-md">
                <span className={cls} aria-hidden>{r.num}</span>
                <span className="text-body-lg">{r.label}</span>
              </span>
              {loggedOut ? (
                <span className="text-label-lg inline-flex items-center gap-1.5 text-text-tertiary">
                  <span aria-hidden>🔒</span>
                  <span className="hidden sm:inline">Sign in to view</span>
                </span>
              ) : (
                <span className={`text-label-lg ${b.cls}`}>{b.text}</span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
