'use client';

import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';

/**
 * Read-only "My account" panel — surfaces the two identifiers a logged-in
 * user can match against their own records: the Supercycl account address
 * (issued at login) and the linked OKX UID (issued at OAuth). Rendered
 * directly under CampaignHero on the Hub. Returns null when logged out so
 * callers don't need to gate.
 */
export function MyAccountCard() {
  const { state } = useMockState();
  if (state.authStatus !== 'logged_in') return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-md">
      <article className="card-elevated flex flex-col gap-md" style={{ padding: '20px' }}>
        <header className="flex items-center gap-1.5">
          <span className="upper-label" style={{ color: 'var(--accent)' }}>
            <span aria-hidden>✦</span> {en.account.heading}
          </span>
        </header>
        <dl className="grid grid-cols-1 gap-sm sm:grid-cols-[auto,1fr] sm:gap-x-lg">
          <dt className="text-body-sm text-text-tertiary">{en.account.addressLabel}</dt>
          <dd
            className="font-mono text-body-sm text-text-primary"
            style={{ wordBreak: 'break-all' }}
          >
            {state.accountAddress ?? '—'}
          </dd>
          <dt className="text-body-sm text-text-tertiary">{en.account.uidLabel}</dt>
          <dd
            className={`font-mono text-body-sm ${state.hasOkxLinked && state.okxUid ? 'text-text-primary' : 'text-text-tertiary italic'}`}
          >
            {state.hasOkxLinked && state.okxUid ? state.okxUid : en.account.uidNotLinked}
          </dd>
        </dl>
      </article>
    </section>
  );
}
