'use client';

import { useMockState } from '@/lib/mock-state';

// Presets stored as USDT values; mapped to slot counts via /20 when dispatched.
// Each value lands on a poolTension boundary so the full color sequence
// (green → amber → orange → red → FULL) is one click away.
const USDT_PRESETS = [10_000, 2_000, 1_000, 200, 0];
const USDT_PER_SLOT = 20;
const USDT_POOL_TOTAL = 10_000;

export function SlotsSection() {
  const { state, dispatch } = useMockState();
  const usdtRemaining = state.slotsRemaining * USDT_PER_SLOT;
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">USDT Pool</h3>
      <p>Remaining: {usdtRemaining.toLocaleString()} / {USDT_POOL_TOTAL.toLocaleString()} USDT</p>
      <p className="text-xs text-muted">(= {state.slotsRemaining} / 500 slots)</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {USDT_PRESETS.map((usdt) => (
          <button
            key={usdt}
            type="button"
            onClick={() =>
              dispatch({ type: 'SET_SLOTS_REMAINING', value: usdt / USDT_PER_SLOT })
            }
            className="rounded-md bg-bg/40 px-2 py-1 text-xs"
          >
            {usdt.toLocaleString()}
          </button>
        ))}
      </div>
    </section>
  );
}
