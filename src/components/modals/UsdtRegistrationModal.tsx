'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';
import { UsdtRegistrationForm } from '@/components/hub/UsdtRegistrationForm';

/**
 * UsdtRegistrationModal — modal wrapper around the shared
 * `UsdtRegistrationForm`. Opened from the "Register USDT info" CTA inside
 * `UsdtRewardCard` (default Hub) and from `EventClosed` after the campaign
 * ends. The form dispatches `SET_USDT_REGISTRATION` and
 * `SET_USDT_PAYOUT_STATUS('대기')` on submit.
 */
export function UsdtRegistrationModal({ onClose }: { onClose: () => void }) {
  const { state } = useMockState();
  const slotNumber = Math.max(1, 500 - state.slotsRemaining);

  return (
    <Modal title={en.modal.usdt.title} onClose={onClose} size="lg">
      <p
        className="mb-lg inline-flex items-center gap-1 rounded-full px-3 py-1 text-label-sm uppercase tracking-[0.18em] text-accent"
        style={{
          background: 'rgba(0,230,118,0.12)',
          border: '1px solid var(--accent-border-soft)',
        }}
      >
        🎉 Slot #{slotNumber} / 500 secured
      </p>

      <UsdtRegistrationForm onSuccess={onClose} onCancel={onClose} />
    </Modal>
  );
}
