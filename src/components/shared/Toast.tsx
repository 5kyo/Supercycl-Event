'use client';

import { useEffect } from 'react';

type Props = { message: string; onClose: () => void };

export function Toast({ message, onClose }: Props) {
  useEffect(() => {
    const id = setTimeout(onClose, 4000);
    return () => clearTimeout(id);
  }, [onClose]);
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md text-body-md"
      style={{
        background: 'var(--toast-bg)',
        color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-toast)',
        border: '1px solid var(--border-glass)',
        backdropFilter: 'var(--blur-card)',
        WebkitBackdropFilter: 'var(--blur-card)',
        padding: '12px 16px',
      }}
    >
      {message}
    </div>
  );
}
