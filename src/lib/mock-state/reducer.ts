import type { Action, MockState } from './types';
import { initialState } from './initial';

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function reducer(state: MockState, action: Action): MockState {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, authStatus: action.status };

    case 'TOGGLE_KYC':
      return { ...state, hasKyc: !state.hasKyc };

    case 'TOGGLE_OKX':
      return { ...state, hasOkxLinked: !state.hasOkxLinked };

    case 'SET_TRADING_VOLUME':
      return { ...state, tradingVolume: clamp(action.value, 0, 2000) };

    case 'SET_SLOTS_REMAINING':
      return { ...state, slotsRemaining: clamp(action.value, 0, 500) };

    case 'CLAIM_SLOT':
      return {
        ...state,
        userSlotNumber: action.slotNumber,
        reachedAt: action.reachedAt,
      };

    case 'SET_USDT_REGISTRATION': {
      // Guard: cannot change after payout complete (spec §5.7)
      if (state.usdtPayoutStatus === '완료') return state;
      return { ...state, usdtRegistration: action.registration };
    }

    case 'SET_USDT_PAYOUT_STATUS': {
      // Guard: cannot transition to 완료 without registration
      if (action.status === '완료' && state.usdtRegistration.status === 'none') return state;
      return {
        ...state,
        usdtPayoutStatus: action.status,
        usdtTxHash: action.txHash ?? state.usdtTxHash,
      };
    }

    case 'SET_SURVEY_COMPLETED':
      return {
        ...state,
        surveyCompleted: true,
        surveyCompletedAt: action.at,
        isTrader: action.isTrader,
      };

    case 'SET_ICX_ADDRESS':
      return { ...state, icxAddress: action.address };

    case 'SET_ICX_PAYOUT_STATUS':
      return {
        ...state,
        icxPayoutStatus: action.status,
        icxTxHash: action.txHash ?? state.icxTxHash,
      };

    case 'SET_SIMULATED_DATE':
      return { ...state, simulatedDate: action.date };

    case 'DISMISS':
      return { ...state, dismissedFlags: { ...state.dismissedFlags, [action.key]: true } };

    case 'RESET_DISMISSED':
      return { ...state, dismissedFlags: {} };

    case 'SET_VIEWPORT':
      return { ...state, debugViewport: action.viewport };

    case 'RESET_ALL':
      return initialState;

    case 'IMPORT_STATE':
      return action.state;
  }
}
