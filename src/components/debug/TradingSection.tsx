'use client';

import { useMockState } from '@/lib/mock-state';

const PRESETS = [0, 250, 499, 500, 1500];

export function TradingSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Trading</h3>
      <p>Volume: ${state.tradingVolume}</p>
      <input
        type="range"
        min={0}
        max={2000}
        step={10}
        value={state.tradingVolume}
        onChange={e => dispatch({ type: 'SET_TRADING_VOLUME', value: Number(e.target.value) })}
        className="w-full"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {PRESETS.map(p => (
          <button
            key={p}
            type="button"
            onClick={() => dispatch({ type: 'SET_TRADING_VOLUME', value: p })}
            className="rounded-md bg-bg/40 px-2 py-1 text-xs"
          >
            ${p}
          </button>
        ))}
      </div>
    </section>
  );
}
