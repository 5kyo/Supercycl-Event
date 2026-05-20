'use client';

import { useMockState } from '@/lib/mock-state';

export function SurveySection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Survey</h3>
      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={state.surveyCompleted}
            onChange={() => dispatch({
              type: 'SET_SURVEY_COMPLETED',
              isTrader: state.isTrader,
              at: state.simulatedDate,
            })}
          />
          Completed
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={state.isTrader}
            onChange={() => dispatch({
              type: 'SET_SURVEY_COMPLETED',
              isTrader: !state.isTrader,
              at: state.simulatedDate,
            })}
          />
          Is trader
        </label>
      </div>
    </section>
  );
}
