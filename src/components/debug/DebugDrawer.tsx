'use client';

import { useEffect, useState } from 'react';
import { AuthSection } from './AuthSection';
import { TradingSection } from './TradingSection';
import { SlotsSection } from './SlotsSection';
import { useMockState } from '@/lib/mock-state';
import { clearState } from '@/lib/mock-state/persistence';
import { initialState } from '@/lib/mock-state';

// TEMPORARY stub sections — replaced by Task 18
function StubSection({ name }: { name: string }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">{name}</h3>
      <p className="text-xs text-muted italic">[Stub — Task 18]</p>
    </section>
  );
}

export function DebugDrawer() {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useMockState();

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

  function exportState() {
    navigator.clipboard.writeText(JSON.stringify(state, null, 2));
  }
  async function importState() {
    const raw = window.prompt('Paste exported state JSON');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      dispatch({ type: 'IMPORT_STATE', state: { ...initialState, ...parsed } });
    } catch {
      window.alert('Invalid JSON');
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open debug drawer"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-30 rounded-full bg-surface-solid p-3 text-mono-green ring-1 ring-mono-green/30 shadow-lg"
      >
        🐞
      </button>
      {open && (
        <aside
          role="complementary"
          aria-label="Mock state toggles"
          className="fixed bottom-0 right-0 z-50 max-h-[50vh] w-full overflow-y-auto bg-surface-solid p-5 shadow-2xl ring-1 ring-mono-green/20 lg:bottom-auto lg:right-0 lg:top-0 lg:h-screen lg:max-h-screen lg:w-[420px]"
        >
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Mock State Toggles</h2>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="text-muted hover:text-text">✕</button>
          </header>
          <div className="flex flex-col gap-6 text-sm">
            <AuthSection />
            <TradingSection />
            <SlotsSection />
            <StubSection name="USDT" />
            <StubSection name="Survey" />
            <StubSection name="ICX" />
            <StubSection name="Time" />
            <StubSection name="Viewport" />
            <StubSection name="Flags" />
            <div className="flex flex-wrap gap-2">
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
              <button type="button" onClick={exportState} className="rounded-md bg-bg/40 px-3 py-2 ring-1 ring-muted/20">
                Export
              </button>
              <button type="button" onClick={importState} className="rounded-md bg-bg/40 px-3 py-2 ring-1 ring-muted/20">
                Import
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
