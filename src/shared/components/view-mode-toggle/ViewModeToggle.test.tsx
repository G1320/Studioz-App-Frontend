import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../tests/utils/testUtils';
import { ViewModeToggle } from './ViewModeToggle';

describe('ViewModeToggle', () => {
  it('marks the active view and changes modes', () => {
    const onChange = vi.fn();
    render(
      <ViewModeToggle value="grid" onChange={onChange} label="Layout" gridLabel="Grid view" listLabel="List view" />
    );

    expect(screen.getByRole('button', { name: 'Grid view' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'List view' })).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'List view' }));
    expect(onChange).toHaveBeenCalledWith('list');
  });
});
