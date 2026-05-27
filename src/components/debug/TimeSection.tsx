'use client';

import { useMockState } from '@/lib/mock-state';

const JUMPS: { label: string; date: string }[] = [
  { label: 'D-day',         date: '2026-06-08' },
  { label: 'End-trade',     date: '2026-06-28' },
  { label: 'Start-survey',  date: '2026-06-29' },
  { label: 'D-3',           date: '2026-07-04' },
  { label: 'Final Day',     date: '2026-07-07' },
  { label: 'Post-end',      date: '2026-07-22' },
];

export function TimeSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Time</h3>
      <input
        type="date"
        value={state.simulatedDate}
        onChange={e => dispatch({ type: 'SET_SIMULATED_DATE', date: e.target.value })}
        className="rounded-md bg-bg/40 px-2 py-1"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {JUMPS.map(j => (
          <button
            key={j.label}
            type="button"
            onClick={() => dispatch({ type: 'SET_SIMULATED_DATE', date: j.date })}
            className="rounded-md bg-bg/40 px-2 py-1 text-xs"
          >
            {j.label}
          </button>
        ))}
      </div>
    </section>
  );
}
