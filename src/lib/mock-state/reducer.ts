import type { Action, MockState } from './types';
import { initialState, MOCK_ACCOUNT_ADDRESS, MOCK_OKX_UID } from './initial';

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function reducer(state: MockState, action: Action): MockState {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        authStatus: action.status,
        accountAddress: action.status === 'logged_in' ? MOCK_ACCOUNT_ADDRESS : null,
      };

    case 'TOGGLE_OKX': {
      const next = !state.hasOkxLinked;
      return {
        ...state,
        hasOkxLinked: next,
        okxUid: next ? MOCK_OKX_UID : null,
      };
    }

    case 'TOGGLE_YOUTH_META':
      return { ...state, isYouthMetaMember: !state.isYouthMetaMember };

    case 'SET_TRADING_VOLUME':
      return { ...state, tradingVolume: clamp(action.value, 0, 2000) };

    case 'SET_SLOTS_REMAINING':
      return { ...state, slotsRemaining: clamp(action.value, 0, 500) };

    case 'SET_USDT_PAYOUT_STATUS':
      return {
        ...state,
        usdtPayoutStatus: action.status,
        // `undefined` preserves the prior hash; explicit `null` clears it.
        // `??` collapsed both, so flipping PAID→NOT_REACHED left a stale hash.
        usdtTxHash: 'txHash' in action ? action.txHash ?? null : state.usdtTxHash,
      };

    case 'SET_SURVEY_COMPLETED':
      // Reset surveyCompleteSeen so the completion modal opens fresh on every
      // submission — Hub's effect gates on this flag and would otherwise stay
      // silent for a user who dismissed the modal in an earlier session.
      return {
        ...state,
        surveyCompleted: true,
        surveyCompletedAt: action.at,
        isTrader: action.isTrader,
        dismissedFlags: { ...state.dismissedFlags, surveyCompleteSeen: false },
      };

    case 'TOGGLE_SURVEY_COMPLETED': {
      const next = !state.surveyCompleted;
      return {
        ...state,
        surveyCompleted: next,
        surveyCompletedAt: next ? state.simulatedDate : null,
        // When flipping to true (debug drawer), mirror SET_SURVEY_COMPLETED
        // and reset the seen flag so the completion modal re-fires. Flipping
        // to false leaves the flag alone — the modal isn't shown anyway.
        dismissedFlags: next
          ? { ...state.dismissedFlags, surveyCompleteSeen: false }
          : state.dismissedFlags,
      };
    }

    case 'TOGGLE_IS_TRADER':
      return { ...state, isTrader: !state.isTrader };

    case 'SET_ICX_PAYOUT_STATUS':
      return {
        ...state,
        icxPayoutStatus: action.status,
        icxTxHash: 'txHash' in action ? action.txHash ?? null : state.icxTxHash,
      };

    case 'SET_NON_TRADER_ICX_AMOUNT':
      return {
        ...state,
        nonTraderIcxAmount:
          action.value === null
            ? null
            : Math.max(0, Math.round(action.value)),
      };

    case 'SET_ICX_CONSUMED':
      return { ...state, icxConsumed: clamp(Math.round(action.value), 0, 100_000) };

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

    default: {
      // Exhaustiveness check — if a new Action variant is added without a
      // matching case above, `action` won't narrow to `never` here and TS
      // will flag the gap at compile time.
      const _exhaustive: never = action;
      void _exhaustive;
      return state;
    }
  }
}
