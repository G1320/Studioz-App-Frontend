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

  // If no studios, show default "No studios" state or fallback
  const displayStudios = studios.length > 0 ? studios : [];

  return (
    <div className="quick-stats">
      {/* Occupancy Card */}
      <div className="quick-stat-card">
        <div className="quick-stat-card__glow quick-stat-card__glow--yellow" />
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
            displayStudios.slice(0, 3).map((studio, index) => (
              <div key={index} className="progress-row">
                <div className="progress-header">
                  <span>{studio.name}</span>
                  <span>{studio.occupancy}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${index === 0 ? 'progress-fill--primary' : 'progress-fill--secondary'}`}
                    style={{ width: `${studio.occupancy}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="progress-row">
              <div className="progress-header">
                <span>{t('quickStats.noStudios', 'אין נכסים פעילים')}</span>
                <span>0%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '0%' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Average Session Card */}
      <div className="quick-stat-card">
        <div className="quick-stat-card__glow quick-stat-card__glow--blue" />
        <div className="quick-stat-card__header">
          <h3>{t('quickStats.avgSession', 'זמן ממוצע לסשן')}</h3>
          <div className="value-row">
            <span className="value">{avgSessionTime}</span>
            <span className="unit">{t('quickStats.hours', 'שעות')}</span>
          </div>
        </div>

        <div className="quick-stat-card__legend">
          <div className="legend-item">
            <div className="legend-dot legend-dot--blue" />
            <span>{t('quickStats.recording', 'הקלטה')} (4h)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot legend-dot--purple" />
            <span>{t('quickStats.mixing', 'מיקס')} (2h)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
