import { describe, it, expect } from 'vitest';
import {
  isQualifiedForUsdt,
  daysUntilEnd,
  daysUntilCutoff,
  bannerType,
  surveyTrackOpen,
  tradingTrackOpen,
  registrationCutoffPassed,
  effectiveIcxPayout,
  tradeRewardClosed,
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

  it('registrationCutoffPassed after 2026-07-21', () => {
    expect(registrationCutoffPassed({ ...initialState, simulatedDate: '2026-07-21' })).toBe(false);
    expect(registrationCutoffPassed({ ...initialState, simulatedDate: '2026-07-22' })).toBe(true);
  });

  it('daysUntilCutoff counts days to 2026-07-21', () => {
    expect(daysUntilCutoff({ ...initialState, simulatedDate: '2026-07-08' })).toBe(13);
    expect(daysUntilCutoff({ ...initialState, simulatedDate: '2026-07-14' })).toBe(7);
    expect(daysUntilCutoff({ ...initialState, simulatedDate: '2026-07-21' })).toBe(0);
    expect(daysUntilCutoff({ ...initialState, simulatedDate: '2026-07-22' })).toBe(-1);
  });

  it('effectiveIcxPayout: 100 for trader, null for non-trader (Open Issue F-5)', () => {
    expect(effectiveIcxPayout({ ...initialState, isTrader: true, surveyCompleted: true }).amount).toBe(100);
    expect(effectiveIcxPayout({ ...initialState, isTrader: false, surveyCompleted: true }).amount).toBe(null);
  });
});
