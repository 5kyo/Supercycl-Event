import type { MockState } from './mock-state';
import { isQualifiedForUsdt } from './mock-state';

export type ModalId = 'slotSecured' | 'halfwayMilestone' | 'nps' | null;

/**
 * Spec §9.2 priority:
 *   slot secured (eligibility crossed) > payment-complete toast (handled separately)
 *   > milestone (50%) > general (nps)
 */
export function pickAutoModal(state: MockState): ModalId {
  // NPS on/after campaign end
  if (state.simulatedDate >= '2026-07-07' && !state.dismissedFlags.npsModal) return 'nps';

  // SlotSecured: qualified + slot reached, not yet dismissed
  if (isQualifiedForUsdt(state) && state.userSlotNumber && !state.dismissedFlags.slotSecuredModal) {
    return 'slotSecured';
  }

  // Halfway milestone — 250 <= volume < 500
  if (state.tradingVolume >= 250 && state.tradingVolume < 500 && !state.dismissedFlags.halfwayMilestone) {
    return 'halfwayMilestone';
  }

  return null;
}

export function dismissKeyFor(id: NonNullable<ModalId>): keyof MockState['dismissedFlags'] {
  switch (id) {
    case 'slotSecured':      return 'slotSecuredModal';
    case 'halfwayMilestone': return 'halfwayMilestone';
    case 'nps':              return 'npsModal';
  }
}
