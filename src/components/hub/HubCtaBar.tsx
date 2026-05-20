'use client';

import { en } from '@/content/en';
import { useMockState, tradingTrackOpen, surveyTrackOpen } from '@/lib/mock-state';

/**
 * HubCtaBar — Festival direction.
 *
 * Was: single label inside btn-primary.
 * Now: when "Trade now" is shown, the button stacks a tiny sub-label showing
 * how much more volume the user needs ("$263 to 20 USDT"). This directly
 * supports the funnel goal — keep the $500 target visible at every CTA tap.
 *
 * Survey CTA unchanged. Both branches share the same sticky/blur styling.
 */
export function HubCtaBar({ onStartSurvey }: { onStartSurvey: () => void }) {
  const { state } = useMockState();
  const showTrade = tradingTrackOpen(state) && state.tradingVolume < 500;
  const showSurvey = surveyTrackOpen(state) && !state.surveyCompleted;
  const remaining = Math.max(0, 500 - state.tradingVolume);

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
            style={{ minHeight: 56 }}
          >
            <span className="flex flex-col items-center" style={{ lineHeight: 1.1 }}>
              <span className="text-body-lg font-semibold">{en.cta.tradeNow} →</span>
              <span
                className="font-mono opacity-75"
                style={{ fontSize: 11, marginTop: 3, letterSpacing: '0.02em' }}
              >
                ${remaining} to 20 USDT
              </span>
            </span>
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
