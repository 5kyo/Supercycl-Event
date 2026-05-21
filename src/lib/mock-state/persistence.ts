import type { MockState } from './types';
import { initialState } from './initial';

export const STORAGE_KEY = 'supercycl-event-mock-state';
const KEY = STORAGE_KEY;

export function loadState(): MockState {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as MockState;
    // Merge to fill in any new fields added to schema after persistence
    return { ...initialState, ...parsed, dismissedFlags: { ...parsed.dismissedFlags } };
  } catch {
    return initialState;
  }
}

export function saveState(state: MockState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded etc. — silently ignore, state will reset next load
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}
