export type AuthStatus = 'logged_out' | 'logged_in';

// Payout status — EN enum keys per spec §8.2. Mapped to localized UX labels
// in RewardStatusLabel.tsx. AWAITING_PAYOUT means "qualified, waiting for
// operator to push via OKX Internal Transfer" — there is no user-side
// registration step, the linked OKX UID is the destination.
export type UsdtPayoutStatus =
  | 'NOT_REACHED'
  | 'AWAITING_PAYOUT'
  | 'PAID';

export type IcxPayoutStatus =
  | 'NOT_REACHED'
  | 'AWAITING_PAYOUT'
  | 'PAID';

export type DebugViewport = 'auto' | 'mobile-390' | 'tablet-768' | 'desktop-1280';

export type DismissedFlags = {
  welcomeCard?: boolean;
  surveyCompleteSeen?: boolean;
};

export type MockState = {
  // 1. auth
  authStatus: AuthStatus;
  // Supercycl-issued account address, populated on login (hx-prefixed).
  accountAddress: string | null;
  // 2. eligibility — YouthMeta roster + OKX OAuth-linked UID (both system-known).
  // YouthMeta membership gates the event entirely (spec §0/§1) — non-members
  // see a block screen instead of the hub even after Supercycl login.
  isYouthMetaMember: boolean;
  hasOkxLinked: boolean;
  okxUid: string | null;
  // 3. trading
  tradingVolume: number;          // 0..2000
  // 4. slots
  slotsRemaining: number;          // 0..500
  // 5. USDT
  usdtPayoutStatus: UsdtPayoutStatus;
  usdtTxHash: string | null;
  // 6. survey
  surveyCompleted: boolean;
  surveyCompletedAt: string | null;
  isTrader: boolean;
  // 7. ICX
  icxPayoutStatus: IcxPayoutStatus;
  icxTxHash: string | null;
  // 8. time
  simulatedDate: string;           // ISO yyyy-mm-dd
  // 9. dismiss flags
  dismissedFlags: DismissedFlags;
  // 10. viewport (debug only)
  debugViewport: DebugViewport;
};

export type Action =
  | { type: 'SET_AUTH'; status: AuthStatus }
  | { type: 'TOGGLE_OKX' }
  | { type: 'TOGGLE_YOUTH_META' }
  | { type: 'SET_TRADING_VOLUME'; value: number }
  | { type: 'SET_SLOTS_REMAINING'; value: number }
  | { type: 'SET_USDT_PAYOUT_STATUS'; status: UsdtPayoutStatus; txHash?: string | null }
  | { type: 'SET_SURVEY_COMPLETED'; isTrader: boolean; at: string }
  | { type: 'TOGGLE_SURVEY_COMPLETED' }
  | { type: 'TOGGLE_IS_TRADER' }
  | { type: 'SET_ICX_PAYOUT_STATUS'; status: IcxPayoutStatus; txHash?: string | null }
  | { type: 'SET_SIMULATED_DATE'; date: string }
  | { type: 'DISMISS'; key: keyof DismissedFlags }
  | { type: 'RESET_DISMISSED' }
  | { type: 'SET_VIEWPORT'; viewport: DebugViewport }
  | { type: 'RESET_ALL' }
  | { type: 'IMPORT_STATE'; state: MockState };
