import type { MockState } from './types';

export const CAMPAIGN_START = '2026-06-08';
export const CAMPAIGN_END = '2026-07-07';
export const SURVEY_TRACK_START = '2026-06-29';
export const SURVEY_TRACK_END = '2026-07-05';
export const TRADE_TRACK_END = '2026-06-28';
export const REGISTRATION_CUTOFF = '2026-07-21';

export const initialState: MockState = {
  authStatus: 'logged_out',
  hasOkxLinked: false,
  tradingVolume: 0,
  reachedAt: null,
  slotsRemaining: 500,
  userSlotNumber: null,
  usdtRegistration: { status: 'none' },
  usdtPayoutStatus: 'NOT_REACHED',
  usdtTxHash: null,
  surveyCompleted: false,
  surveyCompletedAt: null,
  isTrader: false,
  icxAddress: null,
  icxPayoutStatus: 'NOT_REACHED',
  icxTxHash: null,
  simulatedDate: CAMPAIGN_START,
  dismissedFlags: {},
  debugViewport: 'auto',
};
