import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { YouthMetaGate } from '@/components/hub/YouthMetaGate';

describe('YouthMetaGate', () => {
  it('renders the YouthMeta-only block message + Home CTA', () => {
    render(<YouthMetaGate />);
    expect(screen.getByText('YouthMeta members only')).toBeInTheDocument();
    expect(
      screen.getByText(/This festival is exclusive to YouthMeta members/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Go to Home/i })).toBeInTheDocument();
  });

  it('the Home CTA points at the Supercycl home and opens in a new tab', () => {
    render(<YouthMetaGate />);
    const link = screen.getByRole('link', { name: /Go to Home/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('href', 'https://supercycl-mobile.vercel.app');
  });
});
