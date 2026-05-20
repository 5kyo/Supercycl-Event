'use client';

import { useEffect, type ReactNode } from 'react';
import { useFocusTrap } from '@/lib/a11y/useFocusTrap';

type Props = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: 'md' | 'lg';
};

export function Modal({ title, onClose, children, size = 'md' }: Props) {
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
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur lg:items-center"
      onClick={onClose}
    >
      <div
        ref={ref}
        onClick={e => e.stopPropagation()}
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-surface-solid p-6 ring-1 ring-mono-green/20 lg:rounded-2xl ${size === 'lg' ? 'lg:max-w-3xl' : 'lg:max-w-xl'}`}
      >
        <header className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold">{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="text-muted hover:text-text">✕</button>
        </header>
        {children}
      </div>
    </div>
  );
}
