import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  lines?: number;
  height?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  lines = 3,
  height = '1rem'
}) => {
  return (
    <div className={`skeleton-loader ${className}`} data-testid="skeleton-loader">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-loader__line"
          style={{
            height,
            width: i === lines - 1 && lines > 1 ? '70%' : '100%'
          }}
        />
      ))}
    </div>
  );
};

export const StatCardSkeleton: React.FC = () => (
  <div className="stat-card stat-card--skeleton">
    <div className="stat-card__top">
      <div className="stat-card__heading">
        <div className="skeleton-loader__line" style={{ height: 10, width: '55%' }} />
        <div className="skeleton-loader__line" style={{ height: 8, width: '40%' }} />
      </div>
    </div>
    <div className="skeleton-loader__line" style={{ height: 22, width: '45%' }} />
    <div className="skeleton-loader__line" style={{ height: 10, width: '28%' }} />
  </div>
);

const CHART_BAR_HEIGHTS = [42, 58, 36, 72, 48, 64, 40, 78, 52, 60, 44, 68];

export const ChartSkeleton: React.FC = () => (
  <div className="revenue-chart revenue-chart--skeleton">
    <div className="skeleton-loader__line" style={{ height: 18, width: 160, marginBottom: 8 }} />
    <div className="skeleton-loader__line" style={{ height: 12, width: 120, marginBottom: 24 }} />
    <div className="chart-skeleton-bars">
      {CHART_BAR_HEIGHTS.map((height, i) => (
        <div key={i} className="chart-skeleton-bar" style={{ height: `${height}%` }} />
      ))}
    </div>
  </div>
);
