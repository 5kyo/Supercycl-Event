'use client';

import { useEffect } from 'react';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';
import { useFocusTrap } from '@/lib/a11y/useFocusTrap';

/**
 * V2 Festival SlotSecured — full-screen celebration overlay.
 * Triggered when user crosses $500 trading volume.
 * Layout: 3 colored auras (green/cyan/magenta) + center card with ribbon,
 *   giant slot # display, divider, reward statement.
 */
export function SlotSecuredModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useMockState();
  const ref = useFocusTrap(true);
  const slot = state.userSlotNumber ?? Math.max(1, 500 - state.slotsRemaining);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleRegister() {
    dispatch({ type: 'SET_USDT_PAYOUT_STATUS', status: '수령 정보 미등록' });
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={en.modal.slotSecured.title(slot)}
      className="modal-overlay relative"
      onClick={onClose}
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(14px)' }}
    >
      {/* Celebration auras */}
      <div
        aria-hidden
        className="aura event-pulse"
        style={{
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 360,
          height: 360,
          background: 'radial-gradient(circle, rgba(0,230,118,0.55), transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="aura aura-cyan"
        style={{ top: '15%', left: '20%', width: 180, height: 180 }}
      />
      <div
        aria-hidden
        className="aura aura-magenta"
        style={{ top: '25%', right: '15%', width: 200, height: 200 }}
      />

      {/* Center card */}
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        className="event-burst absolute flex flex-col items-center text-center"
        style={{
          inset: '15% 22px 30% 22px',
          background:
            'linear-gradient(180deg, rgba(15,30,20,0.6), rgba(5,5,7,0.85))',
          border: '1px solid var(--accent-border-soft)',
          borderTop: '1px solid rgba(0,230,118,0.5)',
          borderRadius: 28,
          padding: '28px 24px',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          boxShadow:
            '0 24px 60px rgba(0,0,0,0.5), 0 0 60px rgba(0,230,118,0.15)',
        }}
      >
        {/* Ribbon */}
        <div
          className="font-mono font-semibold uppercase"
          style={{
            padding: '6px 14px',
            background: 'var(--accent-gradient)',
            color: 'var(--text-inverse)',
            borderRadius: 999,
            fontSize: 11,
            letterSpacing: '0.14em',
            boxShadow: '0 6px 18px rgba(0,230,118,0.5)',
          }}
        >
          🎉 Slot secured
        </div>

        {/* Giant slot # */}
        <div className="mt-2xl flex items-baseline gap-1">
          <span className="font-bold text-text-tertiary" style={{ fontSize: 18, lineHeight: 1 }}>
            #
          </span>
          <span
            className="tabnum font-bold"
            style={{
              fontSize: 64,
              lineHeight: 0.9,
              color: 'var(--accent)',
              textShadow: '0 0 30px rgba(0,230,118,0.6)',
              letterSpacing: '-0.03em',
            }}
          >
            {slot}
          </span>
          <span
            className="font-mono text-text-tertiary"
            style={{ fontSize: 18, lineHeight: 1, letterSpacing: '0.05em' }}
          >
            /500
          </span>
        </div>

        <p
          className="mt-xs font-mono font-medium uppercase text-text-secondary"
          style={{ fontSize: 13, letterSpacing: '0.1em' }}
        >
          Your spot is locked in.
        </p>

        {/* Divider */}
        <div
          aria-hidden
          className="my-2xl"
          style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.15)' }}
        />

        {/* Reward statement */}
        <p className="text-body-md text-text-secondary-strong">You&apos;ll receive</p>
        <div className="mt-xs flex items-baseline gap-1">
          <span
            className="accent-text tabnum font-bold"
            style={{ fontSize: 56, lineHeight: 0.9, letterSpacing: '-0.025em' }}
          >
            20
          </span>
          <span className="text-accent font-bold" style={{ fontSize: 22, lineHeight: 1 }}>
            USDT
          </span>
        </div>
        <p className="mt-sm text-body-sm text-text-tertiary">{en.modal.slotSecured.body}</p>
      </div>

      {/* Bottom CTAs */}
      <div
        className="absolute left-0 right-0 bottom-0 flex flex-col gap-sm"
        style={{ padding: '16px 22px 28px' }}
      >
        <button
          type="button"
          onClick={handleRegister}
          className="btn-primary w-full"
          style={{ height: 56 }}
        >
          {en.modal.slotSecured.cta} →
        </button>
        <button
          type="button"
          onClick={onClose}
          className="btn-ghost w-full text-text-secondary"
          style={{ height: 44, fontSize: 13 }}
        >
          I&apos;ll do it later
        </button>
      </div>
    </div>
  );
}
