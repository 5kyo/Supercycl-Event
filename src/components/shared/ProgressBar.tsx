type Props = { value: number; max: number; ariaLabel?: string };

export function ProgressBar({ value, max, ariaLabel }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full"
      style={{ background: 'var(--surface-track)' }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel}
    >
      <div
        data-fill
        className="event-shimmer h-full rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          background: 'var(--accent-gradient)',
          boxShadow: '0 0 12px var(--accent-glow)',
        }}
      />
    </div>
  );
}
