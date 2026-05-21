'use client';

import { en } from '@/content/en';
import { useMockState, tradingTrackOpen } from '@/lib/mock-state';

/**
 * HubCtaBar — sticky "Trade now" CTA at the bottom of the Hub.
 *
 * Survey CTA used to live here too but moved into IcxRewardCard so the action
 * sits next to the reward it unlocks. This bar now only carries the trading
 * CTA, which is still the primary, time-sensitive action.
 */
export function HubCtaBar() {
  const { state } = useMockState();
  const showTrade = tradingTrackOpen(state) && state.tradingVolume < 500;

  if (!showTrade) return null;

  return (
    <section
      className="sticky bottom-0 z-10 px-6 py-md backdrop-blur-card lg:static lg:p-6"
      style={{
        background: 'rgba(5, 5, 7, 0.85)',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-md lg:flex-row">
        <a
          href="https://supercycl-mobile.vercel.app"
          className="btn-primary flex-1 text-center text-body-lg font-semibold"
          style={{ minHeight: 56 }}
        >
          {en.cta.tradeNow} →
        </a>
      </div>
    </section>
  );
}
