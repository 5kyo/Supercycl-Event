import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopBanner } from '@/components/banners/TopBanner';

describe('TopBanner', () => {
  it('renders campaign-running variant', () => {
    render(<TopBanner variant="campaign-running" />);
    expect(screen.getByText(/Supercycl Mobile Launch Event is live/)).toBeInTheDocument();
  });
  it('renders slots-100 variant', () => {
    render(<TopBanner variant="slots-100" />);
    expect(screen.getByText(/100 slots left/)).toBeInTheDocument();
  });
  it('renders slots-50 variant', () => {
    render(<TopBanner variant="slots-50" />);
    expect(screen.getByText(/50 slots left/)).toBeInTheDocument();
  });
  it('renders slots-10 variant with red emphasis', () => {
    const { container } = render(<TopBanner variant="slots-10" />);
    expect(screen.getByText(/10 slots left/)).toBeInTheDocument();
    expect(container.querySelector('.text-red, .bg-red\\/15')).not.toBeNull();
  });
  it('renders d-3 variant', () => {
    render(<TopBanner variant="d-3" />);
    expect(screen.getByText(/3 days until/)).toBeInTheDocument();
  });
  it('renders nothing when variant is null', () => {
    const { container } = render(<TopBanner variant={null} />);
    expect(container.firstChild).toBeNull();
  });
});
