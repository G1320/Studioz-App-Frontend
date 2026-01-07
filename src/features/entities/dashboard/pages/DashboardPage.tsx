import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Studio } from 'src/types/index';
import { useReservations } from '@shared/hooks';
import { DashboardStats, MyStudios, DashboardCalendar, RecentActivity } from '../components';

interface DashboardPageProps {
  user: User | null;
  studios: Studio[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  studios
}) => {
  const { t } = useTranslation('dashboard');
  const { data: reservations = [] } = useReservations();

  // Determine if user is a studio owner
  const isStudioOwner = useMemo(() => {
    if (!user?._id) return false;
    return studios.some((studio) => studio.createdBy === user._id);
  }, [user?._id, studios]);

  // Get user's studios
  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return studios.filter((studio) => studio.createdBy === user._id);
  }, [studios, user?._id]);

  // Calculate stats for studio owners
  const stats = useMemo(() => {
    if (!isStudioOwner) {
      // Regular user stats
      const userReservations = reservations.filter(
        (res) => res.userId === user?._id || res.customerId === user?._id
      );
      const totalSpent = userReservations.reduce(
        (sum, res) => sum + (res.totalPrice || 0),
        0
      );
      return {
        totalBookings: userReservations.length,
        totalRevenue: totalSpent,
        upcomingBookings: userReservations.filter(
          (res) => res.status === 'confirmed'
        ).length
      };
    }

    // Studio owner stats - filter by studios owned by user
    // Filter by itemId matching studio items
    const studioReservations = reservations.filter((res) => {
      return userStudios.some((studio) => 
        studio.items.some((item) => item.itemId === res.itemId)
      );
    });
    const totalRevenue = studioReservations.reduce(
      (sum, res) => sum + (res.totalPrice || 0),
      0
    );
    const upcomingBookings = studioReservations.filter(
      (res) => res.status === 'confirmed'
    ).length;

    return {
      totalBookings: studioReservations.length,
      totalRevenue,
      activeStudios: userStudios.length,
      upcomingBookings
    };
  }, [isStudioOwner, reservations, user?._id, userStudios]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          {t('welcome', { name: user?.name || t('guest') })}
        </h1>
        {isStudioOwner && (
          <p className="dashboard-subtitle">{t('studioOwnerSubtitle')}</p>
        )}
      </div>

      <div className="dashboard-content">
        {/* Stats Section */}
        <DashboardStats
          totalBookings={stats.totalBookings}
          totalRevenue={stats.totalRevenue}
          activeStudios={stats.activeStudios}
          upcomingBookings={stats.upcomingBookings}
          isStudioOwner={isStudioOwner}
        />

        {/* Recent Activity Section - Only for studio owners */}
        {isStudioOwner && (
          <RecentActivity
            studioIds={userStudios.map((s) => s._id)}
            isStudioOwner={isStudioOwner}
            limit={5}
          />
        )}

        {/* My Studios Section - Only show if user has studios */}
        {isStudioOwner && userStudios.length > 0 && (
          <MyStudios studios={userStudios} />
        )}

        {/* Calendar Section */}
        <DashboardCalendar
          studios={userStudios}
          reservations={reservations}
          isStudioOwner={isStudioOwner}
        />
      </div>
    </div>
  );
};

export default DashboardPage;

