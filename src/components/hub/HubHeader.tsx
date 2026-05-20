'use client';

import { en } from '@/content/en';
import { useMockState, daysUntilEnd } from '@/lib/mock-state';

export function HubHeader() {
  const { state, dispatch } = useMockState();
  const showWelcome = !state.dismissedFlags.welcomeCard;
  const days = daysUntilEnd(state);

  return (
    <header className="px-6 py-lg lg:py-2xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-md">
        {/* LIVE + identity row (V2 design: small compact row at top) */}
        <div className="flex items-center justify-between">
          <p className="upper-label text-accent">● LIVE · D-{days}</p>
          <span
            className="font-mono text-text-tertiary"
            style={{ fontSize: 11, letterSpacing: '0.08em' }}
          >
            @youthmember
          </span>
        </div>

        {showWelcome && (
          <div
            className="card-elevated flex items-start justify-between gap-md"
            style={{ padding: 18 }}
          >
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
