'use client';

import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';

export function JoinCta() {
  const { dispatch } = useMockState();
  return (
    <section className="px-6 py-10 lg:py-16">
      <div className="mx-auto flex max-w-6xl justify-center lg:justify-start">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_AUTH', status: 'logged_in' })}
          className="btn-primary w-full lg:w-auto lg:min-w-[280px]"
        >
          {en.cta.joinNow}
        </button>
      </div>
    </section>
  );
}
