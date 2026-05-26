import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EventClosed } from '@/components/EventClosed';

describe('EventClosed', () => {
  it('renders the hero, recap, and open-app CTA', () => {
    render(<EventClosed />);
    expect(screen.getByText(/Thanks for/i)).toBeInTheDocument();
    expect(screen.getByText(/riding with us/i)).toBeInTheDocument();
    expect(screen.getByText('527')).toBeInTheDocument();
    expect(screen.getByText('738')).toBeInTheDocument();
    expect(screen.getByText('$1.2M')).toBeInTheDocument();
    expect(screen.getByText(/Open Supercycl app/i)).toBeInTheDocument();
  });

  it('does not render any reward-claim card (payouts now auto-routed to linked OKX UID)', () => {
    render(<EventClosed />);
    expect(screen.queryByText(/YOUR REWARD IS WAITING/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /register/i })).not.toBeInTheDocument();
  });
});
