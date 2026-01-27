import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, defaultValue: string) => defaultValue,
  }),
}));

// Mock icons
vi.mock('@shared/components/icons', () => ({
  StarIcon: ({ className }: { className?: string }) => (
    <span data-testid="star-icon" className={className}>★</span>
  ),
  TrendingUpIcon: ({ className }: { className?: string }) => (
    <span data-testid="trending-icon" className={className}>↑</span>
  ),
  NewReleasesIcon: ({ className }: { className?: string }) => (
    <span data-testid="new-icon" className={className}>✨</span>
  ),
}));

describe('StatusBadge', () => {
  describe('rendering', () => {
    it('renders nothing when no badges qualify', () => {
      const { container } = render(
        <StatusBadge averageRating={3.0} reviewCount={5} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <StatusBadge
          averageRating={4.8}
          reviewCount={15}
          className="custom-class"
        />
      );
      expect(container.querySelector('.status-badge-container')).toHaveClass('custom-class');
    });
  });

  describe('highly rated badge', () => {
    it('shows highly rated badge when rating >= 4.5 and reviewCount >= 10', () => {
      render(<StatusBadge averageRating={4.5} reviewCount={10} />);

      expect(screen.getByText('Highly Rated')).toBeInTheDocument();
      expect(screen.getByTestId('star-icon')).toBeInTheDocument();
    });

    it('shows highly rated badge for high rating with many reviews', () => {
      render(<StatusBadge averageRating={4.9} reviewCount={100} />);

      expect(screen.getByText('Highly Rated')).toBeInTheDocument();
    });

    it('does not show highly rated badge when rating < 4.5', () => {
      render(<StatusBadge averageRating={4.4} reviewCount={100} />);

      expect(screen.queryByText('Highly Rated')).not.toBeInTheDocument();
    });

    it('does not show highly rated badge when reviewCount < 10', () => {
      render(<StatusBadge averageRating={5.0} reviewCount={9} />);

      expect(screen.queryByText('Highly Rated')).not.toBeInTheDocument();
    });

    it('does not show highly rated badge when rating is undefined', () => {
      render(<StatusBadge reviewCount={100} />);

      expect(screen.queryByText('Highly Rated')).not.toBeInTheDocument();
    });
  });

  describe('popular badge', () => {
    it('shows popular badge when reviewCount >= 50', () => {
      render(<StatusBadge reviewCount={50} />);

      expect(screen.getByText('Popular')).toBeInTheDocument();
      expect(screen.getByTestId('trending-icon')).toBeInTheDocument();
    });

    it('shows popular badge for high review count', () => {
      render(<StatusBadge reviewCount={1000} />);

      expect(screen.getByText('Popular')).toBeInTheDocument();
    });

    it('does not show popular badge when reviewCount < 50', () => {
      render(<StatusBadge reviewCount={49} />);

      expect(screen.queryByText('Popular')).not.toBeInTheDocument();
    });
  });

  describe('new badge', () => {
    it('shows new badge when created within 30 days', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 15);

      render(<StatusBadge createdAt={recentDate} />);

      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByTestId('new-icon')).toBeInTheDocument();
    });

    it('shows new badge for item created today', () => {
      render(<StatusBadge createdAt={new Date()} />);

      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('shows new badge when createdAt is exactly 30 days ago', () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      render(<StatusBadge createdAt={thirtyDaysAgo} />);

      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('does not show new badge when created more than 30 days ago', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31);

      render(<StatusBadge createdAt={oldDate} />);

      expect(screen.queryByText('New')).not.toBeInTheDocument();
    });

    it('handles createdAt as string', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 5);

      render(<StatusBadge createdAt={recentDate.toISOString()} />);

      expect(screen.getByText('New')).toBeInTheDocument();
    });
  });

  describe('multiple badges', () => {
    it('shows both highly rated and popular badges', () => {
      render(<StatusBadge averageRating={4.8} reviewCount={100} />);

      expect(screen.getByText('Highly Rated')).toBeInTheDocument();
      expect(screen.getByText('Popular')).toBeInTheDocument();
    });

    it('shows all three badges when all conditions are met', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 5);

      render(
        <StatusBadge
          averageRating={4.9}
          reviewCount={100}
          createdAt={recentDate}
        />
      );

      expect(screen.getByText('Highly Rated')).toBeInTheDocument();
      expect(screen.getByText('Popular')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('renders badges with correct CSS classes', () => {
      const { container } = render(
        <StatusBadge averageRating={4.9} reviewCount={100} />
      );

      expect(container.querySelector('.status-badge--highly-rated')).toBeInTheDocument();
      expect(container.querySelector('.status-badge--popular')).toBeInTheDocument();
    });
  });
});
