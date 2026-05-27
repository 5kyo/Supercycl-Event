'use client';

import { useMockState } from '@/lib/mock-state';
import type { IcxPayoutStatus } from '@/lib/mock-state';

const STATUSES: IcxPayoutStatus[] = ['NOT_REACHED', 'AWAITING_PAYOUT', 'PAID'];

export function IcxSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">ICX</h3>
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
    </section>
  );
}
