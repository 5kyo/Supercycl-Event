'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';

export function MilestoneCardModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title={en.modal.milestone.title} onClose={onClose}>
      <p className="text-body-lg text-text-secondary">{en.modal.milestone.body}</p>
      <div className="mt-2xl flex justify-end">
        <button type="button" onClick={onClose} className="btn-primary-sm">
          OK
        </button>
      </div>
    </Modal>
  );
}
