'use client';

import { en } from '@/content/en';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';
import {
  useMockState,
  effectiveIcxPayout,
  registrationCutoffPassed,
  surveyTrackOpen,
} from '@/lib/mock-state';
import { IcxRegistrationForm } from './IcxRegistrationForm';

type Props = {
  onStartSurvey: () => void;
};

export function IcxRewardCard({ onStartSurvey }: Props) {
  const { state } = useMockState();
  const loggedOut = state.authStatus === 'logged_out';
  const payout = effectiveIcxPayout(state);
  const needsRegistration = state.icxPayoutStatus === '수령 정보 미등록';
  const showSurveyCta = surveyTrackOpen(state) && !state.surveyCompleted;

  const amountText =
    payout.amount !== null ? en.rewards.icxAmountWithValue(payout.amount) : en.rewards.icxAmount;
  const conditionLine =
    payout.amount === null && state.surveyCompleted && !state.isTrader
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
          <RewardStatusLabel status={state.icxPayoutStatus} />
        )}
      </header>
      <div className="flex flex-col gap-xs">
        <h3 className="accent-text" style={{ font: 'var(--font-display-lg)' }}>
          {amountText}
        </h3>
        <p className="text-body-md text-text-secondary">{conditionLine}</p>
      </div>
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
      {showSurveyCta && (
        <button type="button" onClick={onStartSurvey} className="btn-primary-sm mt-auto self-start">
          {en.cta.startSurvey}
        </button>
      )}
      {needsRegistration && !registrationCutoffPassed(state) && (
        <div className="mt-auto flex flex-col">
          <IcxRegistrationForm />
        </div>
      )}
    </article>
  );
}
