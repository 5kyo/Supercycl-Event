'use client';

import { en } from '@/content/en';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';
import { SlotTension } from '@/components/shared/SlotTension';
import {
  useMockState,
  isQualifiedForUsdt,
  tradeRewardClosed,
  volumeReachedNoOkx,
  nextWeeklyPayoutDate,
} from '@/lib/mock-state';

export function UsdtRewardCard() {
  const { state } = useMockState();
  const loggedOut = state.authStatus === 'logged_out';
  const qualified = isQualifiedForUsdt(state);
  const isPaid = state.usdtPayoutStatus === 'PAID';
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

  // Show the OKX UID once the user clears NOT_REACHED — AWAITING_PAYOUT and
  // PAID both surface the destination so the user can verify where the funds
  // are/were sent. UID is shown unmasked: it's a public OKX identifier the
  // user knows and needs to read in full to cross-check with their OKX app.
  const showPayoutChannel =
    !closed &&
    !loggedOut &&
    state.okxUid !== null &&
    effectiveStatus !== 'NOT_REACHED';

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
        ) : volumeReachedNoOkx(state) ? (
          // OKX-first guard: a plain "Locked" chip hides the actual blocker.
          // Surface the action directly — clickable amber affordance that
          // routes to the main service where OKX OAuth lives.
          <a
            href="https://supercycl-mobile.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-amber/40 bg-amber/15 px-2.5 py-1 text-label-sm font-medium text-amber hover:bg-amber/25"
            data-testid="usdt-needs-okx-chip"
          >
            <span aria-hidden>⚠</span>
            {en.rewards.usdtConditionNeedsOkx} →
          </a>
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
        {/* When volumeReachedNoOkx fires, the top-right chip already carries
            the "Connect OKX to unlock" affordance — skip the body line to
            avoid duplicating the same message. */}
        {!(volumeReachedNoOkx(state) && !closed) &&
          (qualified && !closed ? (
            // Qualified pre-payout: surface the exact next-payout date so the
            // user knows WHEN they're paid. Once PAID, drop the future-tense
            // date line — the new "Sent to your OKX Main Account" notice
            // below carries the post-payment messaging.
            <div className="flex flex-col gap-1">
              <p className="text-body-md text-text-secondary">
                {en.rewards.usdtConditionReady}
              </p>
              {!isPaid && (
                <p className="text-body-md font-semibold text-accent">
                  <span aria-hidden style={{ marginRight: 6 }}>📅</span>
                  {en.rewards.payoutOn(nextWeeklyPayoutDate(state.simulatedDate))}
                </p>
              )}
            </div>
          ) : (
            <p className="text-body-md text-text-secondary">{conditionLine}</p>
          ))}
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
          {en.rewards.payoutChannel(state.okxUid)}
        </p>
      )}
      {isPaid && (
        <p className="text-body-sm font-medium text-accent">
          <span aria-hidden style={{ marginRight: 4 }}>→</span>
          {en.rewards.paidNotice}
        </p>
      )}
    </article>
  );
}
