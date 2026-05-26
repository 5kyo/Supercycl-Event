import { describe, it, expect } from 'vitest';
import {
  isQualifiedForUsdt,
  daysUntilEnd,
  bannerType,
  surveyTrackOpen,
  tradingTrackOpen,
  effectiveIcxPayout,
  tradeRewardClosed,
  maskOkxUid,
  hubVariant,
} from '@/lib/mock-state/selectors';
import { initialState } from '@/lib/mock-state/initial';

describe('selectors', () => {
  it('isQualifiedForUsdt: needs $500 + OKX linked', () => {
    expect(isQualifiedForUsdt({ ...initialState, tradingVolume: 500, hasOkxLinked: true })).toBe(true);
    expect(isQualifiedForUsdt({ ...initialState, tradingVolume: 499, hasOkxLinked: true })).toBe(false);
    expect(isQualifiedForUsdt({ ...initialState, tradingVolume: 500, hasOkxLinked: false })).toBe(false);
  });

  it('daysUntilEnd counts days to 2026-07-07', () => {
    expect(daysUntilEnd({ ...initialState, simulatedDate: '2026-07-04' })).toBe(3);
    expect(daysUntilEnd({ ...initialState, simulatedDate: '2026-07-07' })).toBe(0);
    expect(daysUntilEnd({ ...initialState, simulatedDate: '2026-07-08' })).toBe(-1);
  });

  it('bannerType priority: d-3 > slots-10 > slots-50 > slots-100 > campaign-running', () => {
    const base = { ...initialState, simulatedDate: '2026-06-15', slotsRemaining: 500 };
    expect(bannerType(base)).toBe('campaign-running');
    expect(bannerType({ ...base, slotsRemaining: 100 })).toBe('slots-100');
    expect(bannerType({ ...base, slotsRemaining: 50 })).toBe('slots-50');
    expect(bannerType({ ...base, slotsRemaining: 10 })).toBe('slots-10');
    expect(bannerType({ ...base, simulatedDate: '2026-07-04', slotsRemaining: 100 })).toBe('d-3');
  });

  it('bannerType returns null when slotsRemaining is 0 (overrides d-3 and slots-10)', () => {
    const base = { ...initialState, simulatedDate: '2026-06-15', slotsRemaining: 0 };
    expect(bannerType(base)).toBe(null);
    expect(bannerType({ ...base, simulatedDate: '2026-07-04' })).toBe(null);
  });

  it('tradeRewardClosed: true when slots exhausted or past trade-track end', () => {
    expect(tradeRewardClosed({ ...initialState, slotsRemaining: 0 })).toBe(true);
    expect(tradeRewardClosed({ ...initialState, simulatedDate: '2026-06-29', slotsRemaining: 500 })).toBe(true);
    expect(tradeRewardClosed({ ...initialState, simulatedDate: '2026-06-28', slotsRemaining: 500 })).toBe(false);
    expect(tradeRewardClosed({ ...initialState, simulatedDate: '2026-06-08', slotsRemaining: 500 })).toBe(false);
  });

  it('surveyTrackOpen window 2026-06-29..2026-07-05', () => {
    expect(surveyTrackOpen({ ...initialState, simulatedDate: '2026-06-28' })).toBe(false);
    expect(surveyTrackOpen({ ...initialState, simulatedDate: '2026-06-29' })).toBe(true);
    expect(surveyTrackOpen({ ...initialState, simulatedDate: '2026-07-05' })).toBe(true);
    expect(surveyTrackOpen({ ...initialState, simulatedDate: '2026-07-06' })).toBe(false);
  });

  it('tradingTrackOpen window 2026-06-08..2026-06-28', () => {
    expect(tradingTrackOpen({ ...initialState, simulatedDate: '2026-06-07' })).toBe(false);
    expect(tradingTrackOpen({ ...initialState, simulatedDate: '2026-06-08' })).toBe(true);
    expect(tradingTrackOpen({ ...initialState, simulatedDate: '2026-06-28' })).toBe(true);
    expect(tradingTrackOpen({ ...initialState, simulatedDate: '2026-06-29' })).toBe(false);
  });

  it('effectiveIcxPayout: 100 for trader, null for non-trader (Open Issue F-5)', () => {
    expect(effectiveIcxPayout({ ...initialState, isTrader: true, surveyCompleted: true }).amount).toBe(100);
    expect(effectiveIcxPayout({ ...initialState, isTrader: false, surveyCompleted: true }).amount).toBe(null);
  });

  it('hubVariant collapses to completed only when both rewards are PAID', () => {
    expect(hubVariant(initialState)).toBe('default');
    expect(
      hubVariant({ ...initialState, usdtPayoutStatus: 'PAID', icxPayoutStatus: 'PAID' }),
    ).toBe('completed');
    expect(
      hubVariant({ ...initialState, usdtPayoutStatus: 'PAID', icxPayoutStatus: 'PENDING_PAYOUT' }),
    ).toBe('default');
  });

  it('maskOkxUid keeps first/last 2 chars and stars the middle (min 2 stars)', () => {
    expect(maskOkxUid('1234567890')).toBe('12******90');
    // Shorter than 5 chars: fully mask (no leak)
    expect(maskOkxUid('1234')).toBe('****');
    // 5 chars: middle is 1 char, padded up to 2 stars to avoid leaking the
    // full UID via a single-character mask.
    expect(maskOkxUid('12345')).toBe('12**45');
  });
});
