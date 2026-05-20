type Props = { value: number; max: number; ariaLabel?: string };

export function ProgressBar({ value, max, ariaLabel }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-surface"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel}
    >
      <div
        data-fill
        className="event-shimmer h-full rounded-full bg-mono-green transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
