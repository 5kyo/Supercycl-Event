'use client';

import { en } from '@/content/en';
import { useMockState, slotTension, type SlotTension as SlotTensionStage } from '@/lib/mock-state';
import { NumberRoller } from './NumberRoller';

type Size = 'sm' | 'md' | 'lg';
type Layout = 'stacked' | 'inline';

type Props = {
  /** Override remaining (defaults to mock state). */
  remaining?: number;
  /** Total slot capacity. */
  total?: number;
  /** Visual size — sm: header pill, md: card, lg: hero. */
  size?: Size;
  /** Label text override (defaults to en.slot.label). */
  label?: string;
  /** Hide the inline progress bar under the number. */
  hideProgress?: boolean;
  /** stacked (default, vertical) or inline (label + counter on one row). */
  layout?: Layout;
  /** Override the tension stage. When omitted, derives from `slotTension(state)`
   *  using `remaining` — required when driving the bar from a non-slot signal
   *  (e.g. USDT/ICX pool consumption where slot thresholds don't apply). */
  stage?: SlotTensionStage;
  /** Unit suffix appended after the total (e.g. "USDT", "ICX"). */
  unit?: string;
};

const SIZES: Record<Size, { num: number; sub: number }> = {
  sm: { num: 24, sub: 11 },
  md: { num: 40, sub: 14 },
  lg: { num: 56, sub: 18 },
};

/* Tension stage → { color, glow, pulseMs } */
type StageConfig = { color: string; glow: string; pulseMs: number };
const STAGE_CONFIG: Record<SlotTensionStage, StageConfig> = {
  /* none   — safe (>100)         green   */
  none:          { color: '#00E676', glow: 'rgba(0,230,118,0.40)', pulseMs: 0 },
  /* >100   — warn (51–100)       amber   */
  'tension-100': { color: '#FFA726', glow: 'rgba(255,167,38,0.45)', pulseMs: 0 },
  /* >50    — urgent (11–50)      orange + subtle pulse */
  'tension-50':  { color: '#FF7A2A', glow: 'rgba(255,122,42,0.55)', pulseMs: 2400 },
  /* >10    — critical (0–10)     red + strong pulse  */
  'tension-10':  { color: '#FF5938', glow: 'rgba(255,89,56,0.60)',  pulseMs: 1200 },
  /* === 0   — closed (cap full)  muted red, no pulse  */
  full:          { color: '#FF5938', glow: 'rgba(255,89,56,0.35)',  pulseMs: 0 },
};

/**
 * SlotTension — replaces LiveSlotCounter with a more legible, festival-toned
 * counter that integrates color, animated rollup, and pulse stages.
 *
 * Uses the existing `slotTension(state)` selector so the visual stages match
 * the rest of the codebase. Pulse only happens at 50 or fewer remaining
 * (urgent + critical) — above that, only the color/glow shift.
 *
 * Reduced motion: pulse animation is disabled via the `event-pulse` rule in
 * event-accents.css when prefers-reduced-motion is set.
 */
export function SlotTension({
  remaining,
  total = 500,
  size = 'lg',
  label,
  hideProgress = false,
  layout = 'stacked',
  stage: stageProp,
  unit,
}: Props) {
  const { state } = useMockState();
  const r = remaining ?? state.slotsRemaining;
  const stage = stageProp ?? slotTension({ ...state, slotsRemaining: r });
  const cfg = STAGE_CONFIG[stage];
  const f = SIZES[size];
  // Cap-full: bar fully filled even though r/total === 0 — the bar reflects
  // *consumed* slots in this state so the "exhausted" reading is unambiguous.
  const pct =
    stage === 'full' ? 100 : Math.max(0, Math.min(100, (r / total) * 100));
  const labelText = label ?? en.slot.label;

  const labelEl = (
    <p
      className="text-label-sm uppercase tracking-[0.22em]"
      style={{
        color: stage === 'none' ? 'var(--text-secondary)' : cfg.color,
        transition: 'color 600ms ease',
      }}
    >
      {labelText}
    </p>
  );

  const counterEl = (
    <div
      className="flex items-baseline gap-1.5"
      style={{
        animation: cfg.pulseMs ? `event-pulse ${cfg.pulseMs}ms ease-in-out infinite` : 'none',
      }}
    >
      <span
        style={{
          color: cfg.color,
          textShadow:
            stage === 'none' || stage === 'full'
              ? 'none'
              : `0 0 20px ${cfg.glow}`,
          opacity: stage === 'full' ? 0.7 : 1,
          transition: 'color 600ms ease, text-shadow 600ms ease, opacity 600ms ease',
        }}
      >
        <NumberRoller
          value={r}
          fontSize={f.num}
          color="currentColor"
          format={(n) => n.toLocaleString()}
        />
      </span>
      <span
        className="text-text-tertiary font-mono"
        style={{ fontSize: f.sub, lineHeight: 1 }}
      >
        / {total.toLocaleString()}{unit ? ` ${unit}` : ''}
      </span>
      {stage === 'full' && (
        <span
          className="ml-2 rounded-full px-2 py-0.5 text-label-sm font-bold uppercase tracking-wider"
          style={{
            background: 'rgba(255,89,56,0.18)',
            color: cfg.color,
            border: `1px solid ${cfg.color}55`,
            letterSpacing: '0.14em',
          }}
        >
          {en.slot.fullBadge}
        </span>
      )}
    </div>
  );

  const progressEl = !hideProgress && (
    <div
      className="h-1 w-full overflow-hidden rounded-full"
      style={{ background: 'var(--surface-track)' }}
    >
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: cfg.color,
          boxShadow:
            stage === 'none' || stage === 'full'
              ? 'none'
              : `0 0 12px ${cfg.glow}`,
          opacity: stage === 'full' ? 0.55 : 1,
          transition:
            'width 800ms cubic-bezier(0.22, 1, 0.36, 1), background 600ms ease, opacity 600ms ease',
        }}
      />
    </div>
  );

  if (layout === 'inline') {
    return (
      <div className="relative" aria-live="polite">
        <div className="flex items-center justify-between gap-md">
          {labelEl}
          {counterEl}
        </div>
        {progressEl && <div className="mt-2">{progressEl}</div>}
      </div>
    );
  }

  return (
    <div className="relative" aria-live="polite">
      {/* glow halo (stacked layout only — too heavy when embedded in a card) */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          inset: -10,
          background: `radial-gradient(ellipse at left center, ${cfg.glow}, transparent 70%)`,
          filter: 'blur(20px)',
          opacity: 0.6,
          transition: 'background 600ms ease, opacity 600ms ease',
        }}
      />
      <div className="relative">
        {labelEl}
        <div className="mt-1">{counterEl}</div>
        {progressEl && <div className="mt-3">{progressEl}</div>}
      </div>
    </div>
  );
}
