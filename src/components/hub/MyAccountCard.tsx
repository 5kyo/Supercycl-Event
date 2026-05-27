'use client';

import { en } from '@/content/en';
import { useMockState, shortenAccountAddress } from '@/lib/mock-state';

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
            title={state.accountAddress ?? undefined}
            data-testid="account-address"
          >
            {state.accountAddress ? shortenAccountAddress(state.accountAddress) : '—'}
          </dd>
          <dt className="text-body-sm text-text-tertiary">{en.account.uidLabel}</dt>
          <dd className="text-body-sm">
            {state.hasOkxLinked && state.okxUid ? (
              <span className="font-mono text-text-primary">{state.okxUid}</span>
            ) : (
              <span className="inline-flex flex-wrap items-center gap-sm">
                <span
                  className="inline-flex items-center rounded-full border border-amber/40 bg-amber/15 px-2 py-0.5 text-label-sm text-amber"
                  data-testid="okx-not-connected"
                >
                  {en.account.okxNotConnected}
                </span>
                {/* OAuth lives on the mobile PWA; on PC the link sends users
                    to a flow they can't complete on the same device. Hide it
                    at lg+ so PC users only see the "Not connected" status,
                    and they finish the connect step on mobile separately. */}
                <a
                  href="https://supercycl-mobile.vercel.app"
                  className="text-label-sm text-accent underline-offset-2 hover:underline lg:hidden"
                  data-testid="okx-connect-cta"
                >
                  {en.account.okxConnectCta} →
                </a>
              </span>
            )}
          </dd>
        </dl>
      </article>
    </section>
  );
}
