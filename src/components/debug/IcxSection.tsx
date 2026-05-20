'use client';

import { useMockState } from '@/lib/mock-state';
import type { IcxPayoutStatus } from '@/lib/mock-state';

const STATUSES: IcxPayoutStatus[] = ['미달성', '수령 정보 미등록', '대기', '보류', '완료', '만료'];

export function IcxSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">ICX</h3>
      <p className="mb-1 text-xs">Address: {state.icxAddress ?? '—'}</p>
      <div className="mb-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => dispatch({ type: 'SET_ICX_ADDRESS', address: null })} className="rounded-md bg-bg/40 px-2 py-1 text-xs">Clear</button>
        <button type="button" onClick={() => dispatch({ type: 'SET_ICX_ADDRESS', address: 'hx' + 'a'.repeat(40) })} className="rounded-md bg-bg/40 px-2 py-1 text-xs">Sample</button>
      </div>
      <label className="flex items-center gap-2 text-xs">
        Status:
        <select
          value={state.icxPayoutStatus}
          onChange={e => dispatch({ type: 'SET_ICX_PAYOUT_STATUS', status: e.target.value as IcxPayoutStatus, txHash: e.target.value === '완료' ? '0xMOCKicxtx' : null })}
          className="rounded-md bg-bg/40 px-2 py-1"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
    </section>
  );
}
