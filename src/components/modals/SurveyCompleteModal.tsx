'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';
import { surveyKo } from '@/content/survey-ko';
import { useMockState } from '@/lib/mock-state';

/**
 * Survey complete — confirmation only.
 * Shown after the survey is submitted: thanks line, ICX-incoming headline,
 * payout channel reminder. No CTA other than Done — ICX is auto-sent to the
 * linked OKX UID.
 */
type Props = {
  onClose: () => void;
  /** Optional: number of answers recorded. Falls back to total questions. */
  answeredCount?: number;
};

export function SurveyCompleteModal({
  onClose,
  answeredCount = surveyKo.length,
}: Props) {
  const { state } = useMockState();
  const uid = state.okxUid;
  const totalQuestions = surveyKo.length;
  // Match the ICX card framing — trader sees the confirmed 100 ICX amount,
  // non-trader sees the generic "Bonus ICX" label since their share is still
  // a pool calculation. Same gate as IcxRewardCard's headline branch.
  const headline = state.isTrader
    ? en.rewards.icxAmountWithValue(100)
    : en.rewards.icxAmount;

  return (
    <Modal title={en.modal.survey.completeTitle} onClose={onClose} size="lg">
      <span className="chip chip-accent" style={{ marginBottom: 12 }}>
        ✓ {answeredCount} / {totalQuestions} complete
      </span>
      <h2
        className="mt-md font-bold"
        style={{ fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.028em' }}
      >
        Thanks for
        <br />
        your time.
        <br />
        <span className="accent-text">{headline}</span> incoming.
      </h2>
      <p className="mt-md text-body-md text-text-secondary">
        {uid
          ? `We'll send it to your linked OKX UID (${uid}) via Internal Transfer within 7 business days.`
          : "We'll send it to your linked OKX UID via Internal Transfer within 7 business days."}
      </p>

      {/* Done CTA */}
      <div className="mt-2xl">
        <button
          type="button"
          onClick={onClose}
          className="btn-primary w-full"
          style={{ height: 56 }}
        >
          {en.modal.survey.doneCta}
        </button>
      </div>
    </Modal>
  );
}
