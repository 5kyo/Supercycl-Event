'use client';

import { en } from '@/content/en';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';
import { useMockState, effectiveIcxPayout } from '@/lib/mock-state';

export function IcxRewardCard({ onRegister }: { onRegister: () => void }) {
  const { state } = useMockState();
  const payout = effectiveIcxPayout(state);
  const needsRegistration = state.icxPayoutStatus === '수령 정보 미등록';

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-surface p-5 ring-1 ring-muted/20">
      <header className="flex items-baseline justify-between">
        <h3 className="font-semibold">{en.rewards.icxCardTitle}</h3>
        <RewardStatusLabel status={state.icxPayoutStatus} />
      </header>
      {payout.amount !== null && (
        <p className="text-sm">Reward: <span className="text-mono-green">{payout.amount} ICX</span></p>
      )}
      {payout.amount === null && state.surveyCompleted && !state.isTrader && (
        <p className="text-sm italic text-muted">{en.hub.icxNonTrader}</p>
      )}
      {state.icxAddress && <p className="text-xs text-muted">Wallet: {state.icxAddress.slice(0, 6)}…{state.icxAddress.slice(-4)}</p>}
      {state.icxPayoutStatus === '완료' && state.icxTxHash && (
        <p className="text-xs text-muted">TX: {state.icxTxHash.slice(0, 10)}…</p>
      )}
      {needsRegistration && (
        <button
          type="button"
          onClick={onRegister}
          className="rounded-lg bg-mono-green px-4 py-2 text-sm font-semibold text-bg transition hover:brightness-110"
        >
          {en.cta.registerIcx}
        </button>
      )}
    </article>
  );
}
