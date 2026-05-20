import { describe, it, expect } from 'vitest';
import { reducer } from '@/lib/mock-state/reducer';
import { initialState } from '@/lib/mock-state/initial';

describe('reducer', () => {
  it('SET_AUTH transitions logged_out -> logged_in', () => {
    const s = reducer(initialState, { type: 'SET_AUTH', status: 'logged_in' });
    expect(s.authStatus).toBe('logged_in');
  });

  it('SET_TRADING_VOLUME clamps to [0, 2000]', () => {
    const a = reducer(initialState, { type: 'SET_TRADING_VOLUME', value: -100 });
    expect(a.tradingVolume).toBe(0);
    const b = reducer(initialState, { type: 'SET_TRADING_VOLUME', value: 9999 });
    expect(b.tradingVolume).toBe(2000);
  });

  it('SET_SLOTS_REMAINING clamps to [0, 500]', () => {
    expect(reducer(initialState, { type: 'SET_SLOTS_REMAINING', value: -5 }).slotsRemaining).toBe(0);
    expect(reducer(initialState, { type: 'SET_SLOTS_REMAINING', value: 9999 }).slotsRemaining).toBe(500);
  });

  it('CLAIM_SLOT sets userSlotNumber and reachedAt', () => {
    const s = reducer(initialState, { type: 'CLAIM_SLOT', slotNumber: 237, reachedAt: '2026-06-15' });
    expect(s.userSlotNumber).toBe(237);
    expect(s.reachedAt).toBe('2026-06-15');
  });

  it('guard: USDT registration cannot change after payout complete', () => {
    const completed = {
      ...initialState,
      usdtRegistration: { status: 'wallet' as const, trc20Address: 'T' + 'a'.repeat(33) },
      usdtPayoutStatus: '완료' as const,
    };
    const s = reducer(completed, {
      type: 'SET_USDT_REGISTRATION',
      registration: { status: 'exchange', okxUid: '123456', email: 'a@b.co' },
    });
    expect(s.usdtRegistration).toEqual(completed.usdtRegistration);
  });

  it('guard: USDT payout cannot go to 완료 without registration', () => {
    const s = reducer(initialState, { type: 'SET_USDT_PAYOUT_STATUS', status: '완료' });
    expect(s.usdtPayoutStatus).toBe(initialState.usdtPayoutStatus);
  });

  it('SET_USDT_PAYOUT_STATUS 완료 stores tx hash when registered', () => {
    const registered = {
      ...initialState,
      usdtRegistration: { status: 'wallet' as const, trc20Address: 'T' + 'a'.repeat(33) },
    };
    const s = reducer(registered, { type: 'SET_USDT_PAYOUT_STATUS', status: '완료', txHash: '0xabc' });
    expect(s.usdtPayoutStatus).toBe('완료');
    expect(s.usdtTxHash).toBe('0xabc');
  });

  it('DISMISS flips the named flag', () => {
    const s = reducer(initialState, { type: 'DISMISS', key: 'welcomeCard' });
    expect(s.dismissedFlags.welcomeCard).toBe(true);
  });

  it('RESET_DISMISSED clears all flags', () => {
    const dirty = { ...initialState, dismissedFlags: { welcomeCard: true, npsModal: true } };
    expect(reducer(dirty, { type: 'RESET_DISMISSED' }).dismissedFlags).toEqual({});
  });

  it('RESET_ALL returns initialState', () => {
    const dirty = { ...initialState, tradingVolume: 700 };
    expect(reducer(dirty, { type: 'RESET_ALL' })).toEqual(initialState);
  });

  it('IMPORT_STATE replaces whole state', () => {
    const imported = { ...initialState, tradingVolume: 1234 };
    expect(reducer(initialState, { type: 'IMPORT_STATE', state: imported })).toEqual(imported);
  });
});
