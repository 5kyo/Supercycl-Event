import type { MockState } from './types';
import {
  CAMPAIGN_END,
  CAMPAIGN_START,
  REGISTRATION_CUTOFF,
  SURVEY_TRACK_END,
  SURVEY_TRACK_START,
  TRADE_TRACK_END,
} from './initial';

export type BannerType = 'campaign-running' | 'slots-100' | 'slots-50' | 'slots-10' | 'd-3' | null;

function diffDays(a: string, b: string): number {
  // Day-resolution diff. a - b in whole days.
  const da = new Date(a + 'T00:00:00Z').getTime();
  const db = new Date(b + 'T00:00:00Z').getTime();
  return Math.round((da - db) / 86_400_000);
}

export function isQualifiedForUsdt(s: MockState): boolean {
  return s.tradingVolume >= 500 && s.hasOkxLinked;
}

export function daysUntilEnd(s: MockState): number {
  return diffDays(CAMPAIGN_END, s.simulatedDate);
}

export function daysUntilCutoff(s: MockState): number {
  return diffDays(REGISTRATION_CUTOFF, s.simulatedDate);
}

export function inCampaignWindow(s: MockState): boolean {
  return s.simulatedDate >= CAMPAIGN_START && s.simulatedDate <= CAMPAIGN_END;
}

export function tradingTrackOpen(s: MockState): boolean {
  return s.simulatedDate >= CAMPAIGN_START && s.simulatedDate <= TRADE_TRACK_END;
}

export function surveyTrackOpen(s: MockState): boolean {
  return s.simulatedDate >= SURVEY_TRACK_START && s.simulatedDate <= SURVEY_TRACK_END;
}

export function registrationCutoffPassed(s: MockState): boolean {
  return s.simulatedDate > REGISTRATION_CUTOFF;
}

export function eventEnded(s: MockState): boolean {
  return s.simulatedDate > CAMPAIGN_END;
}

export type HubVariant = 'default' | 'completed' | 'expired';

/** Pick which Hub layout to render based on user/event state. */
export function hubVariant(s: MockState): HubVariant {
  // Expired: past registration cutoff with at least one unredeemed reward.
  if (registrationCutoffPassed(s)) {
    const hasUnredeemedUsdt =
      isQualifiedForUsdt(s) && s.usdtPayoutStatus !== 'PAID';
    const hasUnredeemedIcx =
      s.surveyCompleted && s.icxPayoutStatus !== 'PAID';
    if (hasUnredeemedUsdt || hasUnredeemedIcx) return 'expired';
  }

  // Completed: both rewards paid.
  if (s.usdtPayoutStatus === 'PAID' && s.icxPayoutStatus === 'PAID') {
    return 'completed';
  }

  // Qualified-but-not-paid no longer routes to a separate "pending" page —
  // UsdtRewardCard drives the registration CTA from within the default layout.
  return 'default';
}

export function bannerType(s: MockState): BannerType {
  if (!inCampaignWindow(s)) return null;
  const d = daysUntilEnd(s);
  if (d <= 3 && d >= 0) return 'd-3';
  if (s.slotsRemaining <= 10) return 'slots-10';
  if (s.slotsRemaining <= 50) return 'slots-50';
  if (s.slotsRemaining <= 100) return 'slots-100';
  return 'campaign-running';
}

export type IcxPayout = { amount: number | null; reason?: string };

export function effectiveIcxPayout(s: MockState): IcxPayout {
  if (!s.surveyCompleted) return { amount: null, reason: 'Survey not completed' };
  if (s.isTrader) return { amount: 100 };
  // Open Issue F-5 — non-trader amount TBD by operations
  return { amount: null, reason: 'TBD (non-trader pool — pending operations decision)' };
}

export type SlotTension = 'none' | 'tension-100' | 'tension-50' | 'tension-10';

export function slotTension(s: MockState): SlotTension {
  if (s.slotsRemaining <= 10) return 'tension-10';
  if (s.slotsRemaining <= 50) return 'tension-50';
  if (s.slotsRemaining <= 100) return 'tension-100';
  return 'none';
}
