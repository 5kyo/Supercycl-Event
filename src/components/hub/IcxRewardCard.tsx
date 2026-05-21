'use client';

import { en } from '@/content/en';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';
import {
  useMockState,
  effectiveIcxPayout,
  registrationCutoffPassed,
  surveyTrackOpen,
  SURVEY_TRACK_START,
} from '@/lib/mock-state';

type Props = {
  onStartSurvey: () => void;
  /** Opens the ICX wallet registration modal. Omitted in previews. */
  onRegisterIcx?: () => void;
};

export function IcxRewardCard({ onStartSurvey, onRegisterIcx }: Props) {
  const { state } = useMockState();
  const loggedOut = state.authStatus === 'logged_out';
  const payout = effectiveIcxPayout(state);
  const showSurveyCta = surveyTrackOpen(state) && !state.surveyCompleted;
  // Mirror UsdtRewardCard: as soon as the user qualifies (survey done +
  // trader amount known) flip the chip to "Registration required" so the
  // card can drive the next step without an interstitial popup.
  const qualifiedForIcx = payout.amount !== null;
  // Three-way override on top of the backend status:
  // 1. Survey window open + not yet completed → 'open' (Locked is misleading
  //    when the Start survey CTA is sitting right under the chip).
  // 2. Survey done + trader → 'AWAITING_REGISTRATION' (the existing transition).
  // 3. Otherwise fall through to the raw payout status.
  const effectiveStatus = showSurveyCta
    ? 'open'
    : qualifiedForIcx && state.icxPayoutStatus === 'NOT_REACHED'
      ? 'AWAITING_REGISTRATION'
      : state.icxPayoutStatus;
  const needsRegistration = effectiveStatus === 'AWAITING_REGISTRATION';

  const amountText =
    payout.amount !== null ? en.rewards.icxAmountWithValue(payout.amount) : en.rewards.icxAmount;
  const conditionLine = qualifiedForIcx
    ? en.rewards.icxConditionReady
    : payout.amount === null && state.surveyCompleted && !state.isTrader
      ? en.hub.icxNonTrader
      : en.rewards.icxCondition;

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
      {state.icxAddress && (
        <p className="text-body-sm text-text-tertiary">
          Wallet: {state.icxAddress.slice(0, 6)}…{state.icxAddress.slice(-4)}
        </p>
      )}
      {state.icxPayoutStatus === 'PAID' && state.icxTxHash && (
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
      {showSurveyCta && (
        <button type="button" onClick={onStartSurvey} className="btn-primary-sm mt-auto self-start">
          {en.cta.startSurvey}
        </button>
      )}
      {needsRegistration && !registrationCutoffPassed(state) && onRegisterIcx && (
        <button
          type="button"
          onClick={onRegisterIcx}
          className="btn-primary-sm mt-auto self-start"
        >
          {en.cta.registerIcx} →
        </button>
      )}
    </article>
  );
}
