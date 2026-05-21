export type AuthStatus = 'logged_out' | 'logged_in';

export type UsdtRegistration =
  | { status: 'none' }
  | { status: 'wallet'; trc20Address: string }
  | { status: 'exchange'; okxUid: string; email: string };

export type UsdtPayoutStatus =
  | '미달성'
  | '수령 정보 미등록'
  | '대기'
  | '보류'
  | '완료'
  | '만료'
  | '슬롯_마감_후_도달';

export type IcxPayoutStatus =
  | '미달성'
  | '수령 정보 미등록'
  | '대기'
  | '보류'
  | '완료'
  | '만료';

export type DebugViewport = 'auto' | 'mobile-390' | 'tablet-768' | 'desktop-1280';

export type DismissedFlags = {
  welcomeCard?: boolean;
  surveyCompleteSeen?: boolean;
};

export type MockState = {
  // 1. auth
  authStatus: AuthStatus;
  // 2. eligibility
  hasOkxLinked: boolean;
  // 3. trading
  tradingVolume: number;          // 0..2000
  reachedAt: string | null;
  // 4. slots (global + user)
  slotsRemaining: number;          // 0..500
  userSlotNumber: number | null;
  // 5. USDT
  usdtRegistration: UsdtRegistration;
  usdtPayoutStatus: UsdtPayoutStatus;
  usdtTxHash: string | null;
  // 6. survey
  surveyCompleted: boolean;
  surveyCompletedAt: string | null;
  isTrader: boolean;
  // 7. ICX
  icxAddress: string | null;
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
  | { type: 'SET_TRADING_VOLUME'; value: number }
  | { type: 'SET_SLOTS_REMAINING'; value: number }
  | { type: 'CLAIM_SLOT'; slotNumber: number; reachedAt: string }
  | { type: 'SET_USDT_REGISTRATION'; registration: UsdtRegistration }
  | { type: 'SET_USDT_PAYOUT_STATUS'; status: UsdtPayoutStatus; txHash?: string | null }
  | { type: 'SET_SURVEY_COMPLETED'; isTrader: boolean; at: string }
  | { type: 'TOGGLE_SURVEY_COMPLETED' }
  | { type: 'TOGGLE_IS_TRADER' }
  | { type: 'SET_ICX_ADDRESS'; address: string | null }
  | { type: 'SET_ICX_PAYOUT_STATUS'; status: IcxPayoutStatus; txHash?: string | null }
  | { type: 'SET_SIMULATED_DATE'; date: string }
  | { type: 'DISMISS'; key: keyof DismissedFlags }
  | { type: 'RESET_DISMISSED' }
  | { type: 'SET_VIEWPORT'; viewport: DebugViewport }
  | { type: 'RESET_ALL' }
  | { type: 'IMPORT_STATE'; state: MockState };
