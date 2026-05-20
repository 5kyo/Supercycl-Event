'use client';

import { en } from '@/content/en';
import { useMockState, tradingTrackOpen, surveyTrackOpen } from '@/lib/mock-state';

export function HubCtaBar({ onStartSurvey }: { onStartSurvey: () => void }) {
  const { state } = useMockState();
  const showTrade = tradingTrackOpen(state) && state.tradingVolume < 500;
  const showSurvey = surveyTrackOpen(state) && !state.surveyCompleted;

  if (!showTrade && !showSurvey) return null;

  return (
    <section className="sticky bottom-0 bg-bg/95 px-6 py-4 backdrop-blur lg:static lg:bg-transparent lg:p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 lg:flex-row">
        {showTrade && (
          <a
            href="https://supercycl-mobile.vercel.app"
            className="flex-1 rounded-xl bg-mono-green px-6 py-4 text-center text-lg font-bold text-bg transition hover:brightness-110"
          >
            {en.cta.tradeNow} →
          </a>
        )}
        {showSurvey && (
          <button
            type="button"
            onClick={onStartSurvey}
            className="flex-1 rounded-xl border border-mono-green px-6 py-4 text-lg font-bold text-mono-green transition hover:bg-mono-green/10"
          >
            {en.cta.startSurvey}
          </button>
        )}
      </div>
    </section>
  );
}
