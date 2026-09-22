import { LayoutGrid, List } from 'lucide-react';
import './styles/_view-mode-toggle.scss';

export type ViewMode = 'grid' | 'list';

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  label: string;
  gridLabel: string;
  listLabel: string;
  className?: string;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  value,
  onChange,
  label,
  gridLabel,
  listLabel,
  className = ''
}) => (
  <div className={`view-mode-toggle ${className}`} role="group" aria-label={label}>
    <button
      type="button"
      className={`view-mode-toggle__button${value === 'grid' ? ' view-mode-toggle__button--active' : ''}`}
      onClick={() => onChange('grid')}
      aria-label={gridLabel}
      aria-pressed={value === 'grid'}
      title={gridLabel}
    >
      <LayoutGrid aria-hidden="true" />
    </button>
    <button
      type="button"
      className={`view-mode-toggle__button${value === 'list' ? ' view-mode-toggle__button--active' : ''}`}
      onClick={() => onChange('list')}
      aria-label={listLabel}
      aria-pressed={value === 'list'}
      title={listLabel}
    >
      <List aria-hidden="true" />
    </button>
  </div>
);
