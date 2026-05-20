'use client';

import { useMockState } from '@/lib/mock-state';
import type { DebugViewport } from '@/lib/mock-state';

const OPTS: DebugViewport[] = ['auto', 'mobile-390', 'tablet-768', 'desktop-1280'];

export function ViewportSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Viewport</h3>
      <div className="flex flex-wrap gap-2">
        {OPTS.map(o => (
          <button
            key={o}
            type="button"
            onClick={() => dispatch({ type: 'SET_VIEWPORT', viewport: o })}
            className={`rounded-md px-3 py-1 ${state.debugViewport === o ? 'bg-mono-green text-bg' : 'bg-bg/40'}`}
          >
            {o}
          </button>
        ))}
      </div>
    </section>
  );
}
