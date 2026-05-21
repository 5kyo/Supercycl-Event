'use client';

import { useMockState } from '@/lib/mock-state';
import { pickAutoModal, dismissKeyFor } from '@/lib/modalPriority';
import { SlotSecuredModal } from './SlotSecuredModal';
import { NpsModal } from './NpsModal';

export function ModalRoot() {
  const { state, dispatch } = useMockState();
  const id = pickAutoModal(state);
  if (!id) return null;

  const close = () => dispatch({ type: 'DISMISS', key: dismissKeyFor(id) });

  switch (id) {
    case 'slotSecured': return <SlotSecuredModal onClose={close} />;
    case 'nps':         return <NpsModal onClose={close} />;
  }
}
