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
    <div className="stat-card__icon skeleton-loader__box" style={{ width: 24, height: 24 }} />
    <div className="stat-card__content">
      <div className="skeleton-loader__line" style={{ height: 12, width: '60%', marginBottom: 8 }} />
      <div className="skeleton-loader__line" style={{ height: 24, width: '80%' }} />
    </div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="revenue-chart revenue-chart--skeleton">
    <div className="skeleton-loader__line" style={{ height: 24, width: 200, marginBottom: 16 }} />
    <div className="chart-skeleton-bars">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="chart-skeleton-bar" style={{ height: `${30 + Math.random() * 60}%` }} />
      ))}
    </div>
  </div>
);
