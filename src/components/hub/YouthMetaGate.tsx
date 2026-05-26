import { en } from '@/content/en';

export function YouthMetaGate() {
  const copy = en.hub.youthMetaGate;

  return (
    <section
      aria-labelledby="youthmeta-gate-title"
      className="mx-auto max-w-3xl px-6 py-lg"
    >
      <article
        className="card-elevated flex flex-col items-center gap-md text-center"
        style={{ padding: '32px 24px' }}
      >
        <div
          aria-hidden
          className="inline-flex items-center justify-center"
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border-subtle)',
            fontSize: 26,
          }}
        >
          🔒
        </div>
        <h2 id="youthmeta-gate-title" className="text-title-lg font-bold">
          {copy.title}
        </h2>
        <p className="text-body-md text-text-secondary" style={{ maxWidth: 420 }}>
          {copy.description}
        </p>
        <div className="mt-md flex w-full flex-col items-stretch gap-sm sm:max-w-xs">
          <a
            href="https://supercycl-mobile.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            {copy.homeCta} →
          </a>
        </div>
      </article>
    </section>
  );
}
