'use client';

import { useMockState } from '@/lib/mock-state';

/**
 * V2 Desktop top bar — only visible on lg:+. Logo dot + festival label on
 * left, date + Sign-in on right. Sign-in flips auth state via the shared
 * mock-state hook.
 */
export function DesktopTopBar() {
  const { dispatch } = useMockState();
  return (
    <div
      className="hidden border-b border-border-subtle lg:flex"
      style={{ padding: '20px 48px', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <div className="flex items-center gap-md">
        <span
          aria-hidden
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--accent)',
            boxShadow: '0 0 12px var(--accent)',
          }}
        />
        <span className="upper-label text-accent" style={{ fontSize: 11 }}>
          Supercycl · Mobile Launch Festival
        </span>
      </div>
      <div className="flex items-center gap-lg">
        <span
          className="font-mono text-text-tertiary"
          style={{ fontSize: 12, letterSpacing: '0.1em' }}
        >
          JUN 08 — JUL 07 · 2026
        </span>
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_AUTH', status: 'logged_in' })}
          className="btn-primary"
          style={{ height: 40, padding: '0 18px', fontSize: 14 }}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
