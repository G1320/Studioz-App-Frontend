import React from 'react';
import { InboxOutlined as InboxIcon } from '@mui/icons-material';
import './styles/_empty-state.scss';

export interface EmptyStateHint {
  label: string;
}

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  hideAction?: boolean;
  hints?: EmptyStateHint[];
  className?: string;
  /** Compact inline empty for tables/panels */
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  hideAction = false,
  hints,
  className = '',
  compact = false
}) => {
  const hasAction = !hideAction && actionLabel && onAction;
  const hasSecondary = Boolean(secondaryActionLabel && onSecondaryAction);
  const resolvedIcon = icon ?? <InboxIcon aria-hidden="true" />;

  return (
    <div
      className={`empty-state ${compact ? 'empty-state--compact' : ''} ${className}`.trim()}
      role="status"
    >
      <div className="empty-state__icon" aria-hidden="true">
        {resolvedIcon}
      </div>
      <h3 className="empty-state__title">{title}</h3>
      {subtitle && <p className="empty-state__subtitle">{subtitle}</p>}
      {hints && hints.length > 0 && (
        <ul className="empty-state__hints">
          {hints.map((hint) => (
            <li key={hint.label}>{hint.label}</li>
          ))}
        </ul>
      )}
      {(hasAction || hasSecondary) && (
        <div className="empty-state__actions">
          {hasAction && (
            <button
              type="button"
              className="empty-state__button"
              onClick={onAction}
              aria-label={actionLabel}
            >
              {actionLabel}
            </button>
          )}
          {hasSecondary && (
            <button
              type="button"
              className="empty-state__button empty-state__button--secondary"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
