'use client';

import { en } from '@/content/en';
import { useMockState, tradingTrackOpen, surveyTrackOpen } from '@/lib/mock-state';

export function HubCtaBar({ onStartSurvey }: { onStartSurvey: () => void }) {
  const { state } = useMockState();
  const showTrade = tradingTrackOpen(state) && state.tradingVolume < 500;
  const showSurvey = surveyTrackOpen(state) && !state.surveyCompleted;

  if (!showTrade && !showSurvey) return null;

  return (
    <section
      className="sticky bottom-0 z-10 px-6 py-md backdrop-blur-card lg:static lg:p-6"
      style={{ background: 'rgba(5, 5, 7, 0.85)' }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-md lg:flex-row">
        {showTrade && (
          <a
            href="https://supercycl-mobile.vercel.app"
            className="btn-primary flex-1 text-center"
          >
            <span>{en.cta.tradeNow} →</span>
          </a>
        )}
        {showSurvey && (
          <button
            type="button"
            onClick={onStartSurvey}
            className="btn-secondary flex-1"
          >
            {en.cta.startSurvey}
          </button>
        )}
      </div>
    </section>
  );
}
