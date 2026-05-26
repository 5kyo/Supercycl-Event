import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressTracker } from '@/components/hub/ProgressTracker';
import * as mockState from '@/lib/mock-state';
import type { MockState } from '@/lib/mock-state';

function mockUseStateWith(overrides: Partial<MockState>) {
  const state: MockState = { ...mockState.initialState, ...overrides };
  vi.spyOn(mockState, 'useMockState').mockReturnValue({
    state,
    dispatch: vi.fn(),
  });
}

describe('ProgressTracker — OKX not-connected hint', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders "OKX not connected" beneath step 1 when logged in + !hasOkxLinked', () => {
    mockUseStateWith({ authStatus: 'logged_in', hasOkxLinked: false });
    render(<ProgressTracker />);
    expect(screen.getByText('OKX not connected')).toBeInTheDocument();
  });

  it('hides the OKX hint once hasOkxLinked is true (Done badge already conveys it)', () => {
    mockUseStateWith({ authStatus: 'logged_in', hasOkxLinked: true });
    render(<ProgressTracker />);
    expect(screen.queryByText('OKX not connected')).not.toBeInTheDocument();
  });

  it('hides the OKX hint while logged out (Sign-in placeholder takes precedence)', () => {
    mockUseStateWith({ authStatus: 'logged_out', hasOkxLinked: false });
    render(<ProgressTracker />);
    expect(screen.queryByText('OKX not connected')).not.toBeInTheDocument();
  });
});
