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
    <div className="flex flex-col gap-1" aria-live="polite">
      <span className="text-sm text-muted">{en.slot.label}</span>
      <div className="flex items-baseline gap-2">
        <span className={`event-countdown-numerals text-4xl font-bold ${tension}`}>{remaining}</span>
        <span className="text-lg text-muted">{en.slot.suffix}</span>
      </div>
    </div>
  );
}
