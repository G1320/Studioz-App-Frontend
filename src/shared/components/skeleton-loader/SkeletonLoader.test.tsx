import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkeletonLoader } from './SkeletonLoader';

describe('SkeletonLoader', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<SkeletonLoader />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('skeleton-loader');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading');
      expect(skeleton).toHaveAttribute('aria-live', 'polite');
    });

    it('renders with custom className', () => {
      render(<SkeletonLoader className="custom-skeleton" />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('skeleton-loader');
      expect(skeleton).toHaveClass('custom-skeleton');
    });
  });

  describe('dimensions', () => {
    it('applies width as string', () => {
      render(<SkeletonLoader width="100%" />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ width: '100%' });
    });

    it('applies width as number (converts to px)', () => {
      render(<SkeletonLoader width={200} />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ width: '200px' });
    });

    it('applies height as string', () => {
      render(<SkeletonLoader height="50rem" />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ height: '50rem' });
    });

    it('applies height as number (converts to px)', () => {
      render(<SkeletonLoader height={100} />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ height: '100px' });
    });

    it('applies both width and height', () => {
      render(<SkeletonLoader width="300px" height="150px" />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ width: '300px', height: '150px' });
    });
  });

  describe('border radius', () => {
    it('applies custom borderRadius', () => {
      render(<SkeletonLoader borderRadius="8px" />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ borderRadius: '8px' });
    });

    it('applies 50% borderRadius when circular is true', () => {
      render(<SkeletonLoader circular />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ borderRadius: '50%' });
    });

    it('circular takes precedence over borderRadius', () => {
      render(<SkeletonLoader borderRadius="8px" circular />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ borderRadius: '50%' });
    });
  });

  describe('custom styles', () => {
    it('applies custom inline styles', () => {
      render(
        <SkeletonLoader
          style={{ margin: '10px', padding: '5px' }}
        />
      );

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ margin: '10px', padding: '5px' });
    });

    it('merges custom styles with dimension styles', () => {
      render(
        <SkeletonLoader
          width="100px"
          height="50px"
          style={{ margin: '5px' }}
        />
      );

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({
        width: '100px',
        height: '50px',
        margin: '5px',
      });
    });
  });

  describe('animation speed', () => {
    it('does not set animation properties when speed is default (1)', () => {
      render(<SkeletonLoader animationSpeed={1} />);

      const skeleton = screen.getByRole('status');
      // Default speed should not add custom animation duration
      expect(skeleton.style.animationDuration).toBe('');
    });

    it('applies custom animation duration when speed > 1', () => {
      render(<SkeletonLoader animationSpeed={2} />);

      const skeleton = screen.getByRole('status');
      expect(skeleton.style.animationDuration).toBe('calc(1.8s / 2)');
    });

    it('applies custom animation duration when speed < 1', () => {
      render(<SkeletonLoader animationSpeed={0.5} />);

      const skeleton = screen.getByRole('status');
      expect(skeleton.style.animationDuration).toBe('calc(1.8s / 0.5)');
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<SkeletonLoader />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading');
      expect(skeleton).toHaveAttribute('aria-live', 'polite');
    });

    it('is findable by role', () => {
      render(<SkeletonLoader />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('common use cases', () => {
    it('renders as avatar placeholder', () => {
      render(<SkeletonLoader width={48} height={48} circular />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({
        width: '48px',
        height: '48px',
        borderRadius: '50%',
      });
    });

    it('renders as text line placeholder', () => {
      render(<SkeletonLoader width="80%" height={16} borderRadius="4px" />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({
        width: '80%',
        height: '16px',
        borderRadius: '4px',
      });
    });

    it('renders as card placeholder', () => {
      render(<SkeletonLoader width="100%" height={200} borderRadius="12px" />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({
        width: '100%',
        height: '200px',
        borderRadius: '12px',
      });
    });
  });
});
