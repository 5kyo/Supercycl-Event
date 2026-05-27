import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CampaignHeroEnded } from '@/components/hub/CampaignHeroEnded';

describe('CampaignHeroEnded', () => {
  it('renders the festival eyebrow', () => {
    render(<CampaignHeroEnded />);
    expect(screen.getByText('SUPERCYCL MOBILE LAUNCH FESTIVAL')).toBeInTheDocument();
  });
  it('renders the two-line thanks headline', () => {
    render(<CampaignHeroEnded />);
    expect(screen.getByText('Thanks for')).toBeInTheDocument();
    expect(screen.getByText('riding with us.')).toBeInTheDocument();
  });
  it('renders the ended subtitle with the campaign dates', () => {
    render(<CampaignHeroEnded />);
    expect(screen.getByText(/2026\.06\.08.*07\.07.*Ended/)).toBeInTheDocument();
  });
});
