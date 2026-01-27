import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InstantBookBadge } from './InstantBookBadge';

// Mock icon
vi.mock('@shared/components/icons', () => ({
  FlashIcon: ({ className, 'aria-hidden': ariaHidden }: { className?: string; 'aria-hidden'?: string }) => (
    <span data-testid="flash-icon" className={className} aria-hidden={ariaHidden}>⚡</span>
  ),
}));

describe('InstantBookBadge', () => {
  describe('rendering', () => {
    it('renders when instantBook is true', () => {
      const { container } = render(<InstantBookBadge instantBook={true} />);

      expect(container.querySelector('.instant-book-badge')).toBeInTheDocument();
    });

    it('does not render when instantBook is false', () => {
      const { container } = render(<InstantBookBadge instantBook={false} />);

      expect(container.querySelector('.instant-book-badge')).not.toBeInTheDocument();
    });

    it('does not render when instantBook is undefined', () => {
      const { container } = render(<InstantBookBadge />);

      expect(container.querySelector('.instant-book-badge')).not.toBeInTheDocument();
    });

    it('renders the flash icon', () => {
      render(<InstantBookBadge instantBook={true} />);

      expect(screen.getByTestId('flash-icon')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <InstantBookBadge instantBook={true} className="custom-class" />
      );

      const badge = container.querySelector('.instant-book-badge');
      expect(badge).toHaveClass('custom-class');
    });

    it('has correct base class', () => {
      const { container } = render(<InstantBookBadge instantBook={true} />);

      expect(container.querySelector('.instant-book-badge')).toBeInTheDocument();
    });

    it('icon has correct class', () => {
      render(<InstantBookBadge instantBook={true} />);

      const icon = screen.getByTestId('flash-icon');
      expect(icon).toHaveClass('instant-book-badge__icon');
    });
  });

  describe('accessibility', () => {
    it('icon is hidden from screen readers', () => {
      render(<InstantBookBadge instantBook={true} />);

      const icon = screen.getByTestId('flash-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('edge cases', () => {
    it('handles empty className gracefully', () => {
      const { container } = render(
        <InstantBookBadge instantBook={true} className="" />
      );

      expect(container.querySelector('.instant-book-badge')).toBeInTheDocument();
    });

    it('handles multiple re-renders', () => {
      const { rerender, container } = render(<InstantBookBadge instantBook={false} />);

      expect(container.querySelector('.instant-book-badge')).not.toBeInTheDocument();

      rerender(<InstantBookBadge instantBook={true} />);
      expect(container.querySelector('.instant-book-badge')).toBeInTheDocument();

      rerender(<InstantBookBadge instantBook={false} />);
      expect(container.querySelector('.instant-book-badge')).not.toBeInTheDocument();
    });
  });
});
