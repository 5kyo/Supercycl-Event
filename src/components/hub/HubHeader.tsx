'use client';

import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';

export function HubHeader() {
  const { state, dispatch } = useMockState();
  const showWelcome = !state.dismissedFlags.welcomeCard;

  return (
    <header className="px-6 py-8 lg:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-md">
        <p className="text-label-sm uppercase tracking-[0.22em] text-accent">
          {en.meta.period}
        </p>
        <h1 className="text-title-lg font-bold lg:text-display-lg">{en.meta.title}</h1>
        <a
          href="https://supercycl-mobile.vercel.app"
          className="inline-flex items-center gap-1 text-body-md text-accent hover:text-accent-light"
        >
          {en.cta.goToMain} <span aria-hidden>→</span>
        </a>
        {showWelcome && (
          <div className="card-elevated mt-md flex items-start justify-between gap-md" style={{ padding: '18px' }}>
            <p className="text-body-md text-text-primary">{en.hub.welcomeCard}</p>
            <button
              type="button"
              aria-label="Dismiss welcome card"
              onClick={() => dispatch({ type: 'DISMISS', key: 'welcomeCard' })}
              className="btn-ghost shrink-0"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
