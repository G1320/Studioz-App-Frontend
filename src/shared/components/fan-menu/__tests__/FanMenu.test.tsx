import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FanMenu } from '../FanMenu';

vi.mock('@shared/components', () => ({
  Button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <button type="button" {...props}>{children}</button>
  )
}));

vi.mock('@shared/components/icons', () => ({
  SettingsIcon: () => <span data-testid="settings-icon" />
}));

describe('FanMenu', () => {
  it('opens with aria-expanded and exposes action buttons', () => {
    const onClick = vi.fn();
    render(
      <FanMenu
        buttons={[
          { icon: <span>1</span>, label: 'Edit', onClick },
          { icon: <span>2</span>, label: 'Share', onClick: vi.fn() }
        ]}
      />
    );

    const trigger = screen.getByLabelText('Open menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(document.querySelector('.fan-menu--open')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Edit'));
    expect(onClick).toHaveBeenCalled();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
