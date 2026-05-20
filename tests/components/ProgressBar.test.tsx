import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProgressBar } from '@/components/shared/ProgressBar';

describe('ProgressBar', () => {
  it('renders fill width matching percent', () => {
    const { container } = render(<ProgressBar value={250} max={500} />);
    const fill = container.querySelector('[data-fill]') as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });
  it('clamps to [0, 100]%', () => {
    const { container: c1 } = render(<ProgressBar value={-50} max={500} />);
    expect((c1.querySelector('[data-fill]') as HTMLElement).style.width).toBe('0%');
    const { container: c2 } = render(<ProgressBar value={1000} max={500} />);
    expect((c2.querySelector('[data-fill]') as HTMLElement).style.width).toBe('100%');
  });
  it('attaches event-shimmer class', () => {
    const { container } = render(<ProgressBar value={250} max={500} />);
    expect(container.querySelector('.event-shimmer')).not.toBeNull();
  });
});
