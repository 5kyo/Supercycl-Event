'use client';

import { en } from '@/content/en';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';
import {
  useMockState,
  effectiveIcxPayout,
  maskOkxUid,
  surveyTrackOpen,
  SURVEY_TRACK_START,
} from '@/lib/mock-state';

type Props = {
  onStartSurvey: () => void;
};

export function IcxRewardCard({ onStartSurvey }: Props) {
  const { state } = useMockState();
  const loggedOut = state.authStatus === 'logged_out';
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

  const amountText =
    payout.amount !== null ? en.rewards.icxAmountWithValue(payout.amount) : en.rewards.icxAmount;
  const conditionLine = qualifiedForIcx
    ? en.rewards.icxConditionReady
    : payout.amount === null && state.surveyCompleted && !state.isTrader
      ? en.hub.icxNonTrader
      : en.rewards.icxCondition;

  const showPayoutChannel =
    !loggedOut &&
    state.okxUid !== null &&
    effectiveStatus !== 'NOT_REACHED' &&
    effectiveStatus !== 'open' &&
    state.icxPayoutStatus !== 'PAID';

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
          {amountText}
        </h3>
        <p className="text-body-md text-text-secondary">{conditionLine}</p>
      </div>
      {!state.surveyCompleted && (
        <div
          className="flex flex-col gap-1.5 rounded-md text-body-sm"
          style={{ background: 'var(--surface-2)', padding: '10px 12px' }}
        >
          {state.simulatedDate < SURVEY_TRACK_START && (
            <p className="text-text-secondary">
              {en.rewards.icxPayoutInfo.surveyOpens(SURVEY_TRACK_START)}
            </p>
          )}
          <ul className="flex flex-col gap-1 text-text-tertiary">
            <li>{en.rewards.icxPayoutInfo.traderTier}</li>
            <li>{en.rewards.icxPayoutInfo.nonTraderTier}</li>
          </ul>
        </div>
      )}
      {showPayoutChannel && state.okxUid && (
        <p className="text-body-sm text-text-tertiary">
          {en.rewards.payoutChannel(maskOkxUid(state.okxUid))}
        </p>
      )}
      {state.icxPayoutStatus === 'PAID' && state.icxTxHash && (
        <p className="text-body-sm text-text-tertiary">TX: {state.icxTxHash.slice(0, 10)}…</p>
      )}
      {showSurveyCta && (
        <button type="button" onClick={onStartSurvey} className="btn-primary-sm mt-auto self-start">
          {en.cta.startSurvey}
        </button>
      )}
    </article>
  );
}
