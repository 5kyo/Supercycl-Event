'use client';

import { en } from '@/content/en';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';
import { useMockState, isQualifiedForUsdt, registrationCutoffPassed } from '@/lib/mock-state';

export function UsdtRewardCard({ onRegister }: { onRegister: () => void }) {
  const { state } = useMockState();
  const qualified = isQualifiedForUsdt(state);
  const needsRegistration = state.usdtPayoutStatus === '수령 정보 미등록';
  const reg = state.usdtRegistration;

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-surface p-5 ring-1 ring-muted/20">
      <header className="flex items-baseline justify-between">
        <h3 className="font-semibold">{en.rewards.usdtCardTitle}</h3>
        <RewardStatusLabel status={state.usdtPayoutStatus} />
      </header>
      {!qualified && state.usdtPayoutStatus === '미달성' && (
        <p className="text-sm text-muted">
          Trade ${Math.max(0, 500 - state.tradingVolume)} more to unlock.
        </p>
      )}
      {reg.status === 'wallet' && (
        <p className="text-xs text-muted">Wallet: {reg.trc20Address.slice(0, 4)}…{reg.trc20Address.slice(-4)}</p>
      )}
      {reg.status === 'exchange' && (
        <p className="text-xs text-muted">OKX UID: {reg.okxUid}</p>
      )}
      {state.usdtPayoutStatus === '완료' && state.usdtTxHash && (
        <p className="text-xs text-muted">TX: {state.usdtTxHash.slice(0, 10)}…</p>
      )}
      {needsRegistration && registrationCutoffPassed(state) && (
        <p className="rounded-md bg-surface px-3 py-2 text-xs italic text-muted">{en.outsideWindow.registrationClosed}</p>
      )}
      {needsRegistration && !registrationCutoffPassed(state) && (
        <button
          type="button"
          onClick={onRegister}
          className="rounded-lg bg-mono-green px-4 py-2 text-sm font-semibold text-bg transition hover:brightness-110"
        >
          {en.cta.registerUsdt}
        </button>
      )}
    </article>
  );
}
