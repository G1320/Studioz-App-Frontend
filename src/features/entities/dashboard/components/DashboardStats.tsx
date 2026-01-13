import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, MoneyIcon, BusinessIcon, ScheduleIcon, FavoriteIcon } from '@shared/components/icons';

interface DashboardStatsProps {
  totalBookings?: number;
  totalRevenue?: number;
  activeStudios?: number;
  upcomingBookings?: number;
  isStudioOwner?: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalBookings,
  totalRevenue,
  activeStudios,
  upcomingBookings,
  isStudioOwner = false
}) => {
  const { t } = useTranslation('dashboard');

  const stats = isStudioOwner
    ? [
        {
          label: t('stats.totalBookings'),
          value: totalBookings ?? 0,
          icon: <CalendarIcon />
        },
        {
          label: t('stats.totalRevenue'),
          value: totalRevenue ? `₪${totalRevenue.toLocaleString()}` : '₪0',
          icon: <MoneyIcon />
        },
        {
          label: t('stats.activeStudios'),
          value: activeStudios ?? 0,
          icon: <BusinessIcon />
        },
        {
          label: t('stats.upcomingBookings'),
          value: upcomingBookings ?? 0,
          icon: <ScheduleIcon />
        }
      ]
    : [
        {
          label: t('stats.myBookings'),
          value: totalBookings ?? 0,
          icon: <CalendarIcon />
        },
        {
          label: t('stats.totalSpent'),
          value: totalRevenue ? `₪${totalRevenue.toLocaleString()}` : '₪0',
          icon: <MoneyIcon />
        },
        {
          label: t('stats.wishlists'),
          value: 0, // TODO: Fetch from user data
          icon: <FavoriteIcon />
        },
        {
          label: t('stats.upcomingReservations'),
          value: upcomingBookings ?? 0,
          icon: <ScheduleIcon />
        }
      ];

  return (
    <div className="dashboard-stats">
      <h2 className="dashboard-section-title">{t('stats.title')}</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon-container">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
