'use client';

import { useMockState, bannerType } from '@/lib/mock-state';
import { TopBanner } from '@/components/banners/TopBanner';
import { Landing } from '@/components/landing/Landing';
import { Hub } from '@/components/hub/Hub';
import { ModalRoot } from '@/components/modals/ModalRoot';

export default function Page() {
  const { state } = useMockState();
  return (
    <>
      <TopBanner variant={bannerType(state)} />
      {state.authStatus === 'logged_out' ? <Landing /> : <Hub />}
      <ModalRoot />
    </>
  );
}
