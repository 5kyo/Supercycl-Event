'use client';

import { useMockState } from '@/lib/mock-state';

const PRESETS = [500, 423, 100, 50, 10, 0];

export function SlotsSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Slots</h3>
      <p>Remaining: {state.slotsRemaining} / 500</p>
      <p>My slot #: {state.userSlotNumber ?? '—'}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {PRESETS.map(p => (
          <button
            key={p}
            type="button"
            onClick={() => dispatch({ type: 'SET_SLOTS_REMAINING', value: p })}
            className="rounded-md bg-bg/40 px-2 py-1 text-xs"
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => dispatch({ type: 'CLAIM_SLOT', slotNumber: 500 - state.slotsRemaining, reachedAt: state.simulatedDate })}
          className="rounded-md bg-mono-green/15 px-2 py-1 text-xs text-mono-green"
        >
          Claim slot
        </button>
      </div>
    </section>
  );
}
