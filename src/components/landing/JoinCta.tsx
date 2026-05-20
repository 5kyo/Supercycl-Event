'use client';

import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';

export function JoinCta() {
  const { dispatch } = useMockState();
  return (
    <section className="px-6 py-8 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_AUTH', status: 'logged_in' })}
          className="w-full rounded-xl bg-mono-green px-6 py-4 text-lg font-bold text-bg transition hover:brightness-110 lg:w-auto"
        >
          {en.cta.joinNow}
        </button>
      </div>
    </section>
  );
}
