import React from 'react';
import { useTranslation } from 'react-i18next';

interface QuickStatsProps {
  occupancy?: number;
  studios?: { name: string; occupancy: number }[];
  avgSessionTime?: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  occupancy = 0,
  studios = [],
  avgSessionTime = 0
}) => {
  const { t } = useTranslation('merchantStats');
  const displayStudios = studios.slice(0, 3);

  return (
    <div className="quick-stats">
      <div className="quick-stat-card">
        <div className="quick-stat-card__header">
          <h3>{t('quickStats.occupancy', 'תפוסת אולפן')}</h3>
          <div className="value-row">
            <span className="value">{occupancy}%</span>
            {occupancy > 50 && (
              <span className="badge">{t('quickStats.aboveAverage', 'גבוה מהרגיל')}</span>
            )}
          </div>
        </div>

        <div className="quick-stat-card__progress">
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
            <p className="quick-stat-card__empty">{t('quickStats.noStudios', 'אין נכסים פעילים')}</p>
          )}
        </div>
      </div>

      <div className="quick-stat-card quick-stat-card--compact">
        <div className="quick-stat-card__header">
          <h3>{t('quickStats.avgSession', 'זמן ממוצע לסשן')}</h3>
          <div className="value-row">
            <span className="value">{avgSessionTime}</span>
            <span className="unit">{t('quickStats.hours', 'שעות')}</span>
          </div>
        </div>
        <p className="quick-stat-card__hint">
          {t('quickStats.avgSessionHint', 'ממוצע משך ההזמנות בתקופה שנבחרה')}
        </p>
      </div>
    </div>
  );
};
