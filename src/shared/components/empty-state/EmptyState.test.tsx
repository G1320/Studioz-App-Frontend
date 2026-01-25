import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../tests/utils/testUtils';
import { EmptyState } from './EmptyState';

describe('EmptyState Component', () => {
  it('renders title correctly', () => {
    render(<EmptyState title="No items found" />);

    expect(screen.getByRole('heading')).toHaveTextContent('No items found');
  });

  it('renders subtitle when provided', () => {
    render(<EmptyState title="Empty" subtitle="Try adding some items" />);

    expect(screen.getByText('Try adding some items')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<EmptyState title="Empty" />);

    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('renders default icon when not provided', () => {
    render(<EmptyState title="Empty" />);

    expect(screen.getByText('📅')).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    render(<EmptyState title="Empty" icon="🎵" />);

    expect(screen.getByText('🎵')).toBeInTheDocument();
  });

  it('renders action button when actionLabel and onAction are provided', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="Empty"
        actionLabel="Add Item"
        onAction={handleAction}
      />
    );

    expect(screen.getByRole('button')).toHaveTextContent('Add Item');
  });

  it('calls onAction when button is clicked', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="Empty"
        actionLabel="Add Item"
        onAction={handleAction}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('does not render button when hideAction is true', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="Empty"
        actionLabel="Add Item"
        onAction={handleAction}
        hideAction
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not render button when actionLabel is missing', () => {
    const handleAction = vi.fn();
    render(<EmptyState title="Empty" onAction={handleAction} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<EmptyState title="Empty" className="custom-empty" />);

    const container = screen.getByRole('heading').parentElement;
    expect(container).toHaveClass('custom-empty');
  });

  it('sets aria-label on action button', () => {
    render(
      <EmptyState
        title="Empty"
        actionLabel="Add New Item"
        onAction={() => {}}
      />
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Add New Item');
  });
});
