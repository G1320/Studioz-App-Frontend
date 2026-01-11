import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Building2,
  Package,
  Search,
  MoreVertical,
  BarChart3,
  Settings,
  Shield,
  Filter,
  Download,
  ChevronRight,
  User,
  MapPin,
  DollarSign,
  CheckCircle2
} from 'lucide-react';
import { useReservations } from '@shared/hooks';
import { Studio, User as UserType } from 'src/types/index';
import './styles/_admin-panel.scss';

// --- Types ---
type Tab = 'overview' | 'users' | 'studios' | 'services';

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  studios: number;
  services: number;
  joined: string;
  status: string;
}

interface StudioData {
  id: string;
  name: string;
  owner: string;
  location: string;
  rating: number;
  bookings: number;
  revenue: string;
  status: string;
}

interface ServiceData {
  id: string;
  name: string;
  category: string;
  studio: string;
  price: string;
  status: string;
}

// --- Helper function ---
function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}

// --- Sub Components ---

const StatCard = ({ metric }: { metric: Metric }) => {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-card__header">
        <div className="admin-stat-card__icon">
          <metric.icon size={20} />
        </div>
        <div
          className={cn(
            'admin-stat-card__change',
            metric.trend === 'up' ? 'admin-stat-card__change--up' : 'admin-stat-card__change--down'
          )}
        >
          {metric.change}
        </div>
      </div>
      <div className="admin-stat-card__body">
        <h3 className="admin-stat-card__value">{metric.value}</h3>
        <p className="admin-stat-card__label">{metric.label}</p>
      </div>
    </div>
  );
};

const SectionHeader = ({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) => {
  return (
    <div className="admin-section-header">
      <div className="admin-section-header__text">
        <h2 className="admin-section-header__title">{title}</h2>
        {description && <p className="admin-section-header__description">{description}</p>}
      </div>
      {action}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'available':
        return 'admin-status-badge--active';
      case 'verified':
        return 'admin-status-badge--verified';
      case 'pending':
      case 'pending review':
        return 'admin-status-badge--pending';
      case 'suspended':
      case 'maintenance':
        return 'admin-status-badge--suspended';
      default:
        return 'admin-status-badge--default';
    }
  };

  return <span className={cn('admin-status-badge', getStatusClass(status))}>{status}</span>;
};

const UsersTable = ({ users, searchTerm }: { users: UserData[]; searchTerm: string }) => {
  const { t } = useTranslation('admin');

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const search = searchTerm.toLowerCase();
    return users.filter(
      (user) => user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search)
    );
  }, [users, searchTerm]);

  return (
    <div className="admin-table-container">
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead className="admin-table__head">
            <tr>
              <th className="admin-table__th">{t('table.user')}</th>
              <th className="admin-table__th">{t('table.role')}</th>
              <th className="admin-table__th admin-table__th--center">{t('table.studios')}</th>
              <th className="admin-table__th admin-table__th--center">{t('table.services')}</th>
              <th className="admin-table__th">{t('table.status')}</th>
              <th className="admin-table__th admin-table__th--right">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody className="admin-table__body">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="admin-table__row">
                <td className="admin-table__td">
                  <div className="admin-user-cell">
                    <div className="admin-user-cell__avatar">{user.name.charAt(0)}</div>
                    <div className="admin-user-cell__info">
                      <div className="admin-user-cell__name">{user.name}</div>
                      <div className="admin-user-cell__email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="admin-table__td">
                  <span className="admin-table__text">{user.role}</span>
                </td>
                <td className="admin-table__td admin-table__td--center">
                  <span className={cn('admin-table__count', user.studios > 0 && 'admin-table__count--active')}>
                    {user.studios}
                  </span>
                </td>
                <td className="admin-table__td admin-table__td--center">
                  <span className={cn('admin-table__count', user.services > 0 && 'admin-table__count--active')}>
                    {user.services}
                  </span>
                </td>
                <td className="admin-table__td">
                  <StatusBadge status={user.status} />
                </td>
                <td className="admin-table__td admin-table__td--right">
                  <button className="admin-table__action-btn">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StudiosTable = ({ studios, searchTerm }: { studios: StudioData[]; searchTerm: string }) => {
  const { t } = useTranslation('admin');

  const filteredStudios = useMemo(() => {
    if (!searchTerm.trim()) return studios;
    const search = searchTerm.toLowerCase();
    return studios.filter(
      (studio) =>
        studio.name.toLowerCase().includes(search) ||
        studio.owner.toLowerCase().includes(search) ||
        studio.location.toLowerCase().includes(search)
    );
  }, [studios, searchTerm]);

  return (
    <div className="admin-table-container">
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead className="admin-table__head">
            <tr>
              <th className="admin-table__th">{t('table.studio')}</th>
              <th className="admin-table__th">{t('table.owner')}</th>
              <th className="admin-table__th">{t('table.performance')}</th>
              <th className="admin-table__th">{t('table.status')}</th>
              <th className="admin-table__th admin-table__th--right">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody className="admin-table__body">
            {filteredStudios.map((studio) => (
              <tr key={studio.id} className="admin-table__row">
                <td className="admin-table__td">
                  <div className="admin-studio-cell">
                    <div className="admin-studio-cell__icon">
                      <Building2 size={18} />
                    </div>
                    <div className="admin-studio-cell__info">
                      <div className="admin-studio-cell__name">{studio.name}</div>
                      <div className="admin-studio-cell__location">
                        <MapPin size={10} /> {studio.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="admin-table__td">
                  <div className="admin-owner-cell">
                    <User size={14} />
                    <span>{studio.owner}</span>
                  </div>
                </td>
                <td className="admin-table__td">
                  <div className="admin-performance-cell">
                    <div className="admin-performance-cell__row">
                      <span className="admin-performance-cell__value">{studio.bookings}</span> {t('table.bookings')}
                    </div>
                    <div className="admin-performance-cell__row admin-performance-cell__row--revenue">
                      <span className="admin-performance-cell__value admin-performance-cell__value--primary">
                        {studio.revenue}
                      </span>{' '}
                      {t('table.revenue')}
                    </div>
                  </div>
                </td>
                <td className="admin-table__td">
                  <StatusBadge status={studio.status} />
                </td>
                <td className="admin-table__td admin-table__td--right">
                  <button className="admin-table__action-btn">
                    <Settings size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ServicesTable = ({ services, searchTerm }: { services: ServiceData[]; searchTerm: string }) => {
  const { t } = useTranslation('admin');

  const filteredServices = useMemo(() => {
    if (!searchTerm.trim()) return services;
    const search = searchTerm.toLowerCase();
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(search) ||
        service.studio.toLowerCase().includes(search) ||
        service.category.toLowerCase().includes(search)
    );
  }, [services, searchTerm]);

  return (
    <div className="admin-table-container">
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead className="admin-table__head">
            <tr>
              <th className="admin-table__th">{t('table.serviceName')}</th>
              <th className="admin-table__th">{t('table.category')}</th>
              <th className="admin-table__th">{t('table.studio')}</th>
              <th className="admin-table__th">{t('table.price')}</th>
              <th className="admin-table__th">{t('table.status')}</th>
              <th className="admin-table__th admin-table__th--right">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody className="admin-table__body">
            {filteredServices.map((service) => (
              <tr key={service.id} className="admin-table__row">
                <td className="admin-table__td">
                  <div className="admin-table__text admin-table__text--bold">{service.name}</div>
                </td>
                <td className="admin-table__td">
                  <span className="admin-category-badge">{service.category}</span>
                </td>
                <td className="admin-table__td">
                  <div className="admin-studio-link">
                    <Building2 size={12} />
                    {service.studio}
                  </div>
                </td>
                <td className="admin-table__td">
                  <span className="admin-table__price">{service.price}</span>
                </td>
                <td className="admin-table__td">
                  <StatusBadge status={service.status} />
                </td>
                <td className="admin-table__td admin-table__td--right">
                  <button className="admin-table__action-btn">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main Component ---

interface AdminPanelProps {
  user: UserType | null;
  studios: Studio[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, studios }) => {
  const { t } = useTranslation('admin');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: reservations = [] } = useReservations();

  // Calculate real metrics from data
  const metrics: Metric[] = useMemo(() => {
    const activeStudios = studios.filter((s) => s.active).length;
    const totalServices = studios.reduce((acc, s) => acc + s.items.length, 0);
    const totalRevenue = reservations.reduce((acc, r) => acc + (r.totalPrice || 0), 0);

    return [
      { label: t('metrics.totalUsers'), value: '2,543', change: '+12.5%', trend: 'up', icon: Users },
      {
        label: t('metrics.activeStudios'),
        value: activeStudios.toString(),
        change: '+4.2%',
        trend: 'up',
        icon: Building2
      },
      {
        label: t('metrics.activeServices'),
        value: totalServices.toString(),
        change: '+8.3%',
        trend: 'up',
        icon: Package
      },
      {
        label: t('metrics.monthlyRevenue'),
        value: `₪${Math.round(totalRevenue / 1000)}k`,
        change: '+8.1%',
        trend: 'up',
        icon: DollarSign
      }
    ];
  }, [studios, reservations, t]);

  // Transform studio data for tables
  const studioTableData: StudioData[] = useMemo(() => {
    return studios.map((studio) => ({
      id: studio._id,
      name: studio.name.he || studio.name.en || 'Unknown',
      owner: 'Studio Owner', // Would need user lookup
      location: studio.city || 'Unknown',
      rating: studio.averageRating || 0,
      bookings: studio.totalBookings || 0,
      revenue: `₪${Math.round((studio.totalBookings || 0) * 150)}`,
      status: studio.active ? 'Verified' : 'Pending Review'
    }));
  }, [studios]);

  // Transform services data
  const servicesTableData: ServiceData[] = useMemo(() => {
    return studios.flatMap((studio) =>
      studio.items.map((item) => ({
        id: item._id || item.itemId || Math.random().toString(),
        name: item.name?.he || item.name?.en || 'Unknown Service',
        category: item.subCategories?.[0] || 'General',
        studio: studio.name.he || studio.name.en || 'Unknown',
        price: `₪${item.price || 0}/hr`,
        status: item.active ? 'Available' : 'Maintenance'
      }))
    );
  }, [studios]);

  // Mock user data (would come from API)
  const usersTableData: UserData[] = [
    {
      id: '1',
      name: 'Alon Mizrahi',
      email: 'alon@example.com',
      role: 'Studio Owner',
      studios: 3,
      services: 12,
      joined: '2023-01-15',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Sarah Cohen',
      email: 'sarah.c@example.com',
      role: 'User',
      studios: 0,
      services: 0,
      joined: '2023-03-10',
      status: 'Active'
    },
    {
      id: '3',
      name: 'David Levi',
      email: 'david.l@music.co.il',
      role: 'Studio Owner',
      studios: 1,
      services: 4,
      joined: '2023-05-22',
      status: 'Pending'
    },
    {
      id: '4',
      name: 'Noa Ben Ari',
      email: 'noa@podcast.io',
      role: 'Studio Owner',
      studios: 2,
      services: 8,
      joined: '2023-06-01',
      status: 'Active'
    },
    {
      id: '5',
      name: 'Yossi Golan',
      email: 'yossi@drum.co.il',
      role: 'User',
      studios: 0,
      services: 0,
      joined: '2023-02-14',
      status: 'Suspended'
    }
  ];

  const pendingStudios = studioTableData.filter((s) => s.status.includes('Pending'));

  const navItems = [
    { id: 'overview', label: t('nav.overview'), icon: BarChart3 },
    { id: 'users', label: t('nav.users'), icon: Users },
    { id: 'studios', label: t('nav.studios'), icon: Building2 },
    { id: 'services', label: t('nav.services'), icon: Package }
  ];

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <Shield size={28} />
            <h1 className="admin-sidebar__title">
              Admin<span className="admin-sidebar__title-accent">Panel</span>
            </h1>
          </div>

          <nav className="admin-sidebar__nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={cn('admin-sidebar__nav-item', activeTab === item.id && 'admin-sidebar__nav-item--active')}
              >
                <item.icon size={18} />
                {item.label}
                {activeTab === item.id && <ChevronRight size={14} className="admin-sidebar__nav-chevron" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__user-avatar">{user?.name?.charAt(0) || 'SA'}</div>
            <div className="admin-sidebar__user-info">
              <div className="admin-sidebar__user-name">{user?.name || 'Super Admin'}</div>
              <div className="admin-sidebar__user-email">{user?.email || 'admin@studioz.co.il'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Mobile Header & Navigation */}
        <div className="admin-mobile-header">
          <div className="admin-mobile-header__title">
            <Shield size={20} />
            <h1>
              Admin<span>Panel</span>
            </h1>
          </div>
          <nav className="admin-mobile-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={cn('admin-mobile-nav__item', activeTab === item.id && 'admin-mobile-nav__item--active')}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Search Bar - shown for tables */}
        {activeTab !== 'overview' && (
          <div className="admin-toolbar">
            <div className="admin-search">
              <Search className="admin-search__icon" size={16} />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-search__input"
              />
            </div>
            <div className="admin-toolbar__actions">
              <button className="admin-btn admin-btn--icon">
                <Filter size={18} />
              </button>
              <button className="admin-btn admin-btn--icon">
                <Download size={18} />
              </button>
              {activeTab === 'studios' && (
                <button className="admin-btn admin-btn--primary">
                  <CheckCircle2 size={16} />
                  {t('actions.verifyPending')}
                </button>
              )}
              {activeTab === 'users' && (
                <button className="admin-btn admin-btn--secondary">
                  <User size={16} />
                  {t('actions.addUser')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="admin-content admin-content--animate">
            <SectionHeader
              title={t('sections.overview.title')}
              description={t('sections.overview.description')}
              action={
                <button className="admin-link">
                  <Download size={16} /> {t('actions.exportReport')}
                </button>
              }
            />

            <div className="admin-metrics-grid">
              {metrics.map((metric, i) => (
                <StatCard key={i} metric={metric} />
              ))}
            </div>

            <div className="admin-panels-grid">
              {/* Recent Activity */}
              <div className="admin-card">
                <div className="admin-card__header">
                  <h3 className="admin-card__title">{t('sections.recentActivity.title')}</h3>
                  <button className="admin-link admin-link--small">{t('actions.viewAll')}</button>
                </div>
                <div className="admin-activity-list">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="admin-activity-item">
                      <div className="admin-activity-item__dot" />
                      <div className="admin-activity-item__content">
                        <p className="admin-activity-item__text">
                          <span className="admin-activity-item__user">Alon Mizrahi</span> {t('activity.addedStudio')}{' '}
                          <span className="admin-activity-item__studio">Sonic Haven TLV</span>
                        </p>
                        <p className="admin-activity-item__time">2 mins ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="admin-card">
                <div className="admin-card__header">
                  <h3 className="admin-card__title">{t('sections.pendingApprovals.title')}</h3>
                  <span className="admin-badge admin-badge--pending">
                    {pendingStudios.length} {t('status.pending')}
                  </span>
                </div>
                <div className="admin-pending-list">
                  {pendingStudios.length > 0 ? (
                    pendingStudios.slice(0, 3).map((studio) => (
                      <div key={studio.id} className="admin-pending-item">
                        <div className="admin-pending-item__info">
                          <div className="admin-pending-item__icon">
                            <Building2 size={14} />
                          </div>
                          <div>
                            <div className="admin-pending-item__name">{studio.name}</div>
                            <div className="admin-pending-item__location">{studio.location}</div>
                          </div>
                        </div>
                        <button className="admin-btn admin-btn--small admin-btn--primary">{t('actions.review')}</button>
                      </div>
                    ))
                  ) : (
                    <p className="admin-empty-text">{t('sections.pendingApprovals.empty')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-content admin-content--animate">
            <SectionHeader title={t('sections.users.title')} description={t('sections.users.description')} />
            <UsersTable users={usersTableData} searchTerm={searchTerm} />
          </div>
        )}

        {activeTab === 'studios' && (
          <div className="admin-content admin-content--animate">
            <SectionHeader title={t('sections.studios.title')} description={t('sections.studios.description')} />
            <StudiosTable studios={studioTableData} searchTerm={searchTerm} />
          </div>
        )}

        {activeTab === 'services' && (
          <div className="admin-content admin-content--animate">
            <SectionHeader title={t('sections.services.title')} description={t('sections.services.description')} />
            <ServicesTable services={servicesTableData} searchTerm={searchTerm} />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
