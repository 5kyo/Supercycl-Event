import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HubCtaBar } from '@/components/hub/HubCtaBar';
import * as mockState from '@/lib/mock-state';
import type { MockState } from '@/lib/mock-state';

/**
 * Reproduces the user-reported bug:
 *   "토글 설정 영역에서 Start Survey 를 체크해도 설문조사 시작 UI 가 보이지 않아"
 *
 * Strategy: mock useMockState to return a fully-controlled state, so we
 * exercise HubCtaBar's gating logic without relying on provider hydration
 * effects (which fire async and can race the synchronous DOM query).
 */
function mockUseStateWith(overrides: Partial<MockState>) {
  const state: MockState = { ...mockState.initialState, ...overrides };
  vi.spyOn(mockState, 'useMockState').mockReturnValue({
    state,
    dispatch: vi.fn(),
  });
}

describe('HubCtaBar — survey CTA visibility', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the "Start survey" button when in survey-track window + not completed', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: mockState.SURVEY_TRACK_START, // 2026-06-29
      surveyCompleted: false,
    });
    render(<HubCtaBar onStartSurvey={() => {}} />);
    expect(screen.queryByText(/Start survey/i)).toBeInTheDocument();
  });

  it('hides "Start survey" before survey-track opens (initial date)', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      // simulatedDate stays at CAMPAIGN_START
    });
    render(<HubCtaBar onStartSurvey={() => {}} />);
    expect(screen.queryByText(/Start survey/i)).not.toBeInTheDocument();
  });

  it('hides "Start survey" when surveyCompleted=true', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: mockState.SURVEY_TRACK_START,
      surveyCompleted: true,
    });
    render(<HubCtaBar onStartSurvey={() => {}} />);
    expect(screen.queryByText(/Start survey/i)).not.toBeInTheDocument();
  });

  it('calls onStartSurvey when survey button is clicked', () => {
    const onStartSurvey = vi.fn();
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: mockState.SURVEY_TRACK_START,
      surveyCompleted: false,
    });
    render(<HubCtaBar onStartSurvey={onStartSurvey} />);
    screen.getByText(/Start survey/i).click();
    expect(onStartSurvey).toHaveBeenCalledTimes(1);
  });

  it('hides bar entirely when both windows closed', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: '2026-08-07', // past survey + past trading
      tradingVolume: 500,
    });
    const { container } = render(<HubCtaBar onStartSurvey={() => {}} />);
    expect(container.querySelector('section')).toBeNull();
  });
});
