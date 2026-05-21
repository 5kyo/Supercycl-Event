import type { MockState } from './mock-state';
import { isQualifiedForUsdt } from './mock-state';

export type ModalId = 'slotSecured' | 'nps' | null;

/**
 * Spec §9.2 priority:
 *   slot secured (eligibility crossed) > payment-complete toast (handled separately)
 *   > general (nps)
 */
export function pickAutoModal(state: MockState): ModalId {
  // NPS on/after campaign end
  if (state.simulatedDate >= '2026-07-07' && !state.dismissedFlags.npsModal) return 'nps';

  // SlotSecured: qualified + slot reached, not yet dismissed
  if (isQualifiedForUsdt(state) && state.userSlotNumber && !state.dismissedFlags.slotSecuredModal) {
    return 'slotSecured';
  }

  return null;
}

export function dismissKeyFor(id: NonNullable<ModalId>): keyof MockState['dismissedFlags'] {
  switch (id) {
    case 'slotSecured': return 'slotSecuredModal';
    case 'nps':         return 'npsModal';
  }
}
