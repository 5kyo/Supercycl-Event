'use client';

import { useEffect, useState } from 'react';

type Props = {
  value: number;
  /** Font size in px for each digit cell. */
  fontSize?: number;
  /** CSS color value (defaults to currentColor so parents control it). */
  color?: string;
  /** Tailwind/inline font-family. */
  fontFamily?: string;
  /** Font weight applied to each digit. */
  fontWeight?: number | string;
  /** Animation duration in ms for the rollup. */
  duration?: number;
  /** Letter spacing. */
  letterSpacing?: string;
  /** Optional aria-label override. */
  ariaLabel?: string;
  /** Format the numeric value before rendering. Non-digit chars (e.g. thousand
   *  separators) flow through the static-span path and don't animate. */
  format?: (n: number) => string;
};

/**
 * NumberRoller — digit-by-digit rollup animation.
 *
 * Renders each digit of `value` as a column of 0–9, then slides the column
 * vertically to reveal the active digit. When `value` changes, the slide
 * transitions smoothly. Non-digit characters (`$`, `,`, `.`, `/`) are kept
 * in place without animation.
 *
 * Reduced motion: if the user prefers reduced motion, the rollup is replaced
 * with an instant cut.
 */
export function NumberRoller({
  value,
  fontSize = 48,
  color = 'currentColor',
  fontFamily = 'var(--font-mono)',
  fontWeight = 700,
  duration = 800,
  letterSpacing = '-0.03em',
  ariaLabel,
  format,
}: Props) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener?.('change', set);
    return () => mq.removeEventListener?.('change', set);
  }, []);

  const cellHeight = Math.round(fontSize * 0.95);
  const displayStr = format ? format(value) : String(value);
  const chars = displayStr.split('');
  const effectiveDuration = reduced ? 0 : duration;

  return (
    <span
      aria-label={ariaLabel ?? displayStr}
      role={ariaLabel ? 'status' : undefined}
      style={{
        display: 'inline-flex',
        fontVariantNumeric: 'tabular-nums',
        fontFamily,
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        lineHeight: `${cellHeight}px`,
        height: cellHeight,
        alignItems: 'center',
      }}
    >
      {chars.map((c, i) => {
        const isDigit = /[0-9]/.test(c);
        if (!isDigit) {
          return (
            <span key={`s-${i}`} style={{ display: 'inline-block', padding: '0 0.04em' }}>
              {c}
            </span>
          );
        }
        const d = Number(c);
        // key includes length so re-mounting happens cleanly when digit-count changes
        return (
          <span
            key={`d-${i}-${chars.length}`}
            aria-hidden
            style={{
              display: 'inline-block',
              height: cellHeight,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <span
              style={{
                display: 'block',
                transform: `translateY(${-d * cellHeight}px)`,
                transition: `transform ${effectiveDuration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                willChange: 'transform',
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <span
                  key={n}
                  style={{
                    display: 'block',
                    height: cellHeight,
                    lineHeight: `${cellHeight}px`,
                  }}
                >
                  {n}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
