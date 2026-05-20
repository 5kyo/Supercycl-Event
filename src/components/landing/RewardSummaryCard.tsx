import { en } from '@/content/en';

type Item = {
  amount: string;
  unit: string;
  condition: string;
  variant: 'usdt' | 'icx';
};

const items: Item[] = [
  { amount: '20', unit: 'USDT', condition: en.rewards.usdtLine, variant: 'usdt' },
  { amount: '100', unit: 'ICX', condition: en.rewards.icxLine, variant: 'icx' },
];

export function RewardSummaryCard() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
      <h2 className="mb-lg text-title-lg lg:text-display-md">{en.rewards.heading}</h2>
      <ul className="grid gap-md lg:grid-cols-2">
        {items.map((it) => (
          <li
            key={it.unit}
            className={it.variant === 'icx' ? 'card-elevated' : 'card'}
            style={{ padding: '24px' }}
          >
            <div className="flex items-baseline gap-2">
              <span
                className="text-4xl font-bold lg:text-5xl"
                style={{
                  backgroundImage: 'var(--accent-gradient)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.02em',
                }}
              >
                {it.amount}
              </span>
              <span className="text-title-md text-text-secondary">{it.unit}</span>
            </div>
            <p className="mt-sm text-body-md text-text-secondary">{it.condition}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
