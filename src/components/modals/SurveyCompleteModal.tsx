'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';

/**
 * Survey complete — confirmation only.
 * Shown after the survey is submitted: the big "Thanks for your time / ICX
 * incoming" heading carries the title, followed by the payout-channel
 * reminder. No header title or progress chip — the body heading is the
 * meaningful surface. No CTA other than Done — ICX is auto-sent to the
 * linked OKX UID.
 */
type Props = {
  onClose: () => void;
};

export function SurveyCompleteModal({ onClose }: Props) {
  const { state } = useMockState();
  const uid = state.okxUid;
  // Match the ICX card framing — trader sees the confirmed 100 ICX (~$5),
  // non-trader sees the actual `nonTraderIcxAmount` if operations has set it,
  // otherwise the `?? ICX` placeholder. Headline shape is always `N ICX`
  // (or `?? ICX`), never the legacy "Bonus ICX" label.
  const headline = state.isTrader
    ? en.rewards.icxAmountWithValue(100)
    : state.nonTraderIcxAmount !== null
      ? en.rewards.icxAmountWithValue(state.nonTraderIcxAmount)
      : en.rewards.icxAmountPending;

  return (
    <Modal onClose={onClose} size="lg">
      <h2
        className="font-bold"
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
