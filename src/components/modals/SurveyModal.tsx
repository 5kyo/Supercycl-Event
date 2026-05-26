'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { en } from '@/content/en';
import { surveyKo } from '@/content/survey-ko';
import { useMockState } from '@/lib/mock-state';

type Answer = string | string[] | number;

/**
 * V2 Festival Survey — segmented progress bar, section chip, big question,
 * selected option with accent-tint + accent border + glow + ✓ icon.
 * Functional behavior (state, dispatch, completion) unchanged.
 */
export function SurveyModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useMockState();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});

  const q = surveyKo[step];
  const total = surveyKo.length;
  const last = step === total - 1;
  const current = step + 1;

  function setAnswer(v: Answer) {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.id]: v }));
  }

  function next() {
    if (last) {
      dispatch({
        type: 'SET_SURVEY_COMPLETED',
        isTrader: state.tradingVolume > 0,
        at: state.simulatedDate,
      });
      dispatch({ type: 'SET_ICX_PAYOUT_STATUS', status: 'AWAITING_PAYOUT' });
      // Close SurveyModal — Hub detects surveyCompleted and opens SurveyCompleteModal.
      onClose();
    } else {
      setStep((s) => s + 1);
    }
  }

  if (!q) return null;

  return (
    <Modal title={en.modal.survey.title} onClose={onClose} size="lg">
      {/* Segmented progress bar — one rectangle per question */}
      <div className="mb-sm flex gap-[3px]">
        {Array.from({ length: total }, (_, i) => {
          let bg = 'var(--surface-track)';
          let opacity = 1;
          if (i < step) bg = 'var(--accent)';
          else if (i === step) {
            bg = 'var(--accent-light)';
            opacity = 0.6;
          }
          return (
            <div
              key={i}
              className="flex-1 rounded-[2px]"
              style={{ height: 4, background: bg, opacity }}
            />
          );
        })}
      </div>
      <div
        className="mb-2xl flex justify-between font-mono text-text-tertiary"
        style={{ fontSize: 11, letterSpacing: '0.08em' }}
      >
        <span className="text-accent">
          Q{current} OF {total}
        </span>
        <span>~{Math.max(1, total - current)} MIN LEFT</span>
      </div>

      {/* Section chip */}
      <span className="chip chip-accent" style={{ marginBottom: 12 }}>
        {q.area}
      </span>

      {/* Big question */}
      <h2
        className="mt-md font-bold"
        style={{ fontSize: 24, lineHeight: 1.25, letterSpacing: '-0.015em' }}
      >
        {q.question}
      </h2>
      <p className="mt-sm text-body-sm text-text-tertiary">
        {q.type === 'multi' ? 'Select all that apply.' : q.type === 'single' ? 'Pick one — there\'s no wrong answer.' : q.type === 'scale5' ? 'Slide 1 (no) to 5 (yes).' : 'Optional.'}
      </p>

      {/* Options */}
      {q.type === 'multi' && (
        <div className="mt-lg flex flex-col gap-sm">
          {q.options.map((opt) => {
            const cur = (answers[q.id] as string[]) ?? [];
            const selected = cur.includes(opt);
            return (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-md transition-all"
                style={{
                  padding: '16px 18px',
                  borderRadius: 14,
                  background: selected ? 'var(--accent-tint)' : 'var(--surface-2)',
                  border: `1px solid ${selected ? 'var(--accent)' : 'var(--border-subtle)'}`,
                  boxShadow: selected ? '0 0 0 4px rgba(0,230,118,0.12)' : 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={(e) =>
                    setAnswer(e.target.checked ? [...cur, opt] : cur.filter((x) => x !== opt))
                  }
                  className="sr-only"
                />
                <span className="flex-1 text-title-sm" style={{ fontSize: 15 }}>
                  {opt}
                </span>
                {selected && (
                  <span
                    className="inline-flex items-center justify-center rounded-full font-bold"
                    style={{
                      width: 22,
                      height: 22,
                      background: 'var(--accent)',
                      color: 'var(--text-inverse)',
                      fontSize: 13,
                    }}
                  >
                    ✓
                  </span>
                )}
              </label>
            );
          })}
        </div>
      )}

      {q.type === 'single' && (
        <div className="mt-lg flex flex-col gap-sm">
          {q.options.map((opt) => {
            const selected = answers[q.id] === opt;
            return (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-md transition-all"
                style={{
                  padding: '16px 18px',
                  borderRadius: 14,
                  background: selected ? 'var(--accent-tint)' : 'var(--surface-2)',
                  border: `1px solid ${selected ? 'var(--accent)' : 'var(--border-subtle)'}`,
                  boxShadow: selected ? '0 0 0 4px rgba(0,230,118,0.12)' : 'none',
                }}
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={selected}
                  onChange={() => setAnswer(opt)}
                  className="sr-only"
                />
                <span className="flex-1 text-title-sm" style={{ fontSize: 15 }}>
                  {opt}
                </span>
                {selected && (
                  <span
                    className="inline-flex items-center justify-center rounded-full font-bold"
                    style={{
                      width: 22,
                      height: 22,
                      background: 'var(--accent)',
                      color: 'var(--text-inverse)',
                      fontSize: 13,
                    }}
                  >
                    ✓
                  </span>
                )}
              </label>
            );
          })}
        </div>
      )}

      {q.type === 'free' && (
        <textarea
          value={(answers[q.id] as string) ?? ''}
          onChange={(e) => setAnswer(e.target.value)}
          className="input mt-lg w-full"
          style={{ height: 'auto', minHeight: 96, padding: '12px 14px', resize: 'vertical' }}
          rows={4}
          placeholder="Type your answer…"
        />
      )}

      {q.type === 'scale5' && (
        <div className="mt-lg flex justify-between gap-sm">
          {[1, 2, 3, 4, 5].map((n) => {
            const selected = answers[q.id] === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setAnswer(n)}
                className={selected ? 'btn-primary-sm flex-1' : 'btn-secondary-sm flex-1'}
                style={{ minWidth: 0 }}
              >
                {n}
              </button>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-2xl flex gap-sm">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-secondary-sm"
          style={{ width: 60, padding: 0 }}
        >
          ←
        </button>
        <button type="button" onClick={next} className="btn-primary-sm flex-1">
          {last ? en.modal.survey.submit : `${en.modal.survey.next} →`}
        </button>
      </div>
    </Modal>
  );
}
