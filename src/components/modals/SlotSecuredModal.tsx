'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';

export function SlotSecuredModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useMockState();
  const slot = state.userSlotNumber ?? 0;
  return (
    <Modal title={en.modal.slotSecured.title(slot)} onClose={onClose}>
      <div className="event-burst mb-4 text-4xl">🎉</div>
      <p className="mb-6 text-sm">{en.modal.slotSecured.body}</p>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'SET_USDT_PAYOUT_STATUS', status: '수령 정보 미등록' });
            onClose();
          }}
          className="rounded-lg bg-mono-green px-5 py-2 font-semibold text-bg"
        >
          {en.modal.slotSecured.cta}
        </button>
      </div>
    </Modal>
  );
}
