'use client';

import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';

export function HubHeader() {
  const { state, dispatch } = useMockState();
  const showWelcome = !state.dismissedFlags.welcomeCard;

  return (
    <header className="px-6 py-6 lg:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2">
        <p className="text-sm uppercase tracking-widest text-muted">{en.meta.period}</p>
        <h1 className="text-2xl font-bold lg:text-3xl">{en.meta.title}</h1>
        <a href="https://supercycl-mobile.vercel.app" className="text-sm text-mono-green hover:underline">
          {en.cta.goToMain} →
        </a>
        {showWelcome && (
          <div className="mt-4 flex items-start justify-between gap-3 rounded-xl bg-surface p-4 ring-1 ring-mono-green/20">
            <p className="text-sm">{en.hub.welcomeCard}</p>
            <button
              type="button"
              aria-label="Dismiss welcome card"
              onClick={() => dispatch({ type: 'DISMISS', key: 'welcomeCard' })}
              className="text-muted hover:text-text"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
