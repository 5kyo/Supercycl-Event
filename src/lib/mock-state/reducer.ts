import type { Action, MockState } from './types';
import { initialState, MOCK_OKX_UID } from './initial';

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function reducer(state: MockState, action: Action): MockState {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, authStatus: action.status };

    case 'TOGGLE_OKX': {
      const next = !state.hasOkxLinked;
      return {
        ...state,
        hasOkxLinked: next,
        okxUid: next ? MOCK_OKX_UID : null,
      };
    }

    case 'SET_TRADING_VOLUME':
      return { ...state, tradingVolume: clamp(action.value, 0, 2000) };

    case 'SET_SLOTS_REMAINING':
      return { ...state, slotsRemaining: clamp(action.value, 0, 500) };

    case 'SET_USDT_PAYOUT_STATUS':
      return {
        ...state,
        usdtPayoutStatus: action.status,
        usdtTxHash: action.txHash ?? state.usdtTxHash,
      };

    case 'SET_SURVEY_COMPLETED':
      return {
        ...state,
        surveyCompleted: true,
        surveyCompletedAt: action.at,
        isTrader: action.isTrader,
      };

    case 'TOGGLE_SURVEY_COMPLETED': {
      const next = !state.surveyCompleted;
      return {
        ...state,
        surveyCompleted: next,
        surveyCompletedAt: next ? state.simulatedDate : null,
      };
    }

    case 'TOGGLE_IS_TRADER':
      return { ...state, isTrader: !state.isTrader };

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
