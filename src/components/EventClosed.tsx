'use client';

import {
  useMockState,
  isQualifiedForUsdt,
  daysUntilCutoff,
  registrationCutoffPassed,
  effectiveIcxPayout,
  REGISTRATION_CUTOFF,
} from '@/lib/mock-state';
import { en, shortDate } from '@/content/en';

type Props = { onRegisterUsdt: () => void; onRegisterIcx: () => void };

/**
 * Post-campaign goodbye page. Renders a minimal "thanks for riding with us"
 * hero for every visitor, plus a conditional reward card that only appears
 * while a logged-in user still has an unredeemed reward inside the 14-day
 * registration window.
 */
export function EventClosed({ onRegisterUsdt, onRegisterIcx }: Props) {
  const { state } = useMockState();
  const cutoffLabel = shortDate(REGISTRATION_CUTOFF);

  const needsUsdt =
    state.authStatus === 'logged_in' &&
    isQualifiedForUsdt(state) &&
    state.usdtRegistration.status === 'none' &&
    state.usdtPayoutStatus !== '완료';

  const needsIcx =
    state.authStatus === 'logged_in' &&
    state.surveyCompleted &&
    !state.icxAddress &&
    state.icxPayoutStatus !== '완료';

  const showCard =
    !registrationCutoffPassed(state) && (needsUsdt || needsIcx);

  // USDT takes priority when both need registration.
  const cardKind: 'usdt' | 'icx' | null = needsUsdt ? 'usdt' : needsIcx ? 'icx' : null;
  const days = daysUntilCutoff(state);

  const icxAmount = effectiveIcxPayout(state).amount;
  const cardAmount =
    cardKind === 'usdt' ? '20 USDT' : icxAmount != null ? `${icxAmount} ICX` : 'Bonus ICX';
  const onCardClick = cardKind === 'usdt' ? onRegisterUsdt : onRegisterIcx;

  return (
    <main className="relative" style={{ paddingBottom: 32 }}>
      <div
        aria-hidden
        className="aura aura-accent"
        style={{ top: -80, right: -60, width: 260, height: 260 }}
      />
      <div
        aria-hidden
        className="aura aura-cyan"
        style={{ top: 200, left: -100, width: 220, height: 220 }}
      />

      <section className="relative mx-auto max-w-6xl px-6 py-2xl text-center">
        <p className="upper-label text-text-tertiary">{en.eventClosed.eyebrow}</p>
        <h1
          className="mt-md font-bold"
          style={{ fontSize: 44, lineHeight: 0.98, letterSpacing: '-0.03em' }}
        >
          {en.eventClosed.titleLine1}
          <br />
          <span className="accent-text">{en.eventClosed.titleLine2}</span>
        </h1>
        <p className="mt-md text-body-md text-text-secondary-strong">
          {en.eventClosed.subtitle}
        </p>
      </section>

      {showCard && cardKind && (
        <section className="relative mx-auto max-w-6xl px-6 py-md">
          <div
            className="card-elevated relative overflow-hidden text-center"
            style={{
              padding: 20,
              background: 'linear-gradient(135deg, rgba(255,167,38,0.10), transparent)',
              border: '1px solid var(--warning-border)',
            }}
          >
            <p className="upper-label text-warning" style={{ fontSize: 11 }}>
              {en.eventClosed.rewardLabel}
            </p>
            <p
              className="mt-sm font-bold"
              style={{ fontSize: 26, lineHeight: 1, letterSpacing: '-0.02em' }}
            >
              {cardAmount}
            </p>
            <p
              className="mt-sm text-body-sm"
              style={{ color: 'rgba(255,167,38,0.85)' }}
            >
              {en.eventClosed.countdownExpires(days, cutoffLabel)}
            </p>
            <button
              type="button"
              onClick={onCardClick}
              className="btn-primary-sm mt-md"
            >
              {en.eventClosed.registerCta} →
            </button>
          </div>
        </section>
      )}

      <section
        className="relative mx-auto max-w-6xl px-6 py-md"
        style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center justify-around text-center">
          <div>
            <div className="tabnum font-bold" style={{ fontSize: 18, lineHeight: 1 }}>
              {en.eventClosed.recap.traderCount}
            </div>
            <p className="upper-label text-text-tertiary mt-xs" style={{ fontSize: 10 }}>
              {en.eventClosed.recap.traderLabel}
            </p>
          </div>
          <div>
            <div className="tabnum font-bold" style={{ fontSize: 18, lineHeight: 1 }}>
              {en.eventClosed.recap.surveyCount}
            </div>
            <p className="upper-label text-text-tertiary mt-xs" style={{ fontSize: 10 }}>
              {en.eventClosed.recap.surveyLabel}
            </p>
          </div>
          <div>
            <div className="tabnum font-bold" style={{ fontSize: 18, lineHeight: 1 }}>
              {en.eventClosed.recap.volumeAmount}
            </div>
            <p className="upper-label text-text-tertiary mt-xs" style={{ fontSize: 10 }}>
              {en.eventClosed.recap.volumeLabel}
            </p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-md">
        <a
          href="https://supercycl-mobile.vercel.app"
          className="btn-secondary w-full"
        >
          {en.eventClosed.openApp} →
        </a>
      </section>
    </main>
  );
}
