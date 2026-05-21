'use client';

import { type ReactNode } from 'react';
import { useMockState } from '@/lib/mock-state';
import { useIsEmbedded } from '@/lib/useIsEmbedded';

const WIDTHS: Record<string, number> = {
  'mobile-390': 390,
  'tablet-768': 768,
  'desktop-1280': 1280,
};

/**
 * ViewportFrame — when the debug drawer picks a non-`auto` viewport, mount the
 * page inside an iframe at that width. The iframe is a separate browsing
 * context so Tailwind's media queries respect the simulated width.
 * Parent ↔ iframe state stays in sync via localStorage `storage` events
 * (wired in MockStateProvider).
 */
export function ViewportFrame({ children }: { children: ReactNode }) {
  const { state } = useMockState();
  const embedded = useIsEmbedded();

  // Inside the iframe, never wrap again — render the page as-is.
  if (embedded) return <>{children}</>;
  if (state.debugViewport === 'auto') return <>{children}</>;

  const width = WIDTHS[state.debugViewport]!;

  return (
    <div className="flex min-h-screen justify-center p-6">
      <iframe
        src="/?embed=1"
        title="Mobile viewport preview"
        style={{
          width,
          height: '90vh',
          maxWidth: '100%',
          border: '1px solid var(--border-glass-strong)',
          borderRadius: 20,
          background: 'var(--surface-1)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
      />
    </div>
  );
}
