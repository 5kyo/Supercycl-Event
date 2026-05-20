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
        <p className="mb-4 text-sm">{en.modal.survey.completeBody}</p>
        <div className="rounded-lg bg-bg/40 p-4 text-sm">
          <p className="mb-2 font-semibold">Mini report</p>
          <ul className="list-inside list-disc text-muted">
            <li>Answers recorded: {Object.keys(answers).length} / {surveyKo.length}</li>
            <li>Trader profile: {state.tradingVolume > 0 ? 'Yes' : 'No'}</li>
          </ul>
        </div>
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-lg bg-mono-green px-4 py-2 font-semibold text-bg">
            {en.modal.survey.registerIcxCta}
          </button>
        </div>
      </Modal>
    );
  }

  if (!q) return null;

  return (
    <Modal title={`${en.modal.survey.title} (${step + 1}/${surveyKo.length})`} onClose={onClose} size="lg">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted">{q.area}</p>
      <p className="mb-4 text-lg">{q.question}</p>

      {q.type === 'multi' && (
        <div className="flex flex-col gap-2">
          {q.options.map(opt => {
            const cur = (answers[q.id] as string[]) ?? [];
            return (
              <label key={opt} className="flex items-center gap-2 rounded-lg bg-bg/40 p-3">
                <input
                  type="checkbox"
                  checked={cur.includes(opt)}
                  onChange={e => setAnswer(e.target.checked ? [...cur, opt] : cur.filter(x => x !== opt))}
                />
                {opt}
              </label>
            );
          })}
        </div>
      )}

      {q.type === 'single' && (
        <div className="flex flex-col gap-2">
          {q.options.map(opt => (
            <label key={opt} className="flex items-center gap-2 rounded-lg bg-bg/40 p-3">
              <input type="radio" name={`q-${q.id}`} checked={answers[q.id] === opt} onChange={() => setAnswer(opt)} />
              {opt}
            </label>
          ))}
        </div>
      )}

      {q.type === 'free' && (
        <textarea
          value={(answers[q.id] as string) ?? ''}
          onChange={e => setAnswer(e.target.value)}
          className="w-full rounded-md bg-bg/40 px-3 py-2 ring-1 ring-muted/20"
          rows={4}
        />
      )}

      {q.type === 'scale5' && (
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setAnswer(n)}
              className={`flex-1 rounded-lg p-3 ${answers[q.id] === n ? 'bg-mono-green text-bg' : 'bg-bg/40'}`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-lg px-4 py-2 disabled:opacity-40"
        >
          {en.modal.survey.previous}
        </button>
        <button type="button" onClick={next} className="rounded-lg bg-mono-green px-5 py-2 font-semibold text-bg">
          {last ? en.modal.survey.submit : en.modal.survey.next}
        </button>
      </div>
    </Modal>
  );
}
