'use client';

import { useEffect, useState } from 'react';
import { AuthSection } from './AuthSection';
import { TradingSection } from './TradingSection';
import { SlotsSection } from './SlotsSection';
import { UsdtSection } from './UsdtSection';
import { SurveySection } from './SurveySection';
import { IcxSection } from './IcxSection';
import { TimeSection } from './TimeSection';
import { ViewportSection } from './ViewportSection';
import { FlagsSection } from './FlagsSection';
import { useMockState } from '@/lib/mock-state';
import { clearState } from '@/lib/mock-state/persistence';
import { useIsEmbedded } from '@/lib/useIsEmbedded';

export function DebugDrawer() {
  const [open, setOpen] = useState(false);
  const { dispatch } = useMockState();
  const embedded = useIsEmbedded();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setOpen(o => !o);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Inside the ViewportFrame iframe — the drawer stays in the parent only.
  if (embedded) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Open debug drawer"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-30 rounded-full p-3 text-mono-green ring-1 ring-mono-green/30 shadow-lg"
        style={{ background: 'var(--bg-void)' }}
      >
        🐞
      </button>
      {open && (
        <aside
          role="complementary"
          aria-label="Mock state toggles"
          className="fixed bottom-0 right-0 z-50 max-h-[60vh] w-full overflow-y-auto p-5 shadow-2xl lg:bottom-auto lg:right-0 lg:top-0 lg:h-screen lg:max-h-screen lg:w-[420px]"
          style={{
            background: 'var(--bg-void)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold">Mock State Toggles</h2>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="rounded-md p-2 text-muted hover:bg-white/5 hover:text-text"
            >
              <span className="block text-base leading-none">✕</span>
            </button>
          </header>
          <div className="divide-y divide-white/10 text-sm [&>section]:py-4 [&>section:first-child]:pt-0">
            <AuthSection />
            <TradingSection />
            <SlotsSection />
            <UsdtSection />
            <SurveySection />
            <IcxSection />
            <TimeSection />
            <ViewportSection />
            <FlagsSection />
          </div>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={() => {
                clearState();
                dispatch({ type: 'RESET_ALL' });
              }}
              className="rounded-md bg-red/15 px-3 py-2 text-red ring-1 ring-red/40"
            >
              Reset all
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
