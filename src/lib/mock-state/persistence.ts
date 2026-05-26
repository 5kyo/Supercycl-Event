import type { MockState, UsdtPayoutStatus, IcxPayoutStatus } from './types';
import { initialState } from './initial';

export const STORAGE_KEY = 'supercycl-event-mock-state';
const KEY = STORAGE_KEY;

// Migrate legacy enum values stored in localStorage to the current EN enum.
// Older builds had KO labels and an AWAITING_REGISTRATION / EXPIRED step that
// went away when in-product address registration was removed. Without the
// mapping, pre-existing users would read back invalid enums and the status
// chip would silently render blank.
const LEGACY_STATUS_MAP: Record<string, string> = {
  // Original KO labels
  '미달성': 'NOT_REACHED',
  '수령 정보 미등록': 'AWAITING_PAYOUT',
  '대기': 'PENDING_PAYOUT',
  '보류': 'ON_HOLD',
  '완료': 'PAID',
  '만료': 'AWAITING_PAYOUT', // EXPIRED retired — surface as payout pending
  '슬롯_마감_후_도달': 'CAP_FULL',
  // Renamed EN enum
  'AWAITING_REGISTRATION': 'AWAITING_PAYOUT',
  'EXPIRED': 'AWAITING_PAYOUT',
};

function migrateStatus<T extends string>(value: unknown, fallback: T): T {
  if (typeof value !== 'string') return fallback;
  const mapped = LEGACY_STATUS_MAP[value];
  return (mapped ?? value) as T;
}

export function loadState(): MockState {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<MockState> & Record<string, unknown>;
    // Defensive strip — legacy keys removed when address registration was
    // dropped. They linger in localStorage from older builds and would
    // otherwise spread back into state via the object spread below.
    delete parsed.usdtRegistration;
    delete parsed.icxAddress;
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
      dismissedFlags: { ...(parsed.dismissedFlags ?? {}) },
    } as MockState;
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
