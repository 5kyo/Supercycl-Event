'use client';

import { type ReactNode } from 'react';
import { useMockState } from '@/lib/mock-state';

const WIDTHS: Record<string, number> = {
  'mobile-390': 390,
  'tablet-768': 768,
  'desktop-1280': 1280,
};

export function ViewportFrame({ children }: { children: ReactNode }) {
  const { state } = useMockState();
  if (state.debugViewport === 'auto') return <>{children}</>;
  const width = WIDTHS[state.debugViewport]!;
  return (
    <div className="flex min-h-screen justify-center bg-black/40 p-6">
      <div className="border border-mono-green/40 shadow-2xl" style={{ width, minHeight: '90vh', maxWidth: '100%' }}>
        {children}
      </div>
    </div>
  );
}
