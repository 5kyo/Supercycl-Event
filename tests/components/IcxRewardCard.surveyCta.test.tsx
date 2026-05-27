import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IcxRewardCard } from '@/components/hub/IcxRewardCard';
import * as mockState from '@/lib/mock-state';
import type { MockState } from '@/lib/mock-state';

/**
 * The "Start survey" CTA used to live in HubCtaBar; it now sits inside
 * IcxRewardCard next to the reward it unlocks. These tests pin down the same
 * gating rules: visible only inside the survey window and only when the user
 * hasn't completed the survey yet.
 *
 * Strategy: mock useMockState to return a fully-controlled state, so we
 * exercise the gating logic without relying on provider hydration effects.
 */
function mockUseStateWith(overrides: Partial<MockState>) {
  const state: MockState = { ...mockState.initialState, ...overrides };
  vi.spyOn(mockState, 'useMockState').mockReturnValue({
    state,
    dispatch: vi.fn(),
  });
}

const noop = () => {};

describe('IcxRewardCard — survey CTA visibility', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the "Start survey" button when in survey-track window + not completed', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: mockState.SURVEY_TRACK_START, // 2026-06-29
      surveyCompleted: false,
    });
    render(<IcxRewardCard onStartSurvey={noop} />);
    expect(screen.queryByText(/Start survey/i)).toBeInTheDocument();
  });

  it('hides "Start survey" before survey-track opens (initial date)', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      // simulatedDate stays at CAMPAIGN_START
    });
    render(<IcxRewardCard onStartSurvey={noop} />);
    expect(screen.queryByText(/Start survey/i)).not.toBeInTheDocument();
  });

  it('hides "Start survey" when surveyCompleted=true', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: mockState.SURVEY_TRACK_START,
      surveyCompleted: true,
    });
    render(<IcxRewardCard onStartSurvey={noop} />);
    expect(screen.queryByText(/Start survey/i)).not.toBeInTheDocument();
  });

  it('calls onStartSurvey when survey button is clicked', () => {
    const onStartSurvey = vi.fn();
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: mockState.SURVEY_TRACK_START,
      surveyCompleted: false,
    });
    render(<IcxRewardCard onStartSurvey={onStartSurvey} />);
    screen.getByText(/Start survey/i).click();
    expect(onStartSurvey).toHaveBeenCalledTimes(1);
  });

  it('shows the OKX trade link for signed-in users', () => {
    mockUseStateWith({ authStatus: 'logged_in' });
    render(<IcxRewardCard onStartSurvey={noop} />);
    const link = screen.getByRole('link', { name: /Trade ICX on OKX/i });
    expect(link).toHaveAttribute('href', 'https://www.okx.com/trade-spot/icx-usdt');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('hides the OKX trade link when logged out', () => {
    mockUseStateWith({ authStatus: 'logged_out' });
    render(<IcxRewardCard onStartSurvey={noop} />);
    expect(screen.queryByRole('link', { name: /Trade ICX on OKX/i })).not.toBeInTheDocument();
  });

  it('frames pre-survey headline as "Up to 100 ICX" so non-traders see a cap, not a guarantee', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      surveyCompleted: false,
    });
    render(<IcxRewardCard onStartSurvey={noop} />);
    expect(screen.getByText(/Up to 100 ICX \(~\$5 airdrop\)/)).toBeInTheDocument();
  });

  it('annotates the trader amount with ~$5 airdrop but leaves Bonus ICX untouched', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      isTrader: true,
      surveyCompleted: true,
    });
    const { unmount } = render(<IcxRewardCard onStartSurvey={noop} />);
    expect(screen.getByText(/100 ICX \(~\$5 airdrop\)/)).toBeInTheDocument();
    // Post-survey trader sees the confirmed amount without the "Up to" cap.
    expect(screen.queryByText(/Up to 100 ICX/)).not.toBeInTheDocument();
    unmount();
    vi.restoreAllMocks();

    mockUseStateWith({
      authStatus: 'logged_in',
      isTrader: false,
      surveyCompleted: true,
    });
    render(<IcxRewardCard onStartSurvey={noop} />);
    expect(screen.getByText('Bonus ICX')).toBeInTheDocument();
    expect(screen.queryByText(/~\$5 airdrop/)).not.toBeInTheDocument();
  });
});
