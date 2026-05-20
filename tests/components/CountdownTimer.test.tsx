import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountdownTimer } from '@/components/shared/CountdownTimer';
import { MockStateProvider } from '@/lib/mock-state';

function renderWithProvider(ui: React.ReactNode) {
  return render(<MockStateProvider>{ui}</MockStateProvider>);
}

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-04T00:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders D-29 using default simulatedDate (2026-06-08) to end 2026-07-07', () => {
    // simulatedDate defaults to CAMPAIGN_START = 2026-06-08, so days to 2026-07-07 = 29.
    renderWithProvider(<CountdownTimer endDate="2026-07-07" />);
    expect(screen.getByText(/D-29/)).toBeInTheDocument();
  });
});
