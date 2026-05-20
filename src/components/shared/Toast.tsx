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
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-surface-solid px-4 py-3 text-sm shadow-lg ring-1 ring-mono-green/30"
    >
      {message}
    </div>
  );
}
