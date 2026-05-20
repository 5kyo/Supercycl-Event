import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LiveSlotCounter } from '@/components/shared/LiveSlotCounter';

describe('LiveSlotCounter', () => {
  it('shows X / 500 with no tension class when remaining > 100', () => {
    const { container } = render(<LiveSlotCounter remaining={423} />);
    expect(screen.getByText(/423/)).toBeInTheDocument();
    expect(screen.getByText('/ 500')).toBeInTheDocument();
    expect(container.querySelector('.event-tension-100, .event-tension-50, .event-tension-10')).toBeNull();
  });
  it('applies tension-100 class when remaining <= 100', () => {
    const { container } = render(<LiveSlotCounter remaining={100} />);
    expect(container.querySelector('.event-tension-100')).not.toBeNull();
  });
  it('applies tension-50 class when remaining <= 50', () => {
    const { container } = render(<LiveSlotCounter remaining={50} />);
    expect(container.querySelector('.event-tension-50')).not.toBeNull();
  });
  it('applies tension-10 class when remaining <= 10', () => {
    const { container } = render(<LiveSlotCounter remaining={5} />);
    expect(container.querySelector('.event-tension-10')).not.toBeNull();
  });
});
