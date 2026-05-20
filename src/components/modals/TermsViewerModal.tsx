'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';

export function TermsViewerModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title={en.modal.terms.title} onClose={onClose}>
      <div className="prose prose-invert max-h-[60vh] overflow-y-auto pr-2 text-sm leading-relaxed">
        <h3>Event Terms (placeholder)</h3>
        <p>Placeholder content. Replace with legal team output before launch.</p>
        <h3>Privacy Policy (placeholder)</h3>
        <p>Placeholder content. Replace with legal team output before launch.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <button type="button" onClick={onClose} className="rounded-lg bg-mono-green px-4 py-2 text-sm font-semibold text-bg">
          {en.modal.terms.close}
        </button>
      </div>
    </Modal>
  );
}
