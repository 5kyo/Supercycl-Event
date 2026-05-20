import { en } from '@/content/en';

type Props = { remaining: number };

function tensionClass(remaining: number): string {
  if (remaining <= 10) return 'event-tension-10';
  if (remaining <= 50) return 'event-tension-50';
  if (remaining <= 100) return 'event-tension-100';
  return '';
}

export function LiveSlotCounter({ remaining }: Props) {
  const tension = tensionClass(remaining);
  return (
    <div
      className="card flex flex-col gap-1"
      style={{ padding: '20px' }}
      aria-live="polite"
    >
      <span className="text-label-sm uppercase tracking-wider text-text-secondary">
        {en.slot.label}
      </span>
      <div className="flex items-baseline gap-2">
        <span
          className={`event-countdown-numerals text-5xl font-bold lg:text-6xl ${tension || 'text-accent'}`}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {remaining}
        </span>
        <span className="text-title-md text-text-tertiary">{en.slot.suffix}</span>
      </div>
    </div>
  );
}
