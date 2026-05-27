'use client';

import { useMockState } from '@/lib/mock-state';
import type { UsdtPayoutStatus } from '@/lib/mock-state';

const STATUSES: UsdtPayoutStatus[] = ['NOT_REACHED', 'AWAITING_PAYOUT', 'PAID'];

export function UsdtSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">USDT</h3>
      <label className="flex items-center gap-2 text-xs">
        Status:
        <select
          value={state.usdtPayoutStatus}
          onChange={e => dispatch({ type: 'SET_USDT_PAYOUT_STATUS', status: e.target.value as UsdtPayoutStatus, txHash: e.target.value === 'PAID' ? '0xMOCKtxhash' : null })}
          className="rounded-md bg-bg/40 px-2 py-1"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
    </section>
  );
}
