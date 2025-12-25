import React from 'react';
import { useTranslation } from 'react-i18next';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import './styles/_status-badge.scss';

interface StatusBadgeProps {
  averageRating?: number;
  reviewCount?: number;
  createdAt?: Date | string;
  className?: string;
}

type BadgeType = 'highly-rated' | 'popular' | 'new';

interface BadgeConfig {
  type: BadgeType;
  label: string;
  icon: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  averageRating,
  reviewCount = 0,
  createdAt,
  className = ''
}) => {
  const { t } = useTranslation('common');

  // Calculate which badges should be shown
  const badges: BadgeConfig[] = [];

  // Highly Rated / Top Rated: averageRating >= 4.5 and reviewCount >= 10
  if (averageRating !== undefined && averageRating >= 4.5 && reviewCount >= 10) {
    badges.push({
      type: 'highly-rated',
      label: t('badges.highly_rated', 'Highly Rated'),
      icon: <StarIcon className="status-badge__icon" />
    });
  }

  // Popular: reviewCount >= 50
  if (reviewCount >= 50) {
    badges.push({
      type: 'popular',
      label: t('badges.popular', 'Popular'),
      icon: <TrendingUpIcon className="status-badge__icon" />
    });
  }

  // New: createdAt within last 30 days
  if (createdAt) {
    const createdDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
    const now = new Date();
    const daysSinceCreation = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceCreation <= 30) {
      badges.push({
        type: 'new',
        label: t('badges.new', 'New'),
        icon: <NewReleasesIcon className="status-badge__icon" />
      });
    }
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={`status-badge-container ${className}`}>
      {badges.map((badge) => (
        <div key={badge.type} className={`status-badge status-badge--${badge.type}`}>
          {badge.icon}
          <span className="status-badge__label">{badge.label}</span>
        </div>
      ))}
    </div>
  );
};

