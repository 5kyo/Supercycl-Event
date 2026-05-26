'use client';

import { useEffect, useState } from 'react';
import { MyAccountCard } from './MyAccountCard';
import { ProgressTracker } from './ProgressTracker';
import { MyProgressMeter } from './MyProgressMeter';
import { UsdtRewardCard } from './UsdtRewardCard';
import { IcxRewardCard } from './IcxRewardCard';
import { HubCtaBar } from './HubCtaBar';
import { HubCompleted } from './HubCompleted';
import { CampaignHero } from './CampaignHero';
import { YouthMetaGate } from './YouthMetaGate';
import { SurveyModal } from '@/components/modals/SurveyModal';
import { SurveyCompleteModal } from '@/components/modals/SurveyCompleteModal';
import {
  useMockState,
  hubVariant,
  FrozenStateScope,
  isBlockedNonYouthMeta,
} from '@/lib/mock-state';

type Open = 'survey' | 'surveyComplete' | null;

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

  const modals = (
    <>
      {open === 'survey' && <SurveyModal onClose={() => setOpen(null)} />}
      {open === 'surveyComplete' && (
        <SurveyCompleteModal onClose={closeSurveyComplete} />
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

  // Default: trade-track active, building progress toward $500.
  // CampaignHero carries the LIVE strip; slot status lives inside
  // UsdtRewardCard so it sits next to the reward it gates.
  const body = (
    <>
      <MyAccountCard />
      <ProgressTracker />
      <MyProgressMeter />
      <section className="mx-auto grid max-w-6xl gap-lg px-6 py-lg lg:grid-cols-2">
        <UsdtRewardCard />
        <IcxRewardCard onStartSurvey={() => setOpen('survey')} />
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

  // Spec §7.3.1 — YouthMeta gate. Signed-in account isn't on the roster, so
  // the trade/survey flow is fully blocked at entry. Hero stays visible so
  // the user still knows what event they were trying to enter.
  if (isBlockedNonYouthMeta(state)) {
    return (
      <main className="pb-12">
        <CampaignHero />
        <YouthMetaGate />
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
