'use client';

import { createContext, useContext, useEffect, useReducer, useRef, type ReactNode } from 'react';
import { reducer } from './reducer';
import { loadState, saveState } from './persistence';
import { initialState } from './initial';
import type { Action, MockState } from './types';

type Ctx = { state: MockState; dispatch: (a: Action) => void };
const MockStateCtx = createContext<Ctx | null>(null);

export function MockStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hydrated = useRef(false);

  // Hydrate from localStorage once on mount (client only) — keeps SSR and first client paint
  // in sync with initialState, then catches up to persisted state in an effect.
  useEffect(() => {
    const loaded = loadState();
    dispatch({ type: 'IMPORT_STATE', state: loaded });
    hydrated.current = true;
  }, []);

  // Persist only AFTER hydration finishes, to avoid overwriting saved state with initialState
  // during the brief moment between the first render and the hydration effect.
  useEffect(() => {
    if (!hydrated.current) return;
    saveState(state);
  }, [state]);

  return <MockStateCtx.Provider value={{ state, dispatch }}>{children}</MockStateCtx.Provider>;
}

export function useMockState() {
  const ctx = useContext(MockStateCtx);
  if (!ctx) throw new Error('useMockState must be used within MockStateProvider');
  return ctx;
}
