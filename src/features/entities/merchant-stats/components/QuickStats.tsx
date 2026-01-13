import React from 'react';
import { useTranslation } from 'react-i18next';

interface QuickStatsProps {
  occupancy?: number;
  roomAOccupancy?: number;
  roomBOccupancy?: number;
  avgSessionTime?: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  occupancy = 78,
  roomAOccupancy = 82,
  roomBOccupancy = 65,
  avgSessionTime = 3.5
}) => {
  const { t } = useTranslation('merchantStats');

  return (
    <div className="quick-stats">
      {/* Occupancy Card */}
      <div className="quick-stat-card">
        <div className="quick-stat-card__glow quick-stat-card__glow--yellow" />
        <div className="quick-stat-card__header">
          <h3>{t('quickStats.occupancy', 'תפוסת אולפן')}</h3>
          <div className="value-row">
            <span className="value">{occupancy}%</span>
            <span className="badge">{t('quickStats.aboveAverage', 'גבוה מהרגיל')}</span>
          </div>
        </div>

        <div className="quick-stat-card__progress">
          <div className="progress-row">
            <div className="progress-header">
              <span>{t('quickStats.roomA', 'חדר א׳')}</span>
              <span>{roomAOccupancy}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill progress-fill--primary"
                style={{ width: `${roomAOccupancy}%` }}
              />
            </div>
          </div>

          <div className="progress-row">
            <div className="progress-header">
              <span>{t('quickStats.roomB', 'חדר ב׳')}</span>
              <span>{roomBOccupancy}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill progress-fill--secondary"
                style={{ width: `${roomBOccupancy}%` }}
              />
            </div>
          </div>
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
