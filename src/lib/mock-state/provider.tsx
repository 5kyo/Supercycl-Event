'use client';

import { createContext, useContext, useEffect, useReducer, useRef, type ReactNode } from 'react';
import { reducer } from './reducer';
import { loadState, saveState, STORAGE_KEY } from './persistence';
import { initialState } from './initial';
import type { Action, MockState } from './types';

type Ctx = { state: MockState; dispatch: (a: Action) => void };
const MockStateCtx = createContext<Ctx | null>(null);

export function MockStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hydrated = useRef(false);
  // Tracks the JSON we just wrote (or just imported) so the cross-document
  // storage listener can skip echoes and avoid an infinite parent↔iframe loop.
  const lastSerializedRef = useRef<string>('');

  useEffect(() => {
    const loaded = loadState();
    lastSerializedRef.current = JSON.stringify(loaded);
    dispatch({ type: 'IMPORT_STATE', state: loaded });
    // hydrated flips inside the save effect below, after the IMPORT_STATE
    // dispatch has actually flowed into a render. Flipping it here would let
    // the save effect fire once with the stale initialState and clobber
    // localStorage — which then bounces back into the iframe via the
    // storage listener and makes the simulated viewport revert.
  }, []);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    lastSerializedRef.current = JSON.stringify(state);
    saveState(state);
  }, [state]);

  // Cross-document sync — when another same-origin document (the iframe
  // preview, or its parent) writes the same key, mirror that state in.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      if (e.newValue === lastSerializedRef.current) return;
      try {
        const next = JSON.parse(e.newValue) as MockState;
        lastSerializedRef.current = e.newValue;
        dispatch({ type: 'IMPORT_STATE', state: next });
      } catch {
        // Bad JSON — ignore; next legitimate write will reconcile.
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return <MockStateCtx.Provider value={{ state, dispatch }}>{children}</MockStateCtx.Provider>;
}

export function useMockState() {
  const ctx = useContext(MockStateCtx);
  if (!ctx) throw new Error('useMockState must be used within MockStateProvider');
  return ctx;
}

/**
 * FrozenStateScope — overrides the mock-state context with `initialState` for
 * its subtree. Used to render the logged-out Hub preview so debug-drawer
 * toggles (trading volume, OKX linked, survey completed) don't leak into the
 * dimmed snapshot. The dispatch is a no-op since the preview is non-interactive.
 */
export function FrozenStateScope({ children }: { children: ReactNode }) {
  return (
    <MockStateCtx.Provider value={{ state: initialState, dispatch: () => {} }}>
      {children}
    </MockStateCtx.Provider>
  );
}
