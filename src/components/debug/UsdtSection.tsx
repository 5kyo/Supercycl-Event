'use client';

import { useMockState } from '@/lib/mock-state';
import type { UsdtPayoutStatus } from '@/lib/mock-state';

const STATUSES: UsdtPayoutStatus[] = ['미달성', '수령 정보 미등록', '대기', '보류', '완료', '만료', '슬롯_마감_후_도달'];

export function UsdtSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">USDT</h3>
      <p className="mb-1 text-xs">Registration: {state.usdtRegistration.status}</p>
      <div className="mb-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => dispatch({ type: 'SET_USDT_REGISTRATION', registration: { status: 'none' } })} className="rounded-md bg-bg/40 px-2 py-1 text-xs">None</button>
        <button type="button" onClick={() => dispatch({ type: 'SET_USDT_REGISTRATION', registration: { status: 'wallet', trc20Address: 'T' + 'a'.repeat(33) } })} className="rounded-md bg-bg/40 px-2 py-1 text-xs">Wallet (sample)</button>
        <button type="button" onClick={() => dispatch({ type: 'SET_USDT_REGISTRATION', registration: { status: 'exchange', okxUid: '12345678', email: 'test@okx.com' } })} className="rounded-md bg-bg/40 px-2 py-1 text-xs">Exchange (sample)</button>
      </div>
      <label className="flex items-center gap-2 text-xs">
        Status:
        <select
          value={state.usdtPayoutStatus}
          onChange={e => dispatch({ type: 'SET_USDT_PAYOUT_STATUS', status: e.target.value as UsdtPayoutStatus, txHash: e.target.value === '완료' ? '0xMOCKtxhash' : null })}
          className="rounded-md bg-bg/40 px-2 py-1"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
    </section>
  );
}
