import React from 'react';
import { useTranslation } from 'react-i18next';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, isPositive, icon }) => {
  const { t } = useTranslation('merchantStats');

  return (
    <div className="stat-card">
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__content">
        <h3>{title}</h3>
        <p className="value">{value}</p>
      </div>
      <div className={`stat-card__trend ${isPositive ? 'stat-card__trend--positive' : 'stat-card__trend--negative'}`}>
        <span dir="ltr">{trend}</span>
        {isPositive ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
      </div>
    </div>
  );
};
