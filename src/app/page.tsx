'use client';

import { useState } from 'react';
import { useMockState, bannerType, eventEnded } from '@/lib/mock-state';
import { TopBanner } from '@/components/banners/TopBanner';
import { Hub } from '@/components/hub/Hub';
import { EventClosed } from '@/components/EventClosed';
import { UsdtRegistrationModal } from '@/components/modals/UsdtRegistrationModal';
import { IcxRegistrationModal } from '@/components/modals/IcxRegistrationModal';

export default function Page() {
  const { state } = useMockState();
  const [closedOpen, setClosedOpen] = useState<'usdt' | 'icx' | null>(null);
  const closed = eventEnded(state);

  return (
    <>
      <TopBanner variant={bannerType(state)} />
      <div id="main-content">
        {closed ? (
          <>
            <EventClosed
              onRegisterUsdt={() => setClosedOpen('usdt')}
              onRegisterIcx={() => setClosedOpen('icx')}
            />
            {closedOpen === 'usdt' && (
              <UsdtRegistrationModal onClose={() => setClosedOpen(null)} />
            )}
            {closedOpen === 'icx' && (
              <IcxRegistrationModal onClose={() => setClosedOpen(null)} />
            )}
          </>
        ) : (
          <Hub />
        )}
      </div>
    </>
  );
}
