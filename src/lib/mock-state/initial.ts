import type { MockState } from './types';

export const CAMPAIGN_START = '2026-06-08';
export const CAMPAIGN_END = '2026-07-07';
export const SURVEY_TRACK_START = '2026-06-29';
export const SURVEY_TRACK_END = '2026-07-05';
export const TRADE_TRACK_END = '2026-06-28';

// Mock UID surfaced when hasOkxLinked flips on. Real UIDs come from the OAuth
// callback in production; this stand-in keeps the debug drawer one-click.
export const MOCK_OKX_UID = '1234567890';

export const initialState: MockState = {
  authStatus: 'logged_out',
  hasOkxLinked: false,
  okxUid: null,
  tradingVolume: 0,
  slotsRemaining: 500,
  usdtPayoutStatus: 'NOT_REACHED',
  usdtTxHash: null,
  surveyCompleted: false,
  surveyCompletedAt: null,
  isTrader: false,
  icxPayoutStatus: 'NOT_REACHED',
  icxTxHash: null,
  simulatedDate: CAMPAIGN_START,
  dismissedFlags: {},
  debugViewport: 'auto',
};
