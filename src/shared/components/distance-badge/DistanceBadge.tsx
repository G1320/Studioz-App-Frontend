import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { formatDistance } from '@shared/utils/distanceUtils';

interface DistanceBadgeProps {
  distance: number; // Distance in kilometers
  className?: string;
}

export const DistanceBadge: React.FC<DistanceBadgeProps> = ({ distance, className = '' }) => {
  return (
    <div className={`distance-badge ${className}`}>
      <LocationOnIcon className="distance-badge__icon" aria-hidden="true" />
      <span className="distance-badge__value">{formatDistance(distance)}</span>
    </div>
  );
};

