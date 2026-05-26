import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { YouthMetaGate } from '@/components/hub/YouthMetaGate';
import * as mockState from '@/lib/mock-state';
import type { MockState } from '@/lib/mock-state';

function mockUseStateWith(overrides: Partial<MockState>, dispatch = vi.fn()) {
  const state: MockState = { ...mockState.initialState, ...overrides };
  vi.spyOn(mockState, 'useMockState').mockReturnValue({ state, dispatch });
  return dispatch;
}

describe('YouthMetaGate', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the YouthMeta-only block message + both CTAs', () => {
    mockUseStateWith({ authStatus: 'logged_in', isYouthMetaMember: false });
    render(<YouthMetaGate />);
    expect(screen.getByText('YouthMeta members only')).toBeInTheDocument();
    expect(
      screen.getByText(/This festival is exclusive to YouthMeta members/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Become a YouthMeta member/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign out/i })).toBeInTheDocument();
  });

  it('the join CTA points at the configured external URL and opens in a new tab', () => {
    mockUseStateWith({ authStatus: 'logged_in', isYouthMetaMember: false });
    render(<YouthMetaGate />);
    const link = screen.getByRole('link', { name: /Become a YouthMeta member/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    // Either the configured env URL or the fallback — both are valid here.
    expect(link.getAttribute('href')).toMatch(/^https?:\/\//);
  });

  it('Sign out dispatches SET_AUTH to logged_out', () => {
    const dispatch = mockUseStateWith({
      authStatus: 'logged_in',
      isYouthMetaMember: false,
    });
    render(<YouthMetaGate />);
    fireEvent.click(screen.getByRole('button', { name: /Sign out/i }));
    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_AUTH', status: 'logged_out' });
  });
});
