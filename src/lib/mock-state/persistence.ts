import type { MockState, UsdtPayoutStatus, IcxPayoutStatus } from './types';
import { initialState } from './initial';

export const STORAGE_KEY = 'supercycl-event-mock-state';
const KEY = STORAGE_KEY;

// Migrate legacy KO enum values stored in localStorage to the EN enum (spec §8.2).
// Pre-existing users whose mock state was saved before the refactor would
// otherwise read back invalid enums and render no status chip.
const KO_TO_EN_STATUS: Record<string, string> = {
  '미달성': 'NOT_REACHED',
  '수령 정보 미등록': 'AWAITING_REGISTRATION',
  '대기': 'PENDING_PAYOUT',
  '보류': 'ON_HOLD',
  '완료': 'PAID',
  '만료': 'EXPIRED',
  '슬롯_마감_후_도달': 'CAP_FULL',
};

function migrateStatus<T extends string>(value: unknown, fallback: T): T {
  if (typeof value !== 'string') return fallback;
  const mapped = KO_TO_EN_STATUS[value];
  return (mapped ?? value) as T;
}

export function loadState(): MockState {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as MockState;
    return {
      ...initialState,
      ...parsed,
      usdtPayoutStatus: migrateStatus<UsdtPayoutStatus>(
        parsed.usdtPayoutStatus,
        initialState.usdtPayoutStatus,
      ),
      icxPayoutStatus: migrateStatus<IcxPayoutStatus>(
        parsed.icxPayoutStatus,
        initialState.icxPayoutStatus,
      ),
      dismissedFlags: { ...parsed.dismissedFlags },
    };
  } catch {
    return initialState;
  }
}

export function saveState(state: MockState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded etc. — silently ignore, state will reset next load
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}
