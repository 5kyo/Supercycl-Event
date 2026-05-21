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
