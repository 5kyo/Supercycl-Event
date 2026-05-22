'use client';

import { en } from '@/content/en';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';
import {
  useMockState,
  isQualifiedForUsdt,
  registrationCutoffPassed,
  tradeRewardClosed,
} from '@/lib/mock-state';

type Props = {
  /** Opens the USDT payout-info registration modal. Omitted in previews. */
  onRegisterUsdt?: () => void;
};

export function UsdtRewardCard({ onRegisterUsdt }: Props) {
  const { state } = useMockState();
  const loggedOut = state.authStatus === 'logged_out';
  const qualified = isQualifiedForUsdt(state);
  const reg = state.usdtRegistration;
  // Trade reward is closed when the user never qualified AND the path is shut:
  // slots exhausted or trade-track date passed. Already-qualified users and
  // any non-NOT_REACHED payout state keep their normal flow.
  const closed =
    !qualified &&
    state.usdtPayoutStatus === 'NOT_REACHED' &&
    tradeRewardClosed(state);
  // Treat the qualified-but-still-'NOT_REACHED' moment as "registration required" —
  // SlotSecuredModal used to flip this status; now the card surfaces the
  // transition on its own so the chip and CTA stay in sync without a popup.
  const effectiveStatus =
    qualified && state.usdtPayoutStatus === 'NOT_REACHED'
      ? 'AWAITING_REGISTRATION'
      : state.usdtPayoutStatus;
  const needsRegistration = effectiveStatus === 'AWAITING_REGISTRATION';

  const conditionLine = closed
    ? en.rewards.usdtClosed
    : qualified
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
        ) : closed ? (
          <span className="chip chip-muted">Closed</span>
        ) : (
          <RewardStatusLabel status={effectiveStatus} />
        )}
      </header>
      <div className="flex flex-col gap-xs">
        {closed ? (
          <h3
            className="tabnum font-bold text-text-tertiary"
            style={{
              font: 'var(--font-display-lg)',
              textDecoration: 'line-through',
              textDecorationColor: 'rgba(255,255,255,0.2)',
            }}
          >
            {en.rewards.usdtAmount}
          </h3>
        ) : (
          <h3 className="accent-text" style={{ font: 'var(--font-display-lg)' }}>
            {en.rewards.usdtAmount}
          </h3>
        )}
        <p className="text-body-md text-text-secondary">{conditionLine}</p>
      </div>
      {!closed && reg.status === 'wallet' && (
        <p className="text-body-sm text-text-tertiary">
          Wallet: {reg.trc20Address.slice(0, 4)}…{reg.trc20Address.slice(-4)}
        </p>
      )}
      {!closed && reg.status === 'exchange' && (
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
