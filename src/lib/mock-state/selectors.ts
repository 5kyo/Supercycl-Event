import type { MockState } from './types';
import {
  CAMPAIGN_END,
  CAMPAIGN_START,
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

/** Logged-in user whose account isn't on the YouthMeta roster — entire event blocked. */
export function isBlockedNonYouthMeta(s: MockState): boolean {
  return s.authStatus === 'logged_in' && !s.isYouthMetaMember;
}

export function daysUntilEnd(s: MockState): number {
  return diffDays(CAMPAIGN_END, s.simulatedDate);
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

export function eventEnded(s: MockState): boolean {
  return s.simulatedDate > CAMPAIGN_END;
}

export type HubVariant = 'default' | 'completed';

/** Pick which Hub layout to render based on user/event state. */
export function hubVariant(s: MockState): HubVariant {
  if (s.usdtPayoutStatus === 'PAID' && s.icxPayoutStatus === 'PAID') {
    return 'completed';
  }
  return 'default';
}

export function bannerType(s: MockState): BannerType {
  if (!inCampaignWindow(s)) return null;
  // Slots exhausted: the trade reward is no longer reachable. The reward card
  // surfaces its own "Closed" treatment, so the top banner steps aside.
  if (s.slotsRemaining === 0) return null;
  const d = daysUntilEnd(s);
  if (d <= 3 && d >= 0) return 'd-3';
  if (s.slotsRemaining <= 10) return 'slots-10';
  if (s.slotsRemaining <= 50) return 'slots-50';
  if (s.slotsRemaining <= 100) return 'slots-100';
  return 'campaign-running';
}

/** Trade reward is unreachable: slot capacity exhausted OR trade track date past. */
export function tradeRewardClosed(s: MockState): boolean {
  return s.slotsRemaining === 0 || s.simulatedDate > TRADE_TRACK_END;
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

/** Mask a UID like `1234567890` → `12******90` for in-product display. */
export function maskOkxUid(uid: string): string {
  if (uid.length <= 4) return '*'.repeat(uid.length);
  const head = uid.slice(0, 2);
  const tail = uid.slice(-2);
  return `${head}${'*'.repeat(Math.max(2, uid.length - 4))}${tail}`;
}
