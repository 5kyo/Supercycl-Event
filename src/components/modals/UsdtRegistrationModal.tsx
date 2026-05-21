'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';
import { UsdtRegistrationForm } from '@/components/hub/UsdtRegistrationForm';

/**
 * UsdtRegistrationModal — modal wrapper around the shared
 * `UsdtRegistrationForm`. The Hub default flow now embeds the form directly
 * inside `UsdtRewardCard`; this modal stays alive for `HubPending` and
 * `EventClosed`, which both prefer a focused full-screen step.
 *
 * Modal-only chrome: title + festive reward banner ("Slot #N secured · 20
 * USDT"). The form below dispatches `SET_USDT_REGISTRATION` and
 * `SET_USDT_PAYOUT_STATUS('대기')` on submit.
 */
export function UsdtRegistrationModal({ onClose }: { onClose: () => void }) {
  const { state } = useMockState();
  const slotNumber = Math.max(1, 500 - state.slotsRemaining);

  return (
    <Modal title={en.modal.usdt.title} onClose={onClose} size="lg">
      <div
        className="relative mb-lg overflow-hidden rounded-lg"
        style={{
          padding: '20px 18px',
          background:
            'linear-gradient(135deg, rgba(0,230,118,0.18), rgba(0,230,118,0.04))',
          border: '1px solid var(--accent-border-soft)',
        }}
      >
        <div
          aria-hidden
          className="event-aura event-aura-accent"
          style={{ top: -30, right: -30, width: 140, height: 140 }}
        />
        <div className="relative flex items-center justify-between gap-md">
          <div>
            <p className="text-label-sm uppercase tracking-[0.18em] text-accent">
              🎉 Slot #{slotNumber} / 500 secured
            </p>
            <p className="mt-1 text-body-md text-text-primary">
              Tell us where to send it.
            </p>
          </div>
          <div className="text-right">
            <div
              className="font-bold text-accent"
              style={{
                fontSize: 36,
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
              }}
            >
              20
            </div>
            <div className="mt-1 text-label-sm text-accent-light">USDT</div>
          </div>
        </div>
      </div>

      <UsdtRegistrationForm onSuccess={onClose} onCancel={onClose} />
    </Modal>
  );
}
