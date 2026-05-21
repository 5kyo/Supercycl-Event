'use client';

import { en } from '@/content/en';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';
import { useMockState, isQualifiedForUsdt, registrationCutoffPassed } from '@/lib/mock-state';

export function UsdtRewardCard({ onRegister }: { onRegister: () => void }) {
  const { state } = useMockState();
  const loggedOut = state.authStatus === 'logged_out';
  const qualified = isQualifiedForUsdt(state);
  const needsRegistration = state.usdtPayoutStatus === '수령 정보 미등록';
  const reg = state.usdtRegistration;

  return (
    <article className="card-elevated flex flex-col gap-md" style={{ padding: '20px' }}>
      <header className="flex items-baseline justify-between gap-md">
        <h3 className="text-title-md">{en.rewards.usdtCardTitle}</h3>
        {loggedOut ? (
          <span className="text-label-md inline-flex items-center gap-1.5 text-text-tertiary">
            <span aria-hidden>🔒</span>
            Sign in to view
          </span>
        ) : (
          <RewardStatusLabel status={state.usdtPayoutStatus} />
        )}
      </header>
      {!qualified && state.usdtPayoutStatus === '미달성' && (
        <p className="text-body-md text-text-secondary">
          Trade ${Math.max(0, 500 - state.tradingVolume)} more to unlock.
        </p>
      )}
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
        <button type="button" onClick={onRegister} className="btn-primary-sm self-start">
          {en.cta.registerUsdt}
        </button>
      )}
    </article>
  );
}
