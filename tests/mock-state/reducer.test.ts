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
      usdtPayoutStatus: 'PAID' as const,
    };
    const s = reducer(completed, {
      type: 'SET_USDT_REGISTRATION',
      registration: { status: 'exchange', okxUid: '123456', email: 'a@b.co' },
    });
    expect(s.usdtRegistration).toEqual(completed.usdtRegistration);
  });

  it('guard: USDT payout cannot go to PAID without registration', () => {
    const s = reducer(initialState, { type: 'SET_USDT_PAYOUT_STATUS', status: 'PAID' });
    expect(s.usdtPayoutStatus).toBe(initialState.usdtPayoutStatus);
  });

  it('SET_USDT_PAYOUT_STATUS PAID stores tx hash when registered', () => {
    const registered = {
      ...initialState,
      usdtRegistration: { status: 'wallet' as const, trc20Address: 'T' + 'a'.repeat(33) },
    };
    const s = reducer(registered, { type: 'SET_USDT_PAYOUT_STATUS', status: 'PAID', txHash: '0xabc' });
    expect(s.usdtPayoutStatus).toBe('PAID');
    expect(s.usdtTxHash).toBe('0xabc');
  });

  it('guard: ICX address cannot change after payout complete (spec §4.2)', () => {
    const completed = {
      ...initialState,
      icxAddress: 'hx' + 'a'.repeat(40),
      icxPayoutStatus: 'PAID' as const,
    };
    const s = reducer(completed, { type: 'SET_ICX_ADDRESS', address: 'hx' + 'b'.repeat(40) });
    expect(s.icxAddress).toBe(completed.icxAddress);
  });

  it('guard: ICX payout cannot go to PAID without an address', () => {
    const s = reducer(initialState, { type: 'SET_ICX_PAYOUT_STATUS', status: 'PAID' });
    expect(s.icxPayoutStatus).toBe(initialState.icxPayoutStatus);
  });

  it('SET_ICX_PAYOUT_STATUS PAID stores tx hash when address is registered', () => {
    const registered = { ...initialState, icxAddress: 'hx' + 'a'.repeat(40) };
    const s = reducer(registered, { type: 'SET_ICX_PAYOUT_STATUS', status: 'PAID', txHash: '0xicxtx' });
    expect(s.icxPayoutStatus).toBe('PAID');
    expect(s.icxTxHash).toBe('0xicxtx');
  });

  it('DISMISS flips the named flag', () => {
    const s = reducer(initialState, { type: 'DISMISS', key: 'welcomeCard' });
    expect(s.dismissedFlags.welcomeCard).toBe(true);
  });

  it('RESET_DISMISSED clears all flags', () => {
    const dirty = { ...initialState, dismissedFlags: { welcomeCard: true, surveyCompleteSeen: true } };
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

  // Regression: DebugDrawer's SurveySection used to dispatch SET_SURVEY_COMPLETED
  // for its "Completed" checkbox, which always sets the flag to true and is
  // not reversible. That trapped users — once checked (even accidentally via
  // the "Is trader" checkbox sharing the same action), surveyCompleted stayed
  // true forever, hiding the "Start survey" CTA in IcxRewardCard.
  it('TOGGLE_SURVEY_COMPLETED flips surveyCompleted in both directions', () => {
    const completed = reducer(initialState, { type: 'TOGGLE_SURVEY_COMPLETED' });
    expect(completed.surveyCompleted).toBe(true);
    expect(completed.surveyCompletedAt).toBe(initialState.simulatedDate);

    const back = reducer(completed, { type: 'TOGGLE_SURVEY_COMPLETED' });
    expect(back.surveyCompleted).toBe(false);
    expect(back.surveyCompletedAt).toBeNull();
  });

  it('TOGGLE_IS_TRADER flips isTrader without affecting surveyCompleted', () => {
    const flipped = reducer(initialState, { type: 'TOGGLE_IS_TRADER' });
    expect(flipped.isTrader).toBe(true);
    expect(flipped.surveyCompleted).toBe(initialState.surveyCompleted);

    const back = reducer(flipped, { type: 'TOGGLE_IS_TRADER' });
    expect(back.isTrader).toBe(false);
  });
});
