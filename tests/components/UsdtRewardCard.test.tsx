import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UsdtRewardCard } from '@/components/hub/UsdtRewardCard';
import * as mockState from '@/lib/mock-state';
import type { MockState } from '@/lib/mock-state';

function mockStateWith(overrides: Partial<MockState>) {
  const state: MockState = { ...mockState.initialState, ...overrides };
  vi.spyOn(mockState, 'useMockState').mockReturnValue({ state, dispatch: vi.fn() });
}

describe('UsdtRewardCard pool block', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the embedded pool heading + count for signed-in users', () => {
    mockStateWith({ authStatus: 'logged_in', slotsRemaining: 423 });
    render(<UsdtRewardCard />);
    expect(screen.getByText('USDT reward pool')).toBeInTheDocument();
    // 423 slots × 20 USDT = 8,460 USDT remaining out of 10,000.
    expect(screen.getByText(/\/ 10,000 USDT/)).toBeInTheDocument();
  });

  it('hides the pool block when logged out (Sign in to view framing)', () => {
    mockStateWith({ authStatus: 'logged_out' });
    render(<UsdtRewardCard />);
    expect(screen.queryByText('USDT reward pool')).not.toBeInTheDocument();
    expect(screen.getByText(/Sign in to view/i)).toBeInTheDocument();
  });

  it('renders the FULL badge and Closed chip when slotsRemaining === 0', () => {
    mockStateWith({
      authStatus: 'logged_in',
      slotsRemaining: 0,
      usdtPayoutStatus: 'NOT_REACHED',
    });
    render(<UsdtRewardCard />);
    expect(screen.getByText('USDT reward pool')).toBeInTheDocument();
    expect(screen.getByText(/full/i)).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
    expect(
      screen.getByText(/Trade window closed — reward no longer available/i),
    ).toBeInTheDocument();
  });

  it('renders an actionable "Connect OKX" chip when volume is met but OKX is not linked', () => {
    mockStateWith({
      authStatus: 'logged_in',
      hasOkxLinked: false,
      tradingVolume: 500,
      usdtPayoutStatus: 'NOT_REACHED',
    });
    render(<UsdtRewardCard />);
    const chip = screen.getByTestId('usdt-needs-okx-chip');
    expect(chip).toBeInTheDocument();
    expect(chip.tagName).toBe('A');
    expect(chip).toHaveAttribute('href', 'https://supercycl-mobile.vercel.app');
    expect(chip).toHaveAttribute('target', '_blank');
    expect(chip).toHaveTextContent(/Connect OKX to unlock/);
    // Generic "Locked" status must not leak through in this state.
    expect(screen.queryByText(/^Locked$/)).not.toBeInTheDocument();
    // The misleading "Trade $0 more to unlock" copy must not leak through.
    expect(screen.queryByText(/Trade \$0 more to unlock/i)).not.toBeInTheDocument();
  });
});
