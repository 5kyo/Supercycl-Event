'use client';

import { useMockState, bannerType, daysUntilEnd } from '@/lib/mock-state';
import { TopBanner } from '@/components/banners/TopBanner';
import { Hub } from '@/components/hub/Hub';

export default function Page() {
  const { state } = useMockState();

  return (
    <>
      <TopBanner variant={bannerType(state)} daysLeft={daysUntilEnd(state)} />
      <div id="main-content"><Hub /></div>
    </>
  );
}
