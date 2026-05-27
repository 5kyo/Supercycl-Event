'use client';

import { en, shortDate } from '@/content/en';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';
import {
  useMockState,
  effectiveIcxPayout,
  surveyTrackOpen,
  SURVEY_TRACK_START,
} from '@/lib/mock-state';

type Props = {
  onStartSurvey: () => void;
};

export function IcxRewardCard({ onStartSurvey }: Props) {
  const { state } = useMockState();
  const loggedOut = state.authStatus === 'logged_out';
  const isPaid = state.icxPayoutStatus === 'PAID';
  const payout = effectiveIcxPayout(state);
  const showSurveyCta = surveyTrackOpen(state) && !state.surveyCompleted;
  // Mirror UsdtRewardCard: as soon as the user qualifies (survey done +
  // trader amount known) flip the chip to "Awaiting payout".
  const qualifiedForIcx = payout.amount !== null;
  // Three-way override on top of the backend status:
  // 1. Survey window open + not yet completed → 'open' (Locked is misleading
  //    when the Start survey CTA is sitting right under the chip).
  // 2. Survey done + trader → 'AWAITING_PAYOUT' (operator handles the rest).
  // 3. Otherwise fall through to the raw payout status.
  const effectiveStatus = showSurveyCta
    ? 'open'
    : qualifiedForIcx && state.icxPayoutStatus === 'NOT_REACHED'
      ? 'AWAITING_PAYOUT'
      : state.icxPayoutStatus;

  // Headline shape stays `N ICX` (or `?? ICX` while a number isn't known
  // yet), never the generic "Bonus ICX". Three branches:
  //   1. Pre-survey: optimistic trader default (100 ICX) framed as "Up to N
  //      ICX" — non-trader pool share may be smaller, so we don't claim the
  //      full amount until the user qualifies.
  //   2. Post-survey w/ known amount: actual payout (`N ICX` + ~$5 framing
  //      when N === 100).
  //   3. Post-survey w/ pending non-trader amount: `?? ICX` placeholder.
  //      Once operations sets `state.nonTraderIcxAmount`, the headline
  //      flips to (2) automatically.
  const amountText = !state.surveyCompleted
    ? en.rewards.icxAmountUpTo(100)
    : payout.amount !== null
      ? en.rewards.icxAmountWithValue(payout.amount)
      : en.rewards.icxAmountPending;
  // Both trader and non-trader see the same "Survey complete — payout
  // scheduled" line once the survey is done. The amount distinction (fixed
  // 100 ICX vs. pool share) is already carried by the headline (`100 ICX
  // (~$5 airdrop)` vs. `Bonus ICX`), so we don't need a separate TBD line
  // that would clash with the AWAITING_PAYOUT chip.
  const conditionLine = state.surveyCompleted
    ? en.rewards.icxConditionReady
    : en.rewards.icxCondition;

  // Show the OKX UID once the user clears NOT_REACHED — AWAITING_PAYOUT and
  // PAID both surface the destination so the user can verify where the funds
  // are/were sent. UID is shown unmasked (see UsdtRewardCard for rationale).
  const showPayoutChannel =
    !loggedOut &&
    state.okxUid !== null &&
    effectiveStatus !== 'NOT_REACHED' &&
    effectiveStatus !== 'open';

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
          <RewardStatusLabel
            status={effectiveStatus}
            // Surface the survey open date alongside the Locked chip while
            // the window is still in the future — matches ProgressTracker
            // Step 3's `Opens Jun 29` override and the in-card info box.
            suffix={
              effectiveStatus === 'NOT_REACHED' &&
              state.simulatedDate < SURVEY_TRACK_START
                ? `Opens ${shortDate(SURVEY_TRACK_START)}`
                : undefined
            }
          />
        )}
      </header>
      <div className="flex flex-col gap-xs">
        <h3 className="accent-text" style={{ font: 'var(--font-display-lg)' }}>
          {amountText}
        </h3>
        {/* Drop the "Survey complete — payout scheduled" line post-PAID — it
            reads as future-tense and is superseded by the new "Sent to your
            OKX Main Account" notice below. */}
        {!isPaid && (
          <p className="text-body-md text-text-secondary">{conditionLine}</p>
        )}
      </div>
      {!state.surveyCompleted && (
        <div
          className="flex flex-col gap-1.5 rounded-md text-body-sm"
          style={{ background: 'var(--surface-2)', padding: '10px 12px' }}
        >
          <ul className="flex flex-col gap-1 text-text-tertiary">
            <li>{en.rewards.icxPayoutInfo.traderTier}</li>
            <li>{en.rewards.icxPayoutInfo.nonTraderTier}</li>
          </ul>
        </div>
      )}
      {!loggedOut && (
        <a
          href={en.rewards.icxTradeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-body-sm text-accent underline-offset-2 hover:underline"
        >
          {en.rewards.icxTradeLinkLabel} ↗
        </a>
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
      {showSurveyCta && (
        <button type="button" onClick={onStartSurvey} className="btn-primary-sm mt-auto self-start">
          {en.cta.startSurvey}
        </button>
      )}
    </article>
  );
}
