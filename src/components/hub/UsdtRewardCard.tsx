'use client';

import { en } from '@/content/en';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';
import { SlotTension } from '@/components/shared/SlotTension';
import {
  useMockState,
  isQualifiedForUsdt,
  maskOkxUid,
  tradeRewardClosed,
  volumeReachedNoOkx,
} from '@/lib/mock-state';

export function UsdtRewardCard() {
  const { state } = useMockState();
  const loggedOut = state.authStatus === 'logged_out';
  const qualified = isQualifiedForUsdt(state);
  // Trade reward is closed when the slot path is shut (slots exhausted or
  // trade-track date passed) AND the user has not yet moved past NOT_REACHED.
  // Any non-NOT_REACHED payout state means the user already cleared the gate
  // and keeps their normal flow.
  const closed =
    state.usdtPayoutStatus === 'NOT_REACHED' &&
    tradeRewardClosed(state);
  // Treat the qualified-but-still-'NOT_REACHED' moment as "awaiting payout" —
  // the operator pushes the USDT via OKX Internal Transfer, no user action
  // required. Gate on !closed so volume≥$500 with 0 slots stays in the closed
  // visual instead of flipping the chip to AWAITING_PAYOUT.
  const effectiveStatus =
    qualified && state.usdtPayoutStatus === 'NOT_REACHED' && !closed
      ? 'AWAITING_PAYOUT'
      : state.usdtPayoutStatus;

  // OKX-first guard: when volume is met but Step 1 (OKX OAuth) is still
  // pending, surface "Connect OKX to unlock" instead of the volume-remaining
  // copy — which would compute to "Trade $0 more to unlock" and mislead the
  // user about the real blocker.
  const conditionLine = closed
    ? en.rewards.usdtClosed
    : qualified
      ? en.rewards.usdtConditionReady
      : volumeReachedNoOkx(state)
        ? en.rewards.usdtConditionNeedsOkx
        : state.usdtPayoutStatus === 'NOT_REACHED'
          ? en.rewards.usdtConditionRemaining(Math.max(0, 500 - state.tradingVolume))
          : en.rewards.usdtCondition;

  const showPayoutChannel =
    !closed &&
    !loggedOut &&
    state.okxUid !== null &&
    effectiveStatus !== 'NOT_REACHED' &&
    state.usdtPayoutStatus !== 'PAID';

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
      {!loggedOut && (
        <SlotTension
          size="sm"
          layout="inline"
          label={en.slot.rewardCardHeading}
        />
      )}
      {showPayoutChannel && state.okxUid && (
        <p className="text-body-sm text-text-tertiary">
          {en.rewards.payoutChannel(maskOkxUid(state.okxUid))}
        </p>
      )}
      {state.usdtPayoutStatus === 'PAID' && state.usdtTxHash && (
        <p className="text-body-sm text-text-tertiary">TX: {state.usdtTxHash.slice(0, 10)}…</p>
      )}
    </article>
  );
}
