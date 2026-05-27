import { describe, it, expect } from 'vitest';
import { reducer } from '@/lib/mock-state/reducer';
import { initialState, MOCK_ACCOUNT_ADDRESS, MOCK_OKX_UID } from '@/lib/mock-state/initial';

describe('reducer', () => {
  it('SET_AUTH transitions logged_out -> logged_in and populates accountAddress', () => {
    const s = reducer(initialState, { type: 'SET_AUTH', status: 'logged_in' });
    expect(s.authStatus).toBe('logged_in');
    expect(s.accountAddress).toBe(MOCK_ACCOUNT_ADDRESS);
  });

  it('SET_AUTH back to logged_out clears accountAddress', () => {
    const loggedIn = reducer(initialState, { type: 'SET_AUTH', status: 'logged_in' });
    const out = reducer(loggedIn, { type: 'SET_AUTH', status: 'logged_out' });
    expect(out.authStatus).toBe('logged_out');
    expect(out.accountAddress).toBeNull();
  });

  it('TOGGLE_OKX populates okxUid when linking, clears it when unlinking', () => {
    const linked = reducer(initialState, { type: 'TOGGLE_OKX' });
    expect(linked.hasOkxLinked).toBe(true);
    expect(linked.okxUid).toBe(MOCK_OKX_UID);

    const unlinked = reducer(linked, { type: 'TOGGLE_OKX' });
    expect(unlinked.hasOkxLinked).toBe(false);
    expect(unlinked.okxUid).toBeNull();
  });

  it('TOGGLE_YOUTH_META flips the membership flag without touching anything else', () => {
    const off = reducer(initialState, { type: 'TOGGLE_YOUTH_META' });
    expect(off.isYouthMetaMember).toBe(false);
    const on = reducer(off, { type: 'TOGGLE_YOUTH_META' });
    expect(on.isYouthMetaMember).toBe(true);
    expect(on.authStatus).toBe(initialState.authStatus);
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

  it('SET_USDT_PAYOUT_STATUS PAID stores tx hash with no prerequisite registration', () => {
    const s = reducer(initialState, { type: 'SET_USDT_PAYOUT_STATUS', status: 'PAID', txHash: '0xabc' });
    expect(s.usdtPayoutStatus).toBe('PAID');
    expect(s.usdtTxHash).toBe('0xabc');
  });

  it('SET_USDT_PAYOUT_STATUS clears tx hash when txHash is explicitly null', () => {
    const paid = reducer(initialState, { type: 'SET_USDT_PAYOUT_STATUS', status: 'PAID', txHash: '0xabc' });
    const reverted = reducer(paid, { type: 'SET_USDT_PAYOUT_STATUS', status: 'NOT_REACHED', txHash: null });
    expect(reverted.usdtPayoutStatus).toBe('NOT_REACHED');
    expect(reverted.usdtTxHash).toBeNull();
  });

  it('SET_USDT_PAYOUT_STATUS preserves tx hash when txHash key is omitted', () => {
    const paid = reducer(initialState, { type: 'SET_USDT_PAYOUT_STATUS', status: 'PAID', txHash: '0xabc' });
    const moved = reducer(paid, { type: 'SET_USDT_PAYOUT_STATUS', status: 'AWAITING_PAYOUT' });
    expect(moved.usdtPayoutStatus).toBe('AWAITING_PAYOUT');
    expect(moved.usdtTxHash).toBe('0xabc');
  });

  it('SET_ICX_PAYOUT_STATUS PAID stores tx hash with no prerequisite registration', () => {
    const s = reducer(initialState, { type: 'SET_ICX_PAYOUT_STATUS', status: 'PAID', txHash: '0xicxtx' });
    expect(s.icxPayoutStatus).toBe('PAID');
    expect(s.icxTxHash).toBe('0xicxtx');
  });

  it('SET_ICX_PAYOUT_STATUS clears tx hash when txHash is explicitly null', () => {
    const paid = reducer(initialState, { type: 'SET_ICX_PAYOUT_STATUS', status: 'PAID', txHash: '0xicxtx' });
    const reverted = reducer(paid, { type: 'SET_ICX_PAYOUT_STATUS', status: 'NOT_REACHED', txHash: null });
    expect(reverted.icxPayoutStatus).toBe('NOT_REACHED');
    expect(reverted.icxTxHash).toBeNull();
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

  it('SET_SURVEY_COMPLETED resets surveyCompleteSeen so the modal opens fresh', () => {
    const stale = {
      ...initialState,
      dismissedFlags: { surveyCompleteSeen: true },
    };
    const next = reducer(stale, {
      type: 'SET_SURVEY_COMPLETED',
      isTrader: true,
      at: '2026-06-30',
    });
    expect(next.surveyCompleted).toBe(true);
    expect(next.dismissedFlags.surveyCompleteSeen).toBe(false);
  });

  it('TOGGLE_SURVEY_COMPLETED → true also resets surveyCompleteSeen', () => {
    const stale = {
      ...initialState,
      dismissedFlags: { surveyCompleteSeen: true },
    };
    const flipped = reducer(stale, { type: 'TOGGLE_SURVEY_COMPLETED' });
    expect(flipped.surveyCompleted).toBe(true);
    expect(flipped.dismissedFlags.surveyCompleteSeen).toBe(false);
    // Flipping back off should leave the seen flag wherever it landed —
    // modal isn't shown when surveyCompleted is false anyway.
    const back = reducer(flipped, { type: 'TOGGLE_SURVEY_COMPLETED' });
    expect(back.surveyCompleted).toBe(false);
    expect(back.dismissedFlags.surveyCompleteSeen).toBe(false);
  });

  it('TOGGLE_IS_TRADER flips isTrader without affecting surveyCompleted', () => {
    const flipped = reducer(initialState, { type: 'TOGGLE_IS_TRADER' });
    expect(flipped.isTrader).toBe(true);
    expect(flipped.surveyCompleted).toBe(initialState.surveyCompleted);

    const back = reducer(flipped, { type: 'TOGGLE_IS_TRADER' });
    expect(back.isTrader).toBe(false);
  });
});
