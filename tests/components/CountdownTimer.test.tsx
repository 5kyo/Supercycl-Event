import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountdownTimer } from '@/components/shared/CountdownTimer';

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-04T00:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders D-3 when 3 days remain', () => {
    render(<CountdownTimer endDate="2026-07-07" />);
    expect(screen.getByText(/D-3/)).toBeInTheDocument();
  });
  it('renders D-0 on the last day', () => {
    vi.setSystemTime(new Date('2026-07-07T00:00:00Z'));
    render(<CountdownTimer endDate="2026-07-07" />);
    expect(screen.getByText(/D-0/)).toBeInTheDocument();
  });
});
