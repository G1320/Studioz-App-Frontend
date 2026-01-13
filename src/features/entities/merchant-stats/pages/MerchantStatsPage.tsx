import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// MUI Icons
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterListIcon from '@mui/icons-material/FilterList';

import { useUserContext } from '@core/contexts';
import { useStudios, useReservations } from '@shared/hooks';
import { StatCard, RevenueChart, ClientRow, QuickStats, type ChartPeriod } from '../components';
import '../styles/_merchant-stats.scss';

// Mock client data (in production, this would come from an API)
const MOCK_CLIENTS = [
  {
    id: '1',
    name: 'רונן דהן',
    role: 'מפיק מוזיקלי',
    totalSpent: 12450,
    lastVisit: 'אתמול',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    name: 'שרי גולן',
    role: 'זמרת יוצרת',
    totalSpent: 8320,
    lastVisit: 'לפני יומיים',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '3',
    name: 'להקת \'השכנים\'',
    role: 'הרכב רוק',
    totalSpent: 5600,
    lastVisit: '04/01/2024'
  },
  {
    id: '4',
    name: 'גיא מרגלית',
    role: 'פודקאסטר',
    totalSpent: 4100,
    lastVisit: '01/01/2024',
    avatarUrl: 'https://randomuser.me/api/portraits/men/86.jpg'
  },
  {
    id: '5',
    name: 'נועה קירל',
    role: 'אמנית',
    totalSpent: 3200,
    lastVisit: '28/12/2023',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

const MerchantStatsPage: React.FC = () => {
  const { t, i18n } = useTranslation('merchantStats');
  const { user } = useUserContext();
  const { data: studios = [] } = useStudios();
  const { data: reservations = [] } = useReservations();
  
  const [period, setPeriod] = useState<ChartPeriod>('monthly');
  
  // Helper to extract localized string from multilingual object
  const getLocalizedName = (name: string | { en?: string; he?: string } | undefined): string => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    return name[i18n.language as 'en' | 'he'] || name.he || name.en || '';
  };

  // Get user's studios
  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return studios.filter((studio) => studio.createdBy === user._id);
  }, [studios, user?._id]);

  // Calculate stats from reservations
  const stats = useMemo(() => {
    const studioReservations = reservations.filter((res) =>
      userStudios.some((studio) =>
        studio.items.some((item) => item.itemId === res.itemId)
      )
    );

    const totalRevenue = studioReservations.reduce(
      (sum, res) => sum + (res.totalPrice || 0),
      0
    );

    const confirmedBookings = studioReservations.filter(
      (res) => res.status === 'confirmed'
    ).length;

    const avgPerBooking = confirmedBookings > 0 
      ? Math.round(totalRevenue / confirmedBookings) 
      : 0;

    // Calculate new clients (mock - in production would track unique customers)
    const uniqueCustomers = new Set(
      studioReservations.map((res) => res.customerId || res.userId)
    ).size;

    return {
      totalRevenue,
      totalBookings: studioReservations.length,
      avgPerBooking,
      newClients: uniqueCustomers
    };
  }, [reservations, userStudios]);

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `₪${(amount / 1000).toFixed(1)}k`.replace('.0k', 'k');
    }
    return `₪${amount.toLocaleString()}`;
  };

  // Get studio name for greeting
  const studioName = getLocalizedName(userStudios[0]?.name) || t('header.defaultStudio', 'האולפן שלך');

  return (
    <div className="merchant-stats">
      {/* Header */}
      <header className="merchant-stats__header">
        <div className="merchant-stats__greeting">
          <h1>
            {t('header.greeting', 'שלום,')} <span className="highlight">{studioName}</span>
          </h1>
          <p>{t('header.subtitle', 'הנה סקירה של הביצועים שלך לתקופה זו')}</p>
        </div>

        <div className="merchant-stats__controls">
          <button className="merchant-stats__date-picker">
            <CalendarTodayIcon className="icon-calendar" />
            <span>{t('header.month', 'ינואר 2024')}</span>
            <KeyboardArrowDownIcon className="icon-chevron" />
          </button>

          <button className="merchant-stats__export-btn" title={t('header.export', 'ייצוא')}>
            <FileDownloadIcon />
          </button>
        </div>
      </header>

      {/* Key Metrics */}
      <div className="merchant-stats__metrics">
        <StatCard
          title={t('metrics.totalRevenue', 'סה״כ הכנסות')}
          value={formatCurrency(stats.totalRevenue || 42593)}
          trend="+12%"
          isPositive={true}
          icon={<AttachMoneyIcon />}
        />
        <StatCard
          title={t('metrics.totalBookings', 'סה״כ הזמנות')}
          value={String(stats.totalBookings || 148)}
          trend="+5%"
          isPositive={true}
          icon={<BarChartIcon />}
        />
        <StatCard
          title={t('metrics.avgPerBooking', 'ממוצע להזמנה')}
          value={`₪${stats.avgPerBooking || 287}`}
          trend="-2%"
          isPositive={false}
          icon={<TrendingUpIcon />}
        />
        <StatCard
          title={t('metrics.newClients', 'לקוחות חדשים')}
          value={String(stats.newClients || 24)}
          trend="+18%"
          isPositive={true}
          icon={<PeopleOutlineIcon />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="merchant-stats__content">
        {/* Left Column - Charts */}
        <div className="merchant-stats__main">
          {/* Revenue Chart */}
          <RevenueChart period={period} onPeriodChange={setPeriod} />

          {/* Quick Stats Row */}
          <QuickStats />
        </div>

        {/* Right Column - Clients */}
        <div className="merchant-stats__sidebar">
          <div className="clients-card">
            <div className="clients-card__header">
              <h2>{t('clients.title', 'לקוחות מובילים')}</h2>
              <button className="view-all">
                {t('clients.viewAll', 'הצג הכל')}
              </button>
            </div>

            <div className="clients-list">
              {MOCK_CLIENTS.map((client) => (
                <ClientRow
                  key={client.id}
                  name={client.name}
                  role={client.role}
                  totalSpent={client.totalSpent}
                  lastVisit={client.lastVisit}
                  avatarUrl={client.avatarUrl}
                />
              ))}
            </div>

            <button className="clients-card__filter-btn">
              <FilterListIcon />
              {t('clients.filterByCategory', 'סנן לפי קטגוריה')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantStatsPage;
