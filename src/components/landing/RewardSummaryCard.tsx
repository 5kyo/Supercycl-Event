import { en } from '@/content/en';

/**
 * V2 Festival reward breakdown — two index-card style entries.
 * Each card: chip + heading + big right-aligned number + caption + accent aura.
 */

type Card = {
  chip: string;
  chipClass: 'chip-accent' | 'chip-info';
  heading: string;
  amount: string;
  unit: string;
  caption: string;
  auraColor: string;
  amountClass: 'accent-text' | 'text-text-primary';
};

const CARDS: Card[] = [
  {
    chip: 'Event 1 · Trading',
    chipClass: 'chip-accent',
    heading: 'Trade $500 in volume',
    amount: '20',
    unit: 'USDT',
    caption: 'First 500 traders. Auto-marked when slot is secured.',
    auraColor: 'rgba(0,230,118,0.18)',
    amountClass: 'accent-text',
  },
  {
    chip: 'Event 2 · Survey',
    chipClass: 'chip-info',
    heading: 'Answer 13 questions',
    amount: '100',
    unit: 'ICX',
    caption: '~7 min. Opens Jun 29 after the trading phase.',
    auraColor: 'rgba(34,211,238,0.14)',
    amountClass: 'text-text-primary',
  },
];

export function RewardSummaryCard() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-2xl lg:py-3xl">
      <h2 className="mb-lg upper-label">{en.rewards.heading || 'What you get'}</h2>
      <ul className="flex flex-col gap-md lg:grid lg:grid-cols-2">
        {CARDS.map((c) => (
          <li
            key={c.chip}
            className="card-elevated relative overflow-hidden"
            style={{ padding: 18 }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${c.auraColor}, transparent 70%)`,
              }}
            />
            <div className="relative">
              <div className="flex items-start justify-between gap-md">
                <div>
                  <span className={`chip ${c.chipClass}`} style={{ marginBottom: 8 }}>
                    {c.chip}
                  </span>
                  <h3 className="mt-md text-title-sm">{c.heading}</h3>
                </div>
                <div className="text-right">
                  <div
                    className={`${c.amountClass} tabnum font-bold`}
                    style={{ fontSize: 36, lineHeight: 1 }}
                  >
                    {c.amount}
                  </div>
                  <div className="mt-1 text-label-sm text-text-secondary">{c.unit}</div>
                </div>
              </div>
              <p className="mt-md text-body-sm text-text-tertiary">{c.caption}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
