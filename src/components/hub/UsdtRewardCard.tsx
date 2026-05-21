'use client';

import { en } from '@/content/en';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';
import { useMockState, isQualifiedForUsdt, registrationCutoffPassed } from '@/lib/mock-state';
import { UsdtRegistrationForm } from './UsdtRegistrationForm';

export function UsdtRewardCard() {
  const { state } = useMockState();
  const loggedOut = state.authStatus === 'logged_out';
  const qualified = isQualifiedForUsdt(state);
  const needsRegistration = state.usdtPayoutStatus === '수령 정보 미등록';
  const reg = state.usdtRegistration;

  const conditionLine =
    !qualified && state.usdtPayoutStatus === '미달성'
      ? en.rewards.usdtConditionRemaining(Math.max(0, 500 - state.tradingVolume))
      : en.rewards.usdtCondition;

  return (
    <article className="card-elevated flex flex-col gap-md" style={{ padding: '20px' }}>
      <header className="flex items-center justify-between gap-md">
        <span className="upper-label inline-flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
          <span aria-hidden>✦</span>
          {en.rewards.eyebrow}
        </span>
        {loggedOut ? (
          <span className="chip chip-muted">
            <span aria-hidden>🔒</span>
            Sign in to view
          </span>
        ) : (
          <RewardStatusLabel status={state.usdtPayoutStatus} />
        )}
      </header>
      <div className="flex flex-col gap-xs">
        <h3 className="accent-text" style={{ font: 'var(--font-display-lg)' }}>
          {en.rewards.usdtAmount}
        </h3>
        <p className="text-body-md text-text-secondary">{conditionLine}</p>
      </div>
      {reg.status === 'wallet' && (
        <p className="text-body-sm text-text-tertiary">
          Wallet: {reg.trc20Address.slice(0, 4)}…{reg.trc20Address.slice(-4)}
        </p>
      )}
      {reg.status === 'exchange' && (
        <p className="text-body-sm text-text-tertiary">OKX UID: {reg.okxUid}</p>
      )}
      {state.usdtPayoutStatus === '완료' && state.usdtTxHash && (
        <p className="text-body-sm text-text-tertiary">TX: {state.usdtTxHash.slice(0, 10)}…</p>
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
        <div className="mt-sm flex flex-col">
          <UsdtRegistrationForm />
        </div>
      )}
    </article>
  );
}
