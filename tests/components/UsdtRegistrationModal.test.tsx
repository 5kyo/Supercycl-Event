import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsdtRegistrationModal } from '@/components/modals/UsdtRegistrationModal';
import * as mockState from '@/lib/mock-state';
import type { MockState } from '@/lib/mock-state';

function mockUseStateWith(overrides: Partial<MockState> = {}) {
  const state: MockState = { ...mockState.initialState, ...overrides };
  vi.spyOn(mockState, 'useMockState').mockReturnValue({
    state,
    dispatch: vi.fn(),
  });
}

const noop = () => {};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('UsdtRegistrationModal — title', () => {
  it('renders the shortened title "Receive 20 USDT"', () => {
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    expect(
      screen.getByRole('heading', { name: /^Receive 20 USDT$/i })
    ).toBeInTheDocument();
  });
});

describe('UsdtRegistrationModal — slot chip', () => {
  it('renders the slot chip "Slot #1 / 500 secured"', () => {
    mockUseStateWith({ slotsRemaining: 500 });
    render(<UsdtRegistrationModal onClose={noop} />);
    expect(screen.getByText(/Slot #1 \/ 500 secured/i)).toBeInTheDocument();
  });

  it('does not render the old subtitle or large "20 USDT" amount', () => {
    mockUseStateWith({ slotsRemaining: 500 });
    render(<UsdtRegistrationModal onClose={noop} />);
    expect(screen.queryByText(/Tell us where to send it/i)).not.toBeInTheDocument();
    // The large amount block (standalone "20" + standalone "USDT") is gone.
    expect(screen.queryByText(/^20$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^USDT$/)).not.toBeInTheDocument();
  });
});

describe('UsdtRegistrationModal — method tab labels', () => {
  it('renders short tab labels "TRC20 wallet" and "OKX exchange"', () => {
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    expect(screen.getByRole('radio', { name: 'TRC20 wallet' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'OKX exchange' })).toBeInTheDocument();
  });

  it('does not render the old long tab labels', () => {
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    expect(
      screen.queryByRole('radio', { name: /Receive to TRC20 wallet/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('radio', { name: /Receive to exchange balance/i })
    ).not.toBeInTheDocument();
  });
});

describe('UsdtRegistrationModal — default method', () => {
  it('selects "OKX exchange" by default on open', () => {
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    const exchangeTab = screen.getByRole('radio', { name: 'OKX exchange' });
    const walletTab = screen.getByRole('radio', { name: 'TRC20 wallet' });
    expect(exchangeTab).toHaveAttribute('aria-checked', 'true');
    expect(walletTab).toHaveAttribute('aria-checked', 'false');
  });

  it('shows OKX UID + email fields on initial open (exchange flow visible)', () => {
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    expect(screen.getByText('OKX UID')).toBeInTheDocument();
    expect(screen.getByText('OKX registered email')).toBeInTheDocument();
    expect(screen.queryByText(/TRC20 USDT wallet address/i)).not.toBeInTheDocument();
  });
});

describe('UsdtRegistrationModal — TRC20 warning consolidation', () => {
  async function openWalletTab() {
    const user = userEvent.setup();
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    await user.click(screen.getByRole('radio', { name: 'TRC20 wallet' }));
    return user;
  }

  it('removes the long orange warning sentence', async () => {
    await openWalletTab();
    expect(
      screen.queryByText(/Sending to a non-TRC20 network may result in loss of funds/i)
    ).not.toBeInTheDocument();
  });

  it('renders the short network checkbox label', async () => {
    await openWalletTab();
    expect(
      screen.getByText('I confirmed this is a TRC20 address')
    ).toBeInTheDocument();
  });

  it('renders the small inline warning helper "Wrong network = lost funds"', async () => {
    await openWalletTab();
    expect(screen.getByText(/Wrong network = lost funds/i)).toBeInTheDocument();
  });
});

describe('UsdtRegistrationModal — exchange flow cleanup', () => {
  it('does not render the "Exchange: OKX" subtitle', () => {
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    expect(screen.queryByText(/^Exchange: OKX$/)).not.toBeInTheDocument();
  });
});

describe('UsdtRegistrationModal — terms checkbox removed (per spec §0.0)', () => {
  it('does not render the terms agreement checkbox or View terms link', () => {
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    expect(
      screen.queryByText(/I agree to the event terms and privacy policy/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /View terms/i })).not.toBeInTheDocument();
  });
});
