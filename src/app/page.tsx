'use client';

import { useMockState, bannerType, daysUntilEnd, eventEnded } from '@/lib/mock-state';
import { TopBanner } from '@/components/banners/TopBanner';
import { Hub } from '@/components/hub/Hub';
import { EventClosed } from '@/components/EventClosed';

export default function Page() {
  const { state } = useMockState();
  const closed = eventEnded(state);

  return (
    <>
      <TopBanner variant={bannerType(state)} daysLeft={daysUntilEnd(state)} />
      <div id="main-content">{closed ? <EventClosed /> : <Hub />}</div>
    </>
  );
}
