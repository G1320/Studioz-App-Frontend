import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ChurnRisk } from '@shared/services';

interface ChurnBadgeProps {
  risk: ChurnRisk;
  className?: string;
}

export const ChurnBadge: React.FC<ChurnBadgeProps> = ({ risk, className = '' }) => {
  const { t } = useTranslation('merchantStats');
  const label = t(`churn.${risk}`, risk === 'low' ? 'נמוך' : risk === 'medium' ? 'בינוני' : 'גבוה');
  return (
    <span className={`churn-badge churn-badge--${risk} ${className}`} title={label}>
      {label}
    </span>
  );
};
