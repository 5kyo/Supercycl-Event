import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyAccountCard } from '@/components/hub/MyAccountCard';
import * as mockState from '@/lib/mock-state';
import type { MockState } from '@/lib/mock-state';

function mockUseStateWith(overrides: Partial<MockState>) {
  const state: MockState = { ...mockState.initialState, ...overrides };
  vi.spyOn(mockState, 'useMockState').mockReturnValue({
    state,
    dispatch: vi.fn(),
  });
}

describe('MyAccountCard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when logged out', () => {
    mockUseStateWith({ authStatus: 'logged_out' });
    const { container } = render(<MyAccountCard />);
    expect(container.firstChild).toBeNull();
  });

  it('shows the address + a Not connected chip in the UID slot when OKX is not linked', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      accountAddress: mockState.MOCK_ACCOUNT_ADDRESS,
      hasOkxLinked: false,
      okxUid: null,
    });
    render(<MyAccountCard />);
    expect(screen.getByText('My account')).toBeInTheDocument();
    expect(screen.getByText(mockState.MOCK_ACCOUNT_ADDRESS)).toBeInTheDocument();
    expect(screen.getByText('Not connected')).toBeInTheDocument();
    // Hint text removed — chip stands on its own
    expect(screen.queryByText(/Connect in Step 1/)).not.toBeInTheDocument();
  });

  it('shows the full address + full UID when both are present', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      accountAddress: mockState.MOCK_ACCOUNT_ADDRESS,
      hasOkxLinked: true,
      okxUid: mockState.MOCK_OKX_UID,
    });
    render(<MyAccountCard />);
    expect(screen.getByText(mockState.MOCK_ACCOUNT_ADDRESS)).toBeInTheDocument();
    expect(screen.getByText(mockState.MOCK_OKX_UID)).toBeInTheDocument();
    expect(screen.queryByText(/Connect OKX/i)).not.toBeInTheDocument();
  });
});
