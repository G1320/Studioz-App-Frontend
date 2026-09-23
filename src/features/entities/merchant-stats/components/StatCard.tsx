import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@shared/components/icons';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon?: React.ReactNode;
  /** Quiet secondary line under the label (units / context). */
  hint?: string;
  /** Secondary metrics sit quieter in the hierarchy (e.g. forecast). */
  variant?: 'primary' | 'secondary';
  /** Hide trend when the value is not period-comparable (e.g. projection). */
  showTrend?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  isPositive,
  icon,
  hint,
  variant = 'primary',
  showTrend = true
}) => {
  const hasTrend = showTrend && trend !== '—' && trend !== '0%' && trend !== '0';

  return (
    <article className={`stat-card ${variant === 'secondary' ? 'stat-card--secondary' : ''}`}>
      <div className="stat-card__top">
        <div className="stat-card__heading">
          <h3 className="stat-card__label">{title}</h3>
          {hint ? <p className="stat-card__hint">{hint}</p> : null}
        </div>
        {icon ? <span className="stat-card__icon">{icon}</span> : null}
      </div>
      <p className="stat-card__value">{value}</p>
      {hasTrend ? (
        <div
          className={`stat-card__trend ${isPositive ? 'stat-card__trend--positive' : 'stat-card__trend--negative'}`}
        >
          {isPositive ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />}
          <span dir="ltr">{trend}</span>
        </div>
      ) : (
        <div className="stat-card__trend stat-card__trend--neutral">
          <span>{showTrend ? trend : '\u00A0'}</span>
        </div>
      )}
    </article>
  );
};
