import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../tests/utils/testUtils';
import { Button } from './GenericButton';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies disabled styles when disabled', () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveStyle({ opacity: '0.5', cursor: 'not-allowed' });
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>);

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders icon when provided', () => {
    render(<Button icon={<span data-testid="icon">🎵</span>}>With Icon</Button>);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('🎵')).toBeInTheDocument();
  });

  it('sets correct button type', () => {
    render(<Button type="submit">Submit</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('sets aria-label when provided', () => {
    render(<Button aria-label="Custom label">Button</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Custom label');
  });

  it('calls onMouseEnter when hovered', () => {
    const handleMouseEnter = vi.fn();
    render(<Button onMouseEnter={handleMouseEnter}>Hover me</Button>);

    fireEvent.mouseEnter(screen.getByRole('button'));

    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
  });
});
