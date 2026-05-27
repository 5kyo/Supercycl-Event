'use client';

import { useEffect, type ReactNode } from 'react';
import { useFocusTrap } from '@/lib/a11y/useFocusTrap';

type Props = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: 'md' | 'lg';
  /** Optional element rendered in the header before the close button — used by
   * SurveyModal for its KO|EN language toggle. */
  headerExtra?: ReactNode;
};

export function Modal({ title, onClose, children, size = 'md', headerExtra }: Props) {
  const ref = useFocusTrap(true);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="modal-overlay flex items-end justify-center lg:items-center"
      onClick={onClose}
    >
      <div
        ref={ref}
        onClick={e => e.stopPropagation()}
        className={`modal relative max-h-[90vh] w-full overflow-y-auto lg:rounded-xl ${size === 'lg' ? 'lg:max-w-3xl' : 'lg:max-w-xl'}`}
        style={{
          padding: '24px',
          /* Bottom sheet on mobile (no top corners), centered modal on lg */
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
        }}
      >
        <header className="mb-lg flex items-start justify-between gap-md">
          <h2 className="text-title-lg">{title}</h2>
          <div className="flex shrink-0 items-center gap-sm">
            {headerExtra}
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="btn-ghost shrink-0"
            >
              ✕
            </button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
