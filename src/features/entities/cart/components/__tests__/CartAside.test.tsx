import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (_k: string, fallback?: string) => fallback || _k,
      i18n: { language: 'en', dir: () => 'ltr' as const }
    })
  };
});

vi.mock('@core/config/featureFlags', () => ({
  featureFlags: { checkout: true }
}));

vi.mock('../CartItemCard', () => ({
  CartItemCard: () => <div data-testid="cart-item" />
}));

import { CartAside } from '../CartAside';

describe('CartAside', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders open sheet and closes via button', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <CartAside
          isOpen
          onClose={onClose}
          cart={{ items: [{ itemId: '1', bookingDate: '2026-01-01', price: 10, quantity: 2 }] } as never}
        />
      </MemoryRouter>
    );

    const aside = screen.getByLabelText('Your cart');
    expect(aside).toHaveClass('open');
    expect(aside).toHaveAttribute('aria-hidden', 'false');
    fireEvent.click(screen.getByLabelText('Close cart'));
    expect(onClose).toHaveBeenCalled();
  });

  it('stays off-canvas when closed', () => {
    render(
      <MemoryRouter>
        <CartAside isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>
    );
    const aside = screen.getByLabelText('Your cart');
    expect(aside).not.toHaveClass('open');
    expect(aside).toHaveAttribute('aria-hidden', 'true');
  });
});
