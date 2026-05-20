'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { en } from '@/content/en';
import { surveyKo } from '@/content/survey-ko';
import { useMockState } from '@/lib/mock-state';

type Answer = string | string[] | number;

export function SurveyModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useMockState();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [done, setDone] = useState(false);

  const q = surveyKo[step];
  const last = step === surveyKo.length - 1;

  function setAnswer(v: Answer) {
    if (!q) return;
    setAnswers(a => ({ ...a, [q.id]: v }));
  }

  function next() {
    if (last) {
      dispatch({
        type: 'SET_SURVEY_COMPLETED',
        isTrader: state.tradingVolume > 0,
        at: state.simulatedDate,
      });
      dispatch({ type: 'SET_ICX_PAYOUT_STATUS', status: '수령 정보 미등록' });
      setDone(true);
    } else {
      setStep(s => s + 1);
    }
  }

  if (done) {
    return (
      <Modal title={en.modal.survey.completeTitle} onClose={onClose}>
        <p className="mb-lg text-body-md">{en.modal.survey.completeBody}</p>
        <div className="card text-body-md" style={{ padding: '16px' }}>
          <p className="mb-sm text-title-sm">Mini report</p>
          <ul className="list-inside list-disc text-text-secondary">
            <li>Answers recorded: {Object.keys(answers).length} / {surveyKo.length}</li>
            <li>Trader profile: {state.tradingVolume > 0 ? 'Yes' : 'No'}</li>
          </ul>
        </div>
        <div className="mt-2xl flex justify-end">
          <button type="button" onClick={onClose} className="btn-primary-sm">
            {en.modal.survey.registerIcxCta}
          </button>
        </div>
      </Modal>
    );
  }

  if (!q) return null;

  const pct = ((step + 1) / surveyKo.length) * 100;

  return (
    <Modal title={`${en.modal.survey.title} (${step + 1}/${surveyKo.length})`} onClose={onClose} size="lg">
      {/* Progress indicator */}
      <div
        className="mb-lg h-1 w-full overflow-hidden rounded-full"
        style={{ background: 'var(--surface-track)' }}
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={surveyKo.length}
      >
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${pct}%`, background: 'var(--accent-gradient)' }}
        />
      </div>

      <p className="mb-sm text-label-sm uppercase tracking-[0.22em] text-accent">{q.area}</p>
      <p className="mb-lg text-title-md">{q.question}</p>

      {q.type === 'multi' && (
        <div className="flex flex-col gap-sm">
          {q.options.map(opt => {
            const cur = (answers[q.id] as string[]) ?? [];
            const selected = cur.includes(opt);
            return (
              <label
                key={opt}
                className="flex items-center gap-md rounded-md cursor-pointer transition-colors"
                style={{
                  background: selected ? 'var(--accent-tint)' : 'var(--surface-2)',
                  border: selected ? '1px solid var(--accent-border-soft)' : '1px solid var(--border-subtle)',
                  padding: '12px 14px',
                }}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={e => setAnswer(e.target.checked ? [...cur, opt] : cur.filter(x => x !== opt))}
                  className="accent-accent"
                />
                <span className="text-body-md">{opt}</span>
              </label>
            );
          })}
        </div>
      )}

      {q.type === 'single' && (
        <div className="flex flex-col gap-sm">
          {q.options.map(opt => {
            const selected = answers[q.id] === opt;
            return (
              <label
                key={opt}
                className="flex items-center gap-md rounded-md cursor-pointer transition-colors"
                style={{
                  background: selected ? 'var(--accent-tint)' : 'var(--surface-2)',
                  border: selected ? '1px solid var(--accent-border-soft)' : '1px solid var(--border-subtle)',
                  padding: '12px 14px',
                }}
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={selected}
                  onChange={() => setAnswer(opt)}
                  className="accent-accent"
                />
                <span className="text-body-md">{opt}</span>
              </label>
            );
          })}
        </div>
      )}

      {q.type === 'free' && (
        <textarea
          value={(answers[q.id] as string) ?? ''}
          onChange={e => setAnswer(e.target.value)}
          className="input w-full"
          style={{ height: 'auto', minHeight: '96px', padding: '12px 14px', resize: 'vertical' }}
          rows={4}
        />
      )}

      {q.type === 'scale5' && (
        <div className="flex justify-between gap-sm">
          {[1, 2, 3, 4, 5].map(n => {
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

      <div className="mt-2xl flex justify-between">
        <button
          type="button"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-ghost disabled:opacity-40"
        >
          {en.modal.survey.previous}
        </button>
        <button type="button" onClick={next} className="btn-primary-sm">
          {last ? en.modal.survey.submit : en.modal.survey.next}
        </button>
      </div>
    </Modal>
  );
}
