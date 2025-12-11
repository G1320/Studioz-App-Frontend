import React from 'react';
import './styles/_empty-state.scss';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  hideAction?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  icon = '📅',
  actionLabel,
  onAction,
  hideAction = false,
  className = ''
}) => {
  const hasAction = !hideAction && actionLabel && onAction;

  return (
    <div className={`empty-state ${className}`.trim()}>
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      {subtitle && <p className="empty-state__subtitle">{subtitle}</p>}
      {hasAction && (
        <button className="empty-state__button" onClick={onAction} aria-label={actionLabel}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

