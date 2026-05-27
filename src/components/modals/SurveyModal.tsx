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
  // Free-text companion to a "기타" multi-select choice. Kept in a parallel
  // record (rather than inlined into the answer array) so the option-array
  // typing stays clean and the input value isn't lost when "기타" is
  // toggled off and back on.
  const [freeTextAnswers, setFreeTextAnswers] = useState<Record<number, string>>({});
  // Surfaces a hint under the current question only after the user has
  // attempted to advance without answering. Resets on step change and on
  // any user input (setAnswer clears it).
  const [showRequiredHint, setShowRequiredHint] = useState(false);

  const q = surveyKo[step];
  const total = surveyKo.length;
  const last = step === total - 1;
  const current = step + 1;

  function setAnswer(v: Answer) {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.id]: v }));
    setShowRequiredHint(false);
  }

  function isAnswered(): boolean {
    if (!q) return true;
    const v = answers[q.id];
    if (q.type === 'multi') return Array.isArray(v) && (v as string[]).length > 0;
    if (q.type === 'single' || q.type === 'scale5') return v !== undefined && v !== null;
    if (q.type === 'free') {
      // Required free questions must have non-whitespace content; optional
      // free questions can be skipped silently. Today only Q3 is required.
      if ('required' in q && q.required === true) {
        return ((v as string) ?? '').trim().length > 0;
      }
      return true;
    }
    return true;
  }

  function next() {
    if (!isAnswered()) {
      setShowRequiredHint(true);
      return;
    }
    setShowRequiredHint(false);
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
      // Defensive reset — setAnswer already clears on user input, but a
      // fresh question starts without any stale hint.
      setShowRequiredHint(false);
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
        className="mb-2xl font-mono text-text-tertiary"
        style={{ fontSize: 11, letterSpacing: '0.08em' }}
      >
        <span className="text-accent">
          Q{current} OF {total}
        </span>
      </div>

      {/* Big question */}
      <h2
        className="font-bold"
        style={{ fontSize: 24, lineHeight: 1.25, letterSpacing: '-0.015em' }}
      >
        {q.question}
      </h2>
      <p className="mt-sm text-body-sm text-text-tertiary">
        {q.type === 'multi' ? '복수선택 가능' : q.type === 'single' ? '하나만 선택' : q.type === 'scale5' ? '1(아니오) ~ 5(예)' : '자유 응답'}
      </p>

      {/* Options */}
      {q.type === 'multi' && (() => {
        const cur = (answers[q.id] as string[]) ?? [];
        const otherSelected = cur.includes('기타');
        return (
          <div className="mt-lg flex flex-col gap-sm">
            {q.options.map((opt) => {
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
            {otherSelected && (
              <input
                type="text"
                value={freeTextAnswers[q.id] ?? ''}
                onChange={(e) =>
                  setFreeTextAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                }
                className="input w-full"
                style={{ padding: '12px 14px' }}
                placeholder="기타 — 자세히 적어주세요"
              />
            )}
          </div>
        );
      })()}

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
          {answers[q.id] === '직접 입력' && (
            <input
              type="text"
              value={freeTextAnswers[q.id] ?? ''}
              onChange={(e) =>
                setFreeTextAnswers((a) => ({ ...a, [q.id]: e.target.value }))
              }
              className="input w-full"
              style={{ padding: '12px 14px' }}
              placeholder="직접 입력 — 예: 7x"
            />
          )}
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
        <div className="mt-lg flex flex-col gap-xs">
          <div className="flex justify-between gap-sm">
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
          {/* Polar labels — make the 1/5 semantic explicit (the bare numbers
              alone don't communicate which end is "high"). */}
          <div className="flex justify-between px-1 text-body-sm text-text-tertiary">
            <span>1 — 아니오</span>
            <span>5 — 예</span>
          </div>
        </div>
      )}

      {/* Required-answer hint — only renders after a failed Next attempt. */}
      {showRequiredHint && (
        <p
          role="alert"
          aria-live="polite"
          className="mt-md text-body-sm font-medium text-amber"
        >
          ⚠ {en.modal.survey.requiredHint}
        </p>
      )}

      {/* Footer */}
      <div className="mt-lg flex gap-sm">
        <button
          type="button"
          onClick={() => {
            setShowRequiredHint(false);
            setStep((s) => Math.max(0, s - 1));
          }}
          disabled={step === 0}
          className="btn-secondary-sm"
          style={{ width: 60, padding: 0 }}
        >
          ←
        </button>
        <button
          type="button"
          onClick={next}
          className="btn-primary-sm flex-1"
        >
          {last ? en.modal.survey.submit : `${en.modal.survey.next} →`}
        </button>
      </div>
    </Modal>
  );
}
