import { en } from '@/content/en';

export function RewardSummaryCard() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-8 lg:py-12">
      <h2 className="mb-4 text-xl font-semibold">{en.rewards.heading}</h2>
      <ul className="grid gap-3 lg:grid-cols-2">
        <li className="rounded-xl bg-surface p-5 ring-1 ring-mono-green/20">
          <span className="text-mono-green">●</span> {en.rewards.usdtLine}
        </li>
        <li className="rounded-xl bg-surface p-5 ring-1 ring-mono-green/20">
          <span className="text-mono-green">●</span> {en.rewards.icxLine}
        </li>
      </ul>
    </section>
  );
}
