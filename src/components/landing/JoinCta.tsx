'use client';

import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';

export function JoinCta() {
  const { dispatch } = useMockState();
  return (
    <section className="px-6 py-2xl lg:py-3xl">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-md lg:items-start">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_AUTH', status: 'logged_in' })}
          className="btn-primary w-full lg:w-auto lg:min-w-[280px]"
          style={{ height: 56 }}
        >
          {en.cta.joinNow || 'Join the festival →'}
        </button>
        <p
          className="font-mono text-text-tertiary"
          style={{ fontSize: 11, letterSpacing: '0.12em' }}
        >
          YOUTHMETA MEMBERS · OKX REQUIRED
        </p>
      </div>
    </section>
  );
}
