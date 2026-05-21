'use client';

import { en } from '@/content/en';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';
import { useMockState, isQualifiedForUsdt, registrationCutoffPassed } from '@/lib/mock-state';

type Props = {
  /** Opens the USDT payout-info registration modal. Omitted in previews. */
  onRegisterUsdt?: () => void;
};

export function UsdtRewardCard({ onRegisterUsdt }: Props) {
  const { state } = useMockState();
  const loggedOut = state.authStatus === 'logged_out';
  const qualified = isQualifiedForUsdt(state);
  const reg = state.usdtRegistration;
  // Treat the qualified-but-still-'NOT_REACHED' moment as "registration required" —
  // SlotSecuredModal used to flip this status; now the card surfaces the
  // transition on its own so the chip and CTA stay in sync without a popup.
  const effectiveStatus =
    qualified && state.usdtPayoutStatus === 'NOT_REACHED'
      ? 'AWAITING_REGISTRATION'
      : state.usdtPayoutStatus;
  const needsRegistration = effectiveStatus === 'AWAITING_REGISTRATION';

  const conditionLine = qualified
    ? en.rewards.usdtConditionReady
    : state.usdtPayoutStatus === 'NOT_REACHED'
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
          <RewardStatusLabel status={effectiveStatus} />
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
      {state.usdtPayoutStatus === 'PAID' && state.usdtTxHash && (
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
      {needsRegistration && !registrationCutoffPassed(state) && onRegisterUsdt && (
        <button
          type="button"
          onClick={onRegisterUsdt}
          className="btn-primary-sm mt-auto self-start"
        >
          {en.cta.registerUsdt} →
        </button>
      )}
    </article>
  );
}
