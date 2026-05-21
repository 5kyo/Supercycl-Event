'use client';

import { useMockState } from '@/lib/mock-state';

type Props = {
  /** `inline` — in-flow full-width primary (mobile under hero).
   *  `floating` — sticky pill centered over the dimmed Hub body (desktop). */
  variant: 'inline' | 'floating';
};

export function LoginCta({ variant }: Props) {
  const { dispatch } = useMockState();
  const onClick = () => dispatch({ type: 'SET_AUTH', status: 'logged_in' });

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="btn-primary w-full"
        style={{ height: 52, fontSize: 15 }}
      >
        Sign in with OKX to start
      </button>
    );
  }

  return (
    <div
      className="pointer-events-none sticky z-20 hidden lg:flex"
      style={{ bottom: 32, justifyContent: 'center' }}
    >
      <button
        type="button"
        onClick={onClick}
        className="btn-primary pointer-events-auto"
        style={{
          height: 56,
          padding: '0 28px',
          fontSize: 15,
          boxShadow: '0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        Sign in with OKX to start
      </button>
    </div>
  );
}
