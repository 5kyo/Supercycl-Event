import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EventClosed } from '@/components/EventClosed';
import * as mockState from '@/lib/mock-state';
import type { MockState } from '@/lib/mock-state';

function mockUseStateWith(overrides: Partial<MockState>) {
  const state: MockState = { ...mockState.initialState, ...overrides };
  vi.spyOn(mockState, 'useMockState').mockReturnValue({
    state,
    dispatch: vi.fn(),
  });
}

const noop = () => {};

describe('EventClosed', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('always renders the hero and recap (logged out user, after event end)', () => {
    mockUseStateWith({
      authStatus: 'logged_out',
      simulatedDate: '2026-07-08',
    });
    render(<EventClosed onRegisterUsdt={noop} onRegisterIcx={noop} />);
    expect(screen.getByText(/Thanks for/i)).toBeInTheDocument();
    expect(screen.getByText(/riding with us/i)).toBeInTheDocument();
    expect(screen.getByText('527')).toBeInTheDocument();
    expect(screen.getByText('738')).toBeInTheDocument();
    expect(screen.getByText('$1.2M')).toBeInTheDocument();
    expect(screen.getByText(/Open Supercycl app/i)).toBeInTheDocument();
  });

  it('hides the reward card when the user has no unredeemed rewards', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: '2026-07-08',
      tradingVolume: 0,
      surveyCompleted: false,
    });
    render(<EventClosed onRegisterUsdt={noop} onRegisterIcx={noop} />);
    expect(screen.queryByText(/YOUR REWARD IS WAITING/i)).not.toBeInTheDocument();
  });

  it('hides the reward card when the user is logged out (even if state would qualify)', () => {
    mockUseStateWith({
      authStatus: 'logged_out',
      simulatedDate: '2026-07-08',
      tradingVolume: 500,
      hasOkxLinked: true,
      usdtRegistration: { status: 'none' },
    });
    render(<EventClosed onRegisterUsdt={noop} onRegisterIcx={noop} />);
    expect(screen.queryByText(/YOUR REWARD IS WAITING/i)).not.toBeInTheDocument();
  });

  it('shows USDT reward card with countdown when USDT registration is pending and cutoff not passed', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: '2026-07-14', // D-7
      tradingVolume: 500,
      hasOkxLinked: true,
      usdtRegistration: { status: 'none' },
      usdtPayoutStatus: 'AWAITING_REGISTRATION',
    });
    render(<EventClosed onRegisterUsdt={noop} onRegisterIcx={noop} />);
    expect(screen.getByText(/YOUR REWARD IS WAITING/i)).toBeInTheDocument();
    expect(screen.getByText(/20 USDT/i)).toBeInTheDocument();
    expect(screen.getByText(/D-7/i)).toBeInTheDocument();
    expect(screen.getByText(/Jul 21/i)).toBeInTheDocument();
  });

  it('calls onRegisterUsdt when CTA clicked for USDT-priority case', () => {
    const onRegisterUsdt = vi.fn();
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: '2026-07-08',
      tradingVolume: 500,
      hasOkxLinked: true,
      usdtRegistration: { status: 'none' },
      usdtPayoutStatus: 'AWAITING_REGISTRATION',
    });
    render(<EventClosed onRegisterUsdt={onRegisterUsdt} onRegisterIcx={noop} />);
    screen.getByRole('button', { name: /Register wallet/i }).click();
    expect(onRegisterUsdt).toHaveBeenCalledTimes(1);
  });

  it('shows ICX reward card when only ICX needs registration', () => {
    const onRegisterIcx = vi.fn();
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: '2026-07-08',
      surveyCompleted: true,
      isTrader: true,
      icxAddress: null,
      icxPayoutStatus: 'AWAITING_REGISTRATION',
    });
    render(<EventClosed onRegisterUsdt={noop} onRegisterIcx={onRegisterIcx} />);
    expect(screen.getByText(/YOUR REWARD IS WAITING/i)).toBeInTheDocument();
    expect(screen.getByText(/100 ICX/i)).toBeInTheDocument();
    screen.getByRole('button', { name: /Register wallet/i }).click();
    expect(onRegisterIcx).toHaveBeenCalledTimes(1);
  });

  it('prefers USDT over ICX when both need registration', () => {
    const onRegisterUsdt = vi.fn();
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: '2026-07-08',
      tradingVolume: 500,
      hasOkxLinked: true,
      usdtRegistration: { status: 'none' },
      usdtPayoutStatus: 'AWAITING_REGISTRATION',
      surveyCompleted: true,
      isTrader: true,
      icxAddress: null,
      icxPayoutStatus: 'AWAITING_REGISTRATION',
    });
    render(<EventClosed onRegisterUsdt={onRegisterUsdt} onRegisterIcx={vi.fn()} />);
    expect(screen.getByText(/20 USDT/i)).toBeInTheDocument();
    expect(screen.queryByText(/100 ICX/i)).not.toBeInTheDocument();
    screen.getByRole('button', { name: /Register wallet/i }).click();
    expect(onRegisterUsdt).toHaveBeenCalledTimes(1);
  });

  it('hides the reward card after registration cutoff passes (Jul 22)', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: '2026-07-22',
      tradingVolume: 500,
      hasOkxLinked: true,
      usdtRegistration: { status: 'none' },
      usdtPayoutStatus: 'AWAITING_REGISTRATION',
    });
    render(<EventClosed onRegisterUsdt={noop} onRegisterIcx={noop} />);
    expect(screen.queryByText(/YOUR REWARD IS WAITING/i)).not.toBeInTheDocument();
  });

  it('shows D-0 on the cutoff date itself (Jul 21)', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: '2026-07-21',
      tradingVolume: 500,
      hasOkxLinked: true,
      usdtRegistration: { status: 'none' },
      usdtPayoutStatus: 'AWAITING_REGISTRATION',
    });
    render(<EventClosed onRegisterUsdt={noop} onRegisterIcx={noop} />);
    expect(screen.getByText(/D-0/i)).toBeInTheDocument();
  });
});
