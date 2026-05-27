import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UsdtRewardCard } from '@/components/hub/UsdtRewardCard';
import * as mockState from '@/lib/mock-state';
import type { MockState } from '@/lib/mock-state';

function mockStateWith(overrides: Partial<MockState>) {
  const state: MockState = { ...mockState.initialState, ...overrides };
  vi.spyOn(mockState, 'useMockState').mockReturnValue({ state, dispatch: vi.fn() });
}

describe('UsdtRewardCard slot block', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the embedded slot heading + count for signed-in users', () => {
    mockStateWith({ authStatus: 'logged_in', slotsRemaining: 423 });
    render(<UsdtRewardCard />);
    expect(screen.getByText('Trade reward slots')).toBeInTheDocument();
    // SlotTension uses NumberRoller — the rendered count appears as text.
    expect(screen.getByText(/\/ 500/)).toBeInTheDocument();
  });

  it('hides the slot block when logged out (Sign in to view framing)', () => {
    mockStateWith({ authStatus: 'logged_out' });
    render(<UsdtRewardCard />);
    expect(screen.queryByText('Trade reward slots')).not.toBeInTheDocument();
    expect(screen.getByText(/Sign in to view/i)).toBeInTheDocument();
  });

  it('renders the FULL badge and Closed chip when slotsRemaining === 0', () => {
    mockStateWith({
      authStatus: 'logged_in',
      slotsRemaining: 0,
      usdtPayoutStatus: 'NOT_REACHED',
    });
    render(<UsdtRewardCard />);
    expect(screen.getByText('Trade reward slots')).toBeInTheDocument();
    expect(screen.getByText(/full/i)).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
    expect(
      screen.getByText(/Trade window closed — reward no longer available/i),
    ).toBeInTheDocument();
  });

  it('shows "Connect OKX to unlock" when volume is met but OKX is not linked', () => {
    mockStateWith({
      authStatus: 'logged_in',
      hasOkxLinked: false,
      tradingVolume: 500,
      usdtPayoutStatus: 'NOT_REACHED',
    });
    render(<UsdtRewardCard />);
    expect(screen.getByText('Connect OKX to unlock')).toBeInTheDocument();
    // The misleading "Trade $0 more to unlock" copy must not leak through.
    expect(screen.queryByText(/Trade \$0 more to unlock/i)).not.toBeInTheDocument();
  });
});
