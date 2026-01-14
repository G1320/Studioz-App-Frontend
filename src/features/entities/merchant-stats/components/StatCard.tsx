import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@shared/components/icons';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, isPositive, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__content">
        <h3>{title}</h3>
        <p className="value">{value}</p>
      </div>
      <div className={`stat-card__trend ${isPositive ? 'stat-card__trend--positive' : 'stat-card__trend--negative'}`}>
        <span dir="ltr">{trend}</span>
        {isPositive ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />}
      </div>
    </div>
  );
};
