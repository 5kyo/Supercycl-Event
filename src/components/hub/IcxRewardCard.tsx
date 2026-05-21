'use client';

import { en } from '@/content/en';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';
import { useMockState, effectiveIcxPayout, registrationCutoffPassed } from '@/lib/mock-state';

export function IcxRewardCard({ onRegister }: { onRegister: () => void }) {
  const { state } = useMockState();
  const loggedOut = state.authStatus === 'logged_out';
  const payout = effectiveIcxPayout(state);
  const needsRegistration = state.icxPayoutStatus === '수령 정보 미등록';

  return (
    <article className="card-elevated flex flex-col gap-md" style={{ padding: '20px' }}>
      <header className="flex items-baseline justify-between gap-md">
        <h3 className="text-title-md">{en.rewards.icxCardTitle}</h3>
        {loggedOut ? (
          <span className="text-label-md inline-flex items-center gap-1.5 text-text-tertiary">
            <span aria-hidden>🔒</span>
            Sign in to view
          </span>
        ) : (
          <RewardStatusLabel status={state.icxPayoutStatus} />
        )}
      </header>
      {payout.amount !== null && (
        <p className="text-body-md text-text-secondary">
          Reward: <span className="text-accent font-semibold">{payout.amount} ICX</span>
        </p>
      )}
      {payout.amount === null && state.surveyCompleted && !state.isTrader && (
        <p className="text-body-md italic text-text-tertiary">{en.hub.icxNonTrader}</p>
      )}
      {state.icxAddress && (
        <p className="text-body-sm text-text-tertiary">
          Wallet: {state.icxAddress.slice(0, 6)}…{state.icxAddress.slice(-4)}
        </p>
      )}
      {state.icxPayoutStatus === '완료' && state.icxTxHash && (
        <p className="text-body-sm text-text-tertiary">TX: {state.icxTxHash.slice(0, 10)}…</p>
      )}
      {needsRegistration && registrationCutoffPassed(state) && (
        <p
          className="rounded-md text-body-sm italic text-text-tertiary"
          style={{ background: 'var(--surface-2)', padding: '10px 12px' }}
        >
          {en.outsideWindow.registrationClosed}
        </p>
      )}
      {needsRegistration && !registrationCutoffPassed(state) && (
        <button type="button" onClick={onRegister} className="btn-primary-sm self-start">
          {en.cta.registerIcx}
        </button>
      )}
    </article>
  );
}
