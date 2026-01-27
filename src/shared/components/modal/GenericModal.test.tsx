import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenericModal } from './GenericModal';

// Mock MUI Modal to simplify testing
vi.mock('@mui/material', () => ({
  Modal: ({
    open,
    onClose,
    children,
    className,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
  }: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-label'?: string;
  }) =>
    open ? (
      <div
        data-testid="modal"
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
      >
        <div data-testid="backdrop" onClick={onClose} />
        {children}
      </div>
    ) : null,
}));

describe('GenericModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up body styles
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
  });

  describe('rendering', () => {
    it('renders children when open', () => {
      render(
        <GenericModal open={true} onClose={mockOnClose}>
          <p>Modal content</p>
        </GenericModal>
      );

      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      render(
        <GenericModal open={false} onClose={mockOnClose}>
          <p>Modal content</p>
        </GenericModal>
      );

      expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <GenericModal open={true} onClose={mockOnClose} className="custom-modal">
          <p>Content</p>
        </GenericModal>
      );

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveClass('generic-modal');
      expect(modal).toHaveClass('custom-modal');
    });

    it('renders modal wrapper and content divs', () => {
      render(
        <GenericModal open={true} onClose={mockOnClose}>
          <p>Content</p>
        </GenericModal>
      );

      expect(screen.getByText('Content').closest('.modal-content')).toBeInTheDocument();
    });
  });

  describe('onClose callback', () => {
    it('calls onClose when backdrop is clicked', () => {
      render(
        <GenericModal open={true} onClose={mockOnClose}>
          <p>Content</p>
        </GenericModal>
      );

      fireEvent.click(screen.getByTestId('backdrop'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('has dialog role', () => {
      render(
        <GenericModal open={true} onClose={mockOnClose}>
          <p>Content</p>
        </GenericModal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal set to true', () => {
      render(
        <GenericModal open={true} onClose={mockOnClose}>
          <p>Content</p>
        </GenericModal>
      );

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('uses provided titleId for aria-labelledby', () => {
      render(
        <GenericModal open={true} onClose={mockOnClose} titleId="my-title">
          <h2 id="my-title">Modal Title</h2>
          <p>Content</p>
        </GenericModal>
      );

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'my-title');
    });

    it('uses provided descriptionId for aria-describedby', () => {
      render(
        <GenericModal
          open={true}
          onClose={mockOnClose}
          descriptionId="my-desc"
        >
          <p id="my-desc">Description</p>
        </GenericModal>
      );

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-describedby', 'my-desc');
    });

    it('uses ariaLabel when provided', () => {
      render(
        <GenericModal open={true} onClose={mockOnClose} ariaLabel="Settings dialog">
          <p>Content</p>
        </GenericModal>
      );

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Settings dialog');
    });
  });

  describe('body scroll locking', () => {
    it('locks body scroll when modal opens', () => {
      render(
        <GenericModal open={true} onClose={mockOnClose}>
          <p>Content</p>
        </GenericModal>
      );

      expect(document.body.style.position).toBe('fixed');
      expect(document.body.style.width).toBe('100%');
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('unlocks body scroll when modal closes', () => {
      const { rerender } = render(
        <GenericModal open={true} onClose={mockOnClose}>
          <p>Content</p>
        </GenericModal>
      );

      // Verify locked
      expect(document.body.style.position).toBe('fixed');

      // Close modal
      rerender(
        <GenericModal open={false} onClose={mockOnClose}>
          <p>Content</p>
        </GenericModal>
      );

      // Verify unlocked
      expect(document.body.style.position).toBe('');
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('children content', () => {
    it('renders complex children correctly', () => {
      render(
        <GenericModal open={true} onClose={mockOnClose}>
          <div>
            <h1>Title</h1>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
            <button>Action</button>
          </div>
        </GenericModal>
      );

      expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('renders form content', () => {
      render(
        <GenericModal open={true} onClose={mockOnClose}>
          <form>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" />
            <button type="submit">Submit</button>
          </form>
        </GenericModal>
      );

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });
  });
});
