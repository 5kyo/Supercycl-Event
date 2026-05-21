import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';

describe('RewardStatusLabel', () => {
  it('renders Locked for NOT_REACHED', () => {
    render(<RewardStatusLabel status="NOT_REACHED" />);
    expect(screen.getByText('Locked')).toBeInTheDocument();
  });
  it('renders amber chip for AWAITING_REGISTRATION', () => {
    render(<RewardStatusLabel status="AWAITING_REGISTRATION" />);
    const chip = screen.getByText('Registration required');
    expect(chip).toBeInTheDocument();
    expect(chip.className).toMatch(/amber|yellow/);
  });
  it('renders green chip for PAID', () => {
    render(<RewardStatusLabel status="PAID" />);
    const chip = screen.getByText('Paid');
    expect(chip.className).toMatch(/green/);
  });
  it('renders cap-full state for USDT-only CAP_FULL', () => {
    render(<RewardStatusLabel status="CAP_FULL" />);
    expect(screen.getByText(/slot capacity full/i)).toBeInTheDocument();
  });
});
