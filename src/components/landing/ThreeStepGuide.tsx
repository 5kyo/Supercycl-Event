import { en } from '@/content/en';

export function ThreeStepGuide() {
  const steps = [en.steps.step1, en.steps.step2, en.steps.step3];
  return (
    <section className="mx-auto max-w-6xl px-6 py-8 lg:py-12">
      <h2 className="mb-4 text-xl font-semibold">{en.steps.heading}</h2>
      <ol className="grid gap-3 lg:grid-cols-3">
        {steps.map((label, i) => (
          <li key={i} className="rounded-xl bg-surface p-5 ring-1 ring-muted/20">
            <div className="event-countdown-numerals mb-2 text-2xl text-mono-green">{i + 1}</div>
            <p>{label}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
