'use client';

import { useEffect, useState } from 'react';
import { HubHeader } from './HubHeader';
import { ProgressTracker } from './ProgressTracker';
import { MyProgressMeter } from './MyProgressMeter';
import { UsdtRewardCard } from './UsdtRewardCard';
import { IcxRewardCard } from './IcxRewardCard';
import { HubCtaBar } from './HubCtaBar';
import { HubPending } from './HubPending';
import { HubCompleted } from './HubCompleted';
import { HubExpired } from './HubExpired';
import { CampaignHero } from './CampaignHero';
import { LoginCta } from './LoginCta';
import { SlotTension } from '@/components/shared/SlotTension';
import { UsdtRegistrationModal } from '@/components/modals/UsdtRegistrationModal';
import { IcxRegistrationModal } from '@/components/modals/IcxRegistrationModal';
import { SurveyModal } from '@/components/modals/SurveyModal';
import { SurveyCompleteModal } from '@/components/modals/SurveyCompleteModal';
import { useMockState, hubVariant } from '@/lib/mock-state';

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

  if (variant === 'pending') {
    return (
      <main className="pb-2xl">
        <HubPending onRegisterUsdt={() => setOpen('usdt')} />
        {modals}
      </main>
    );
  }

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
  // For logged-out users, the same body renders behind a dim layer with a
  // CampaignHero on top and a single login CTA (inline on mobile, floating on
  // desktop).
  const body = (
    <>
      <HubHeader />
      <ProgressTracker />
      <section className="mx-auto max-w-6xl px-6">
        <SlotTension size="lg" />
      </section>
      <MyProgressMeter />
      <section className="mx-auto grid max-w-6xl gap-lg px-6 py-lg lg:grid-cols-2">
        <UsdtRewardCard onRegister={() => setOpen('usdt')} />
        <IcxRewardCard onRegister={() => setOpen('icx')} />
      </section>
      <HubCtaBar onStartSurvey={() => setOpen('survey')} />
    </>
  );

  if (loggedOut) {
    return (
      <main className="pb-24 lg:pb-12">
        <CampaignHero />
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none select-none"
            style={{ opacity: 0.42, filter: 'saturate(0.85)' }}
          >
            {body}
          </div>
          <LoginCta variant="floating" />
        </div>
        {modals}
      </main>
    );
  }

  return (
    <main className="pb-24 lg:pb-12">
      {body}
      {modals}
    </main>
  );
}
