'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';
import { IcxRegistrationForm } from '@/components/hub/IcxRegistrationForm';

/**
 * IcxRegistrationModal — modal wrapper around the shared
 * `IcxRegistrationForm`. The Hub default flow now embeds the form directly
 * inside `IcxRewardCard`; this modal stays alive for the
 * `SurveyCompleteModal → register ICX` jump and `EventClosed`.
 *
 * Modal-only chrome: title + reward banner ("✓ Survey complete · 100 ICX").
 * The form dispatches `SET_ICX_ADDRESS` + `SET_ICX_PAYOUT_STATUS('PENDING_PAYOUT')`.
 */
export function IcxRegistrationModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title={en.modal.icx.title} onClose={onClose}>
      <div
        className="relative mb-lg overflow-hidden rounded-lg"
        style={{
          padding: '20px 18px',
          background:
            'linear-gradient(135deg, rgba(217,70,239,0.12), rgba(0,230,118,0.06))',
          border: '1px solid var(--accent-border-soft)',
        }}
      >
        <div
          aria-hidden
          className="aura aura-accent"
          style={{ top: -30, right: -30, width: 120, height: 120 }}
        />
        <div className="relative flex items-center justify-between gap-md">
          <div>
            <p
              className="font-mono uppercase text-accent"
              style={{ fontSize: 11, letterSpacing: '0.18em' }}
            >
              ✓ Survey complete · 13 / 13
            </p>
            <p className="mt-1 text-body-md text-text-primary">
              Tell us where to send your ICX.
            </p>
          </div>
          <div className="text-right">
            <div
              className="tabnum font-bold text-text-primary"
              style={{ fontSize: 36, lineHeight: 1 }}
            >
              100
            </div>
            <div className="mt-1 text-label-sm text-text-secondary">ICX</div>
          </div>
        </div>
      </div>

      <IcxRegistrationForm onSuccess={onClose} onCancel={onClose} />
    </Modal>
  );
}
