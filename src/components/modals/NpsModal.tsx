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
      <p className="mb-4 text-sm">{en.modal.nps.body}</p>
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 11 }, (_, i) => i).map(n => (
          <button
            key={n}
            type="button"
            onClick={() => setScore(n)}
            className={`min-w-[2.5rem] rounded-lg p-3 text-sm ${score === n ? 'bg-mono-green text-bg' : 'bg-bg/40'}`}
          >
            {n}
          </button>
        ))}
      </div>
      {(needsUsdt || needsIcx) && (
        <p className="mb-4 rounded-md bg-amber/10 p-3 text-sm text-amber">{en.modal.nps.registerReminder}</p>
      )}
      <div className="flex justify-end">
        <button type="button" onClick={onClose} className="rounded-lg bg-mono-green px-5 py-2 font-semibold text-bg">
          Submit
        </button>
      </div>
    </Modal>
  );
}
