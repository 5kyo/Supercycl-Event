'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';

export function MilestoneCardModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title={en.modal.milestone.title} onClose={onClose}>
      <p className="text-sm">{en.modal.milestone.body}</p>
      <div className="mt-6 flex justify-end">
        <button type="button" onClick={onClose} className="rounded-lg bg-mono-green px-5 py-2 font-semibold text-bg">
          OK
        </button>
      </div>
    </Modal>
  );
}
