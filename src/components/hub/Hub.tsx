'use client';

import { useEffect, useState } from 'react';
import { ProgressTracker } from './ProgressTracker';
import { MyProgressMeter } from './MyProgressMeter';
import { UsdtRewardCard } from './UsdtRewardCard';
import { IcxRewardCard } from './IcxRewardCard';
import { HubCtaBar } from './HubCtaBar';
import { HubCompleted } from './HubCompleted';
import { HubExpired } from './HubExpired';
import { CampaignHero } from './CampaignHero';
import { UsdtRegistrationModal } from '@/components/modals/UsdtRegistrationModal';
import { IcxRegistrationModal } from '@/components/modals/IcxRegistrationModal';
import { SurveyModal } from '@/components/modals/SurveyModal';
import { SurveyCompleteModal } from '@/components/modals/SurveyCompleteModal';
import { useMockState, hubVariant, FrozenStateScope } from '@/lib/mock-state';

type Open = 'usdt' | 'icx' | 'survey' | 'surveyComplete' | null;

export function Hub() {
  const { state, dispatch } = useMockState();
  const [open, setOpen] = useState<Open>(null);
  const loggedOut = state.authStatus === 'logged_out';
  // logged-out users always see the default Hub body (as a dimmed preview),
  // regardless of any progress flags toggled via the debug drawer.
  const variant = loggedOut ? 'default' : hubVariant(state);

  useEffect(() => {
    if (
      state.surveyCompleted &&
      !state.dismissedFlags.surveyCompleteSeen &&
      open === null
    ) {
      setOpen('surveyComplete');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.surveyCompleted, state.dismissedFlags.surveyCompleteSeen]);

  function closeSurveyComplete() {
    dispatch({ type: 'DISMISS', key: 'surveyCompleteSeen' });
    setOpen(null);
  }

  function registerIcxFromSurveyComplete() {
    dispatch({ type: 'DISMISS', key: 'surveyCompleteSeen' });
    setOpen('icx');
  }

  const modals = (
    <>
      {open === 'usdt' && <UsdtRegistrationModal onClose={() => setOpen(null)} />}
      {open === 'icx' && <IcxRegistrationModal onClose={() => setOpen(null)} />}
      {open === 'survey' && <SurveyModal onClose={() => setOpen(null)} />}
      {open === 'surveyComplete' && (
        <SurveyCompleteModal
          onClose={closeSurveyComplete}
          onRegisterIcx={registerIcxFromSurveyComplete}
        />
      )}
    </>
  );

  if (variant === 'completed') {
    return (
      <main className="pb-2xl">
        <HubCompleted />
        {modals}
      </main>
    );
  }

  if (variant === 'expired') {
    return (
      <main className="pb-2xl">
        <HubExpired />
        {modals}
      </main>
    );
  }

  // Default: trade-track active, building progress toward $500.
  // CampaignHero carries the LIVE strip; MyProgressMeter carries the slots
  // remaining line, so a separate SlotTension section is redundant on this
  // surface.
  const body = (
    <>
      <ProgressTracker />
      <MyProgressMeter />
      <section className="mx-auto grid max-w-6xl gap-lg px-6 py-lg lg:grid-cols-2">
        <UsdtRewardCard onRegisterUsdt={() => setOpen('usdt')} />
        <IcxRewardCard
          onStartSurvey={() => setOpen('survey')}
          onRegisterIcx={() => setOpen('icx')}
        />
      </section>
      <HubCtaBar />
    </>
  );

  if (loggedOut) {
    // Logged-out preview shows only the flow + rewards so the user can grasp
    // what they unlock. HubHeader/SlotTension/MyProgressMeter/HubCtaBar are
    // redundant or empty pre-auth and would clutter the canvas.
    // FrozenStateScope freezes the preview to initialState so debug-drawer
    // toggles (volume, OKX, survey) don't bleed into the dimmed snapshot.
    return (
      <main className="pb-12">
        <CampaignHero />
        <div
          aria-hidden
          className="pointer-events-none select-none"
          style={{ opacity: 0.42, filter: 'saturate(0.85)' }}
        >
          <FrozenStateScope>
            <ProgressTracker />
            <section className="mx-auto grid max-w-6xl gap-lg px-6 py-lg lg:grid-cols-2">
              <UsdtRewardCard />
              <IcxRewardCard onStartSurvey={() => setOpen('survey')} />
            </section>
          </FrozenStateScope>
        </div>
        {modals}
      </main>
    );
  }

  return (
    <main className="pb-24 lg:pb-12">
      <CampaignHero />
      {body}
      {modals}
    </main>
  );
}
