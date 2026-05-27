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

// Volume goal met but Step 1 (OKX OAuth) still pending. Surfaces an
// OKX-first guard rail on the reward card and the volume meter so the user
// isn't misled by "Goal reached!" / "Trade $0 more to unlock" copy when the
// real blocker is the OKX link, not more volume.
export function volumeReachedNoOkx(s: MockState): boolean {
  return s.tradingVolume >= 500 && !s.hasOkxLinked;
}

/** Logged-in user whose account isn't on the YouthMeta roster — entire event blocked. */
export function isBlockedNonYouthMeta(s: MockState): boolean {
  return s.authStatus === 'logged_in' && !s.isYouthMetaMember;
}

export function daysUntilEnd(s: MockState): number {
  return diffDays(CAMPAIGN_END, s.simulatedDate);
}

/**
 * Next weekly USDT payout date (Monday 10:00 KST), returned as YYYY-MM-DD.
 * If the given date is already a Monday, returns that same date — the user
 * is in the operator's current settlement window.
 */
export function nextWeeklyPayoutDate(simulatedDate: string): string {
  const d = new Date(simulatedDate + 'T00:00:00Z');
  const dow = d.getUTCDay(); // 0=Sun … 1=Mon … 6=Sat
  const daysUntilMon = dow === 1 ? 0 : (8 - dow) % 7;
  const next = new Date(d.getTime() + daysUntilMon * 86_400_000);
  return next.toISOString().slice(0, 10);
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
  // Non-trader pool: actual per-user amount lives on `state.nonTraderIcxAmount`.
  // Until operations decides (spec §12 Open Issue #5), it stays null and the UI
  // surfaces a "??" placeholder so the headline shape stays `N ICX` rather than
  // collapsing to a generic "Bonus ICX" string.
  return s.nonTraderIcxAmount !== null
    ? { amount: s.nonTraderIcxAmount }
    : { amount: null, reason: 'TBD (non-trader pool — pending operations decision)' };
}

export type SlotTension = 'none' | 'tension-100' | 'tension-50' | 'tension-10' | 'full';

export function slotTension(s: MockState): SlotTension {
  if (s.slotsRemaining === 0) return 'full';
  if (s.slotsRemaining <= 10) return 'tension-10';
  if (s.slotsRemaining <= 50) return 'tension-50';
  if (s.slotsRemaining <= 100) return 'tension-100';
  return 'none';
}

// Pool-based tension — generalizes `slotTension` for any (remaining, total)
// pair. Thresholds match the slot version proportionally so the visual stages
// line up across USDT (10,000 pool) and ICX (100,000 pool):
//   slot.tension-100 = 100/500 = 20%
//   slot.tension-50  =  50/500 = 10%
//   slot.tension-10  =  10/500 =  2%
export function poolTension(remaining: number, total: number): SlotTension {
  if (remaining <= 0) return 'full';
  const pct = (remaining / total) * 100;
  if (pct <= 2) return 'tension-10';
  if (pct <= 10) return 'tension-50';
  if (pct <= 20) return 'tension-100';
  return 'none';
}

/** Mask a UID like `1234567890` → `12******90` for in-product display. */
export function maskOkxUid(uid: string): string {
  if (uid.length <= 4) return '*'.repeat(uid.length);
  const head = uid.slice(0, 2);
  const tail = uid.slice(-2);
  return `${head}${'*'.repeat(Math.max(2, uid.length - 4))}${tail}`;
}

/**
 * Shorten an ICON-style account address (e.g. `hx` + 40 hex chars) to
 * `hxfedcba98…ba9876` so it fits on one line. Callers should keep the
 * full string in `title=` for hover/copy access.
 */
export function shortenAccountAddress(addr: string): string {
  const HEAD = 10;
  const TAIL = 6;
  if (addr.length <= HEAD + TAIL + 1) return addr;
  return `${addr.slice(0, HEAD)}…${addr.slice(-TAIL)}`;
}
