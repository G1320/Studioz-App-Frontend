import React from 'react';
import { SkeletonLoader } from '@shared/components';
import './styles/_reservation-card-skeleton.scss';

export const ReservationCardSkeleton: React.FC = () => {
  return (
    <article className="reservation-card-skeleton">
      <div className="reservation-card-skeleton__content">
        <div className="reservation-card-skeleton__header">
          <div className="reservation-card-skeleton__item-name">
            <SkeletonLoader height={24} width="60%" borderRadius="4px" />
          </div>
        </div>
        <div className="reservation-card-skeleton__studio">
          <SkeletonLoader height={18} width="40%" borderRadius="4px" />
        </div>
        <div className="reservation-card-skeleton__status">
          <SkeletonLoader height={24} width="100px" borderRadius="4px" />
        </div>
        <div className="reservation-card-skeleton__details">
          <SkeletonLoader height={16} width="100%" borderRadius="4px" />
          <SkeletonLoader height={16} width="100%" borderRadius="4px" />
          <SkeletonLoader height={16} width="80%" borderRadius="4px" />
        </div>
        <div className="reservation-card-skeleton__button">
          <SkeletonLoader height={36} width="120px" borderRadius="6px" />
        </div>
      </div>
    </article>
  );
};

