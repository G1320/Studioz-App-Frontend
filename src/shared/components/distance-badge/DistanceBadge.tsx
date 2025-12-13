import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useTranslation } from 'react-i18next';
import { formatDistance } from '@shared/utils/distanceUtils';

interface DistanceBadgeProps {
  distance: number; // Distance in kilometers
  className?: string;
  showIcon?: boolean;
}

export const DistanceBadge: React.FC<DistanceBadgeProps> = ({ distance, className = '', showIcon = true }) => {
  const { t } = useTranslation('common');
  
  return (
    <div className={`distance-badge ${className}`}>
      {showIcon && <LocationOnIcon className="distance-badge__icon" aria-hidden="true" />}
      <span className="distance-badge__value">{formatDistance(distance, t)}</span>
    </div>
  );
};

