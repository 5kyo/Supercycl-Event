'use client';

import { useMockState, daysUntilEnd } from '@/lib/mock-state';

export function HubHeader() {
  const { state } = useMockState();
  const days = daysUntilEnd(state);

  return (
    <header className="px-6 py-lg lg:py-2xl">
      <div className="mx-auto flex max-w-6xl">
        <p className="upper-label text-accent">● LIVE · D-{days}</p>
      </div>
    </header>
  );
}
