import React from 'react';
import { useTranslation } from 'react-i18next';

interface QuickStatsProps {
  occupancy?: number;
  studios?: { name: string; occupancy: number }[];
  avgSessionTime?: number;
  confirmedUpcoming?: number;
  formatCurrency?: (amount: number) => string;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  occupancy = 0,
  studios = [],
  avgSessionTime = 0,
  confirmedUpcoming = 0,
  formatCurrency
}) => {
  const { t } = useTranslation('merchantStats');
  const displayStudios = studios.slice(0, 4);

  return (
    <div className="quick-stats quick-stats--side">
      <div className="quick-stat-card quick-stat-card--ops">
        <div className="quick-stat-card__kpi-row">
          <div className="quick-stat-card__kpi">
            <span className="quick-stat-card__kpi-label">{t('quickStats.occupancy', 'Studio Occupancy')}</span>
            <span className="quick-stat-card__kpi-hint">{t('quickStats.occupancyHint', 'Booked ÷ available hours')}</span>
            <span className="quick-stat-card__kpi-value">
              {occupancy}%
              {occupancy > 50 && (
                <span className="quick-stat-card__kpi-badge">{t('quickStats.aboveAverage', 'Above avg')}</span>
              )}
            </span>
          </div>
          <div className="quick-stat-card__kpi">
            <span className="quick-stat-card__kpi-label">{t('quickStats.avgSession', 'Avg Session')}</span>
            <span className="quick-stat-card__kpi-hint">{t('quickStats.avgSessionHint', 'Mean booking length')}</span>
            <span className="quick-stat-card__kpi-value">
              {avgSessionTime}
              <span className="quick-stat-card__kpi-unit">{t('quickStats.hours', 'hrs')}</span>
            </span>
          </div>
          {formatCurrency && (
            <div className="quick-stat-card__kpi">
              <span className="quick-stat-card__kpi-label">
                {t('quickStats.confirmedUpcoming', 'Pipeline')}
              </span>
              <span className="quick-stat-card__kpi-hint">
                {t('quickStats.confirmedUpcomingHint', 'Confirmed upcoming revenue')}
              </span>
              <span className="quick-stat-card__kpi-value quick-stat-card__kpi-value--sm">
                {formatCurrency(confirmedUpcoming)}
              </span>
            </div>
          )}
        </div>

        <div className="quick-stat-card__progress">
          <div className="quick-stat-card__progress-label">
            {t('quickStats.byStudio', 'By studio')}
          </div>
          {displayStudios.length > 0 ? (
            displayStudios.map((studio) => (
              <div key={studio.name} className="progress-row">
                <div className="progress-header">
                  <span>{studio.name}</span>
                  <span>{studio.occupancy}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill progress-fill--primary" style={{ width: `${studio.occupancy}%` }} />
                </div>
              </div>
            ))
          ) : (
            <p className="quick-stat-card__empty">{t('quickStats.noStudios', 'No active properties')}</p>
          )}
        </div>
      </div>
    </div>
  );
};
