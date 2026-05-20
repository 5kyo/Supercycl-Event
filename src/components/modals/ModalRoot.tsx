'use client';

import { Modal } from './Modal';
import { useMockState } from '@/lib/mock-state';
import { pickAutoModal, dismissKeyFor } from '@/lib/modalPriority';

// TEMPORARY stub modals — replaced by Task 16
function StubAutoModal({ id, onClose }: { id: string; onClose: () => void }) {
  return (
    <Modal title={`[Stub] ${id}`} onClose={onClose}>
      <p className="text-sm">This modal will be implemented in Task 16.</p>
      <div className="mt-4 flex justify-end">
        <button type="button" onClick={onClose} className="rounded-lg bg-mono-green px-4 py-2 text-sm font-semibold text-bg">OK</button>
      </div>
    </Modal>
  );
}

export function ModalRoot() {
  const { state, dispatch } = useMockState();
  const id = pickAutoModal(state);
  if (!id) return null;

  const close = () => dispatch({ type: 'DISMISS', key: dismissKeyFor(id) });
  return <StubAutoModal id={id} onClose={close} />;
}
