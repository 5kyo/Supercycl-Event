import type { MockState } from './mock-state';

export type ModalId = 'nps' | null;

/**
 * Auto-modal priority. The qualified-for-USDT celebration used to live here
 * as a popup; that flow now drives the user from inside `UsdtRewardCard` via
 * an explicit CTA, so the only remaining auto-modal is the post-event NPS.
 */
export function pickAutoModal(state: MockState): ModalId {
  if (state.simulatedDate >= '2026-07-07' && !state.dismissedFlags.npsModal) return 'nps';
  return null;
}

export function dismissKeyFor(id: NonNullable<ModalId>): keyof MockState['dismissedFlags'] {
  switch (id) {
    case 'nps': return 'npsModal';
  }
}
