'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';

export function SlotSecuredModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useMockState();
  const slot = state.userSlotNumber ?? 0;
  return (
    <Modal title={en.modal.slotSecured.title(slot)} onClose={onClose}>
      <div
        className="event-burst mb-lg mx-auto flex h-20 w-20 items-center justify-center rounded-full text-5xl"
        style={{
          background: 'var(--accent-tint)',
          boxShadow: '0 0 40px var(--accent-glow), inset 0 0 20px var(--accent-glow-inset)',
        }}
        aria-hidden
      >
        🎉
      </div>
      <p className="mb-2xl text-body-lg text-text-secondary text-center">
        {en.modal.slotSecured.body}
      </p>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'SET_USDT_PAYOUT_STATUS', status: '수령 정보 미등록' });
            onClose();
          }}
          className="btn-primary-sm"
        >
          {en.modal.slotSecured.cta}
        </button>
      </div>
    </Modal>
  );
}
