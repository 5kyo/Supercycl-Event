import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';

describe('RewardStatusLabel', () => {
  it('renders Locked for 미달성', () => {
    render(<RewardStatusLabel status="미달성" />);
    expect(screen.getByText('Locked')).toBeInTheDocument();
  });
  it('renders amber chip for 수령 정보 미등록', () => {
    render(<RewardStatusLabel status="수령 정보 미등록" />);
    const chip = screen.getByText('Registration required');
    expect(chip).toBeInTheDocument();
    expect(chip.className).toMatch(/amber|yellow/);
  });
  it('renders green chip for 완료', () => {
    render(<RewardStatusLabel status="완료" />);
    const chip = screen.getByText('Paid');
    expect(chip.className).toMatch(/green/);
  });
  it('renders cap-full state for USDT-only 슬롯_마감_후_도달', () => {
    render(<RewardStatusLabel status="슬롯_마감_후_도달" />);
    expect(screen.getByText(/slot capacity full/i)).toBeInTheDocument();
  });
});
