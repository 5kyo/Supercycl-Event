export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-4 text-3xl font-bold">Event Privacy Policy (placeholder)</h1>
      <p className="mb-4 text-muted">This is a placeholder. Replace with the legal team&apos;s finalized privacy policy before launch.</p>
      <h2 className="mt-6 mb-2 text-xl font-semibold">Data collected</h2>
      <ul className="list-inside list-disc text-muted">
        <li>Registered TRC20 address or OKX UID/email for reward payout.</li>
        <li>ICON wallet address for ICX payout.</li>
      </ul>
      <h2 className="mt-6 mb-2 text-xl font-semibold">Retention</h2>
      <p className="text-muted">Retained for the duration of the campaign + 30 days for payout administration.</p>
    </main>
  );
}
