'use client';

import { useMockState } from '@/lib/mock-state';
import type { IcxPayoutStatus } from '@/lib/mock-state';

const STATUSES: IcxPayoutStatus[] = ['NOT_REACHED', 'AWAITING_PAYOUT', 'PAID'];
const ICX_CONSUMED_PRESETS = [0, 20_000, 50_000, 80_000, 98_000, 100_000];

export function IcxSection() {
  const { state, dispatch } = useMockState();
  return (
    <section className="flex flex-col gap-2">
      <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-muted">ICX</h3>
      <label className="flex items-center gap-2 text-xs">
        Status:
        <select
          value={state.icxPayoutStatus}
          onChange={e => dispatch({ type: 'SET_ICX_PAYOUT_STATUS', status: e.target.value as IcxPayoutStatus, txHash: e.target.value === 'PAID' ? '0xMOCKicxtx' : null })}
          className="rounded-md bg-bg/40 px-2 py-1"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <label className="flex items-center gap-2 text-xs">
        Non-trader amount (ICX):
        <input
          type="number"
          min={0}
          step={1}
          value={state.nonTraderIcxAmount ?? ''}
          placeholder="?? (TBD)"
          onChange={(e) =>
            dispatch({
              type: 'SET_NON_TRADER_ICX_AMOUNT',
              value: e.target.value === '' ? null : Number(e.target.value),
            })
          }
          className="w-24 rounded-md bg-bg/40 px-2 py-1"
        />
      </label>
      <div className="flex flex-col gap-1 text-xs">
        <p>Consumed: {state.icxConsumed.toLocaleString()} / 100,000 ICX</p>
        <div className="flex flex-wrap gap-2">
          {ICX_CONSUMED_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => dispatch({ type: 'SET_ICX_CONSUMED', value: p })}
              className="rounded-md bg-bg/40 px-2 py-1 text-xs"
            >
              {p.toLocaleString()}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
