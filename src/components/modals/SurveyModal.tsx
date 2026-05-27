'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { surveyKo } from '@/content/survey-ko';
import { surveyEn } from '@/content/survey-en';
import { useMockState } from '@/lib/mock-state';

type Answer = string | string[] | number;
type Locale = 'ko' | 'en';

// Free-text trigger labels — kept in sync with the matching option labels in
// survey-ko.md / survey-en.md so the "..." → text-input UX works in both
// languages. If the option label is renamed, update both halves.
const OTHER_LABEL: Record<Locale, string> = { ko: '기타', en: 'Other' };
const CUSTOM_LABEL: Record<Locale, string> = { ko: '직접 입력', en: 'Custom' };

const STRINGS: Record<Locale, {
  title: string;
  multiHint: string;
  singleHint: string;
  scaleHint: string;
  freeHint: string;
  otherPlaceholder: string;
  customPlaceholder: string;
  freePlaceholder: string;
  scaleLow: string;
  scaleHigh: string;
  requiredHint: string;
  next: string;
  submit: string;
}> = {
  ko: {
    title: '슈퍼사이클 설문조사',
    multiHint: '복수선택 가능',
    singleHint: '하나만 선택',
    scaleHint: '1(아니오) ~ 5(예)',
    freeHint: '자유 응답',
    otherPlaceholder: '기타 — 자세히 적어주세요',
    customPlaceholder: '직접 입력 — 예: 7x',
    freePlaceholder: '응답을 입력해주세요…',
    scaleLow: '1 — 아니오',
    scaleHigh: '5 — 예',
    requiredHint: '응답을 선택 또는 입력해주세요',
    next: '다음',
    submit: '제출',
  },
  en: {
    title: 'Supercycl Survey',
    multiHint: 'Multi-select',
    singleHint: 'Single-select',
    scaleHint: '1 (No) – 5 (Yes)',
    freeHint: 'Free response',
    otherPlaceholder: 'Other — please describe',
    customPlaceholder: 'Custom — e.g. 7x',
    freePlaceholder: 'Type your answer…',
    scaleLow: '1 — No',
    scaleHigh: '5 — Yes',
    requiredHint: 'Please select or enter a response',
    next: 'Next',
    submit: 'Submit',
  },
};

/**
 * V2 Festival Survey — segmented progress bar, section chip, big question,
 * selected option with accent-tint + accent border + glow + ✓ icon.
 * Supports a KO|EN toggle in the modal header; option labels differ between
 * languages, so flipping locale resets in-progress answers.
 */
export function SurveyModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useMockState();
  const [locale, setLocale] = useState<Locale>('ko');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  // Free-text companion to an "Other"/"Custom" choice. Kept in a parallel
  // record (rather than inlined into the answer array) so the option-array
  // typing stays clean and the input value isn't lost when the trigger
  // option is toggled off and back on.
  const [freeTextAnswers, setFreeTextAnswers] = useState<Record<number, string>>({});
  // Surfaces a hint under the current question only after the user has
  // attempted to advance without answering. Resets on step change and on
  // any user input (setAnswer clears it).
  const [showRequiredHint, setShowRequiredHint] = useState(false);

  const survey = locale === 'ko' ? surveyKo : surveyEn;
  const strings = STRINGS[locale];
  const q = survey[step];
  const total = survey.length;
  const last = step === total - 1;
  const current = step + 1;

  function changeLocale(next: Locale) {
    if (next === locale) return;
    // Option labels differ between languages; stored answers like "기타" or
    // "Custom" wouldn't match the rendered options after a flip. Reset.
    setLocale(next);
    setStep(0);
    setAnswers({});
    setFreeTextAnswers({});
    setShowRequiredHint(false);
  }

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

  const localeToggle = (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex overflow-hidden rounded-md text-label-sm ring-1 ring-white/15"
    >
      {(['ko', 'en'] as const).map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => changeLocale(l)}
            aria-pressed={active}
            className={
              active
                ? 'bg-accent px-2 py-1 font-medium text-text-inverse'
                : 'px-2 py-1 text-text-tertiary hover:bg-white/5'
            }
          >
            {l === 'ko' ? 'KO' : 'EN'}
          </button>
        );
      })}
    </div>
  );

  return (
    <Modal title={strings.title} onClose={onClose} size="lg" headerExtra={localeToggle}>
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
        {q.type === 'multi'
          ? strings.multiHint
          : q.type === 'single'
            ? strings.singleHint
            : q.type === 'scale5'
              ? strings.scaleHint
              : strings.freeHint}
      </p>

      {/* Options */}
      {q.type === 'multi' && (() => {
        const cur = (answers[q.id] as string[]) ?? [];
        const otherSelected = cur.includes(OTHER_LABEL[locale]);
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
                placeholder={strings.otherPlaceholder}
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
          {answers[q.id] === CUSTOM_LABEL[locale] && (
            <input
              type="text"
              value={freeTextAnswers[q.id] ?? ''}
              onChange={(e) =>
                setFreeTextAnswers((a) => ({ ...a, [q.id]: e.target.value }))
              }
              className="input w-full"
              style={{ padding: '12px 14px' }}
              placeholder={strings.customPlaceholder}
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
          placeholder={strings.freePlaceholder}
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
            <span>{strings.scaleLow}</span>
            <span>{strings.scaleHigh}</span>
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
          ⚠ {strings.requiredHint}
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
          {last ? strings.submit : `${strings.next} →`}
        </button>
      </div>
    </Modal>
  );
}
