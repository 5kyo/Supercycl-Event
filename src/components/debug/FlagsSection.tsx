'use client';

import { useMockState } from '@/lib/mock-state';

export function FlagsSection() {
  const { dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Flags</h3>
      <button
        type="button"
        onClick={() => dispatch({ type: 'RESET_DISMISSED' })}
        className="rounded-md bg-bg/40 px-3 py-1 text-xs"
      >
        Reset all dismissed
      </button>
    </section>
  );
}
