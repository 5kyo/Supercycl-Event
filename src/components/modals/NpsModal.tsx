'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';
import { isQualifiedForUsdt } from '@/lib/mock-state';

export function NpsModal({ onClose }: { onClose: () => void }) {
  const { state } = useMockState();
  const [score, setScore] = useState<number | null>(null);
  const needsUsdt = isQualifiedForUsdt(state) && state.usdtRegistration.status === 'none';
  const needsIcx = state.surveyCompleted && !state.icxAddress;

  return (
    <Modal title={en.modal.nps.title} onClose={onClose}>
      <p className="mb-lg text-body-md text-text-secondary">{en.modal.nps.body}</p>
      <div className="mb-2xl grid grid-cols-6 gap-xs sm:grid-cols-11">
        {Array.from({ length: 11 }, (_, i) => i).map(n => {
          const selected = score === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => setScore(n)}
              className={selected ? 'btn-primary-sm' : 'btn-secondary-sm'}
              style={{ minWidth: 0 }}
            >
              {n}
            </button>
          );
        })}
      </div>
      {(needsUsdt || needsIcx) && (
        <p
          className="mb-lg rounded-md text-body-sm"
          style={{
            background: 'rgba(255,167,38,0.10)',
            color: 'var(--warning)',
            border: '1px solid rgba(255,167,38,0.25)',
            padding: '12px',
          }}
        >
          {en.modal.nps.registerReminder}
        </p>
      )}
      <div className="flex justify-end">
        <button type="button" onClick={onClose} className="btn-primary-sm">
          Submit
        </button>
      </div>
    </Modal>
  );
}
