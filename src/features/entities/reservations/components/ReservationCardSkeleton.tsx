import React from 'react';
import { SkeletonLoader } from '@shared/components';
import './styles/_reservation-card-skeleton.scss';

export const ReservationCardSkeleton: React.FC = () => {
  return (
    <article className="reservation-card-skeleton">
      {/* Summary View (matches collapsed ReservationCard) */}
      <div className="reservation-card-skeleton__summary">
        {/* Status Indicator */}
        <div className="reservation-card-skeleton__status-indicator">
          <SkeletonLoader width={40} height={40} borderRadius="50%" />
        </div>

        {/* Main Content */}
        <div className="reservation-card-skeleton__content">
          {/* Header: Item name + Price */}
          <div className="reservation-card-skeleton__header">
            <div className="reservation-card-skeleton__item-name">
              <SkeletonLoader height={18} width="65%" borderRadius="4px" />
            </div>
            <div className="reservation-card-skeleton__price">
              <SkeletonLoader height={18} width={60} borderRadius="4px" />
            </div>
          </div>

          {/* Subtitle */}
          <div className="reservation-card-skeleton__subtitle">
            <SkeletonLoader height={14} width="45%" borderRadius="4px" />
          </div>

          {/* Meta: Date + Time */}
          <div className="reservation-card-skeleton__meta">
            <div className="reservation-card-skeleton__meta-item">
              <SkeletonLoader height={12} width={90} borderRadius="4px" />
            </div>
            <div className="reservation-card-skeleton__meta-item">
              <SkeletonLoader height={12} width={80} borderRadius="4px" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
