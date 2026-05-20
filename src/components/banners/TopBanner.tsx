import { en } from '@/content/en';
import type { BannerType } from '@/lib/mock-state/selectors';
import { CAMPAIGN_START, CAMPAIGN_END } from '@/lib/mock-state';

type Props = { variant: BannerType };

const colorByVariant: Record<NonNullable<BannerType>, string> = {
  'campaign-running': 'bg-mono-green/10 text-mono-green border-mono-green/30',
  'slots-100':        'bg-amber/15 text-amber border-amber/40',
  'slots-50':         'bg-orange/15 text-orange border-orange/40',
  'slots-10':         'bg-red/15 text-red border-red/40',
  'd-3':              'bg-blue/15 text-blue border-blue/40',
};

function textFor(variant: NonNullable<BannerType>): string {
  switch (variant) {
    case 'campaign-running': return en.banner.campaignRunning(CAMPAIGN_START, CAMPAIGN_END);
    case 'slots-100':        return en.banner.slots100;
    case 'slots-50':         return en.banner.slots50;
    case 'slots-10':         return en.banner.slots10;
    case 'd-3':              return en.banner.d3;
  }
}

export function TopBanner({ variant }: Props) {
  if (!variant) return null;
  return (
    <div className={`border-b px-4 py-3 text-center text-sm ${colorByVariant[variant]}`} role="region" aria-live="polite">
      <div className="mx-auto max-w-6xl">{textFor(variant)}</div>
    </div>
  );
}
