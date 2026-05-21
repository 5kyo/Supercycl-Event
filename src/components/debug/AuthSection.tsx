'use client';

import { useMockState } from '@/lib/mock-state';

export function AuthSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Auth</h3>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_AUTH', status: 'logged_in' })}
          className={`rounded-md px-3 py-1 ${state.authStatus === 'logged_in' ? 'bg-mono-green text-bg' : 'bg-bg/40'}`}
        >
          Logged in
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_AUTH', status: 'logged_out' })}
          className={`rounded-md px-3 py-1 ${state.authStatus === 'logged_out' ? 'bg-mono-green text-bg' : 'bg-bg/40'}`}
        >
          Logged out
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={state.hasOkxLinked} onChange={() => dispatch({ type: 'TOGGLE_OKX' })} />
          OKX linked
        </label>
      </div>
    </section>
  );
}
