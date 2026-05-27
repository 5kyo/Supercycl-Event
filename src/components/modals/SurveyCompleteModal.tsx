'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';
import { useMockState, maskOkxUid } from '@/lib/mock-state';

/**
 * V2 Survey complete — mini-report.
 * Shown after the 12Q survey is submitted: time spent, profile summary,
 * peer-benchmark line. No CTA — ICX is auto-sent to the linked OKX UID.
 */
type Props = {
  onClose: () => void;
  /** Optional: time spent on the survey in seconds. Falls back to a sample. */
  timeSpentSec?: number;
  /** Optional: number of answers recorded. Falls back to 12/12. */
  answeredCount?: number;
};

function formatMinSec(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function SurveyCompleteModal({
  onClose,
  timeSpentSec = 443,
  answeredCount = 12,
}: Props) {
  const { state } = useMockState();
  const isTrader = state.isTrader;
  const avgPerQ = Math.round(timeSpentSec / Math.max(1, answeredCount));
  const maskedUid = state.okxUid ? maskOkxUid(state.okxUid) : null;

  return (
    <Modal title={en.modal.survey.completeTitle} onClose={onClose} size="lg">
      <span className="chip chip-accent" style={{ marginBottom: 12 }}>
        ✓ {answeredCount} / 12 complete
      </span>
      <h2
        className="mt-md font-bold"
        style={{ fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.028em' }}
      >
        Thanks for
        <br />
        your time.
        <br />
        <span className="accent-text">{en.rewards.icxAmountWithValue(100)}</span> incoming.
      </h2>
      <p className="mt-md text-body-md text-text-secondary">
        {maskedUid
          ? `We'll send it to your linked OKX UID (${maskedUid}) via Internal Transfer within 7 business days.`
          : "We'll send it to your linked OKX UID via Internal Transfer within 7 business days."}
      </p>

      {/* Mini report */}
      <h3 className="mt-2xl mb-md upper-label">Your mini report</h3>

      <div className="card mb-sm" style={{ padding: 16 }}>
        <p className="upper-label" style={{ fontSize: 10 }}>
          Time spent
        </p>
        <div className="mt-xs flex items-baseline gap-1">
          <span
            className="tabnum font-mono font-bold"
            style={{ fontSize: 32, lineHeight: 1 }}
          >
            {formatMinSec(timeSpentSec)}
          </span>
          <span className="text-label-sm text-text-tertiary">min</span>
        </div>
        <p className="mt-xs text-body-sm text-text-tertiary">
          Average response:{' '}
          <span className="text-text-secondary">{avgPerQ}s / question</span>
        </p>
      </div>

      <div className="card mb-sm" style={{ padding: 16 }}>
        <p className="upper-label" style={{ fontSize: 10 }}>
          Your profile
        </p>
        <ul className="mt-sm flex flex-col gap-sm" style={{ listStyle: 'none', padding: 0 }}>
          {(
            [
              ['Trader', isTrader ? 'Yes' : 'No', isTrader ? 'var(--accent)' : 'var(--text-secondary-strong)'],
              ['Top venues', 'Bybit · OKX', 'var(--text-secondary-strong)'],
              ['Avg leverage', '3×', 'var(--text-secondary-strong)'],
              ['Interest', 'BTC · ETH · Alt', 'var(--text-secondary-strong)'],
            ] as [string, string, string][]
          ).map(([k, v, c]) => (
            <li
              key={k}
              className="flex items-center justify-between"
              style={{ paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}
            >
              <span className="text-body-sm text-text-tertiary">{k}</span>
              <span className="text-body-sm" style={{ color: c, fontWeight: 500 }}>
                {v}
              </span>
            </li>
          ))}
        </ul>
        <p
          className="mt-xs text-body-sm italic text-text-tertiary"
          style={{ lineHeight: 1.4 }}
        >
          Based on similar traders — avg monthly return:{' '}
          <span className="text-accent">+8.2%</span>
        </p>
      </div>

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
