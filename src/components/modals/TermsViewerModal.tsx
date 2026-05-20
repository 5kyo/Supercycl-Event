'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';

export function TermsViewerModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title={en.modal.terms.title} onClose={onClose}>
      <div
        className="card max-h-[60vh] overflow-y-auto text-body-md leading-relaxed"
        style={{ padding: '18px' }}
      >
        <h3 className="text-title-md mb-sm">Event Terms (placeholder)</h3>
        <p className="text-text-secondary mb-md">
          Placeholder content. Replace with legal team output before launch.
        </p>
        <h3 className="text-title-md mb-sm">Privacy Policy (placeholder)</h3>
        <p className="text-text-secondary">
          Placeholder content. Replace with legal team output before launch.
        </p>
      </div>
      <div className="mt-lg flex justify-end">
        <button type="button" onClick={onClose} className="btn-secondary-sm">
          {en.modal.terms.close}
        </button>
      </div>
    </Modal>
  );
}
