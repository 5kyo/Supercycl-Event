import { en } from '@/content/en';

export function ThreeStepGuide() {
  const steps = [en.steps.step1, en.steps.step2, en.steps.step3];
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
      <h2 className="mb-lg text-title-lg lg:text-display-md">{en.steps.heading}</h2>
      <ol className="grid gap-md lg:grid-cols-3">
        {steps.map((label, i) => (
          <li
            key={i}
            className="card flex items-start gap-md"
            style={{ padding: '20px' }}
          >
            <span className="step-chip shrink-0" aria-hidden>
              {i + 1}
            </span>
            <p className="text-body-lg text-text-primary">{label}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
