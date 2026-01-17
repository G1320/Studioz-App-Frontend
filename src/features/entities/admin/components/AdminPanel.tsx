import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  UsersIcon,
  BuildingIcon,
  PackageIcon,
  SearchIcon,
  MoreVertIcon,
  BarChart3Icon,
  SettingsIcon,
  ShieldLucideIcon,
  FilterIcon,
  DownloadIcon,
  ChevronRightIcon,
  UserLucideIcon,
  LocationIcon,
  DollarIcon,
  CheckCircle2Icon,
  TicketIcon,
  AddIcon,
  XIcon,
  CalendarIcon,
  TrashIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  MailIcon,
  ClockIcon,
  HashIcon,
  FileTextIcon,
  SparklesIcon,
  AlertTriangleIcon,
  PlayCircleIcon,
  ExternalLinkIcon,
  CreditCardIcon,
  SunIcon,
  MoonIcon,
  ShieldIcon,
  LockIcon,
  StarIcon,
  RefreshIcon,
  InfoIcon,
  NotificationsIcon,
  CancelIcon
} from '@shared/components/icons';
import { useReservations } from '@shared/hooks';
import { Studio, User as UserType } from 'src/types/index';
import { Coupon, createCoupon, getAllCoupons, deleteCoupon, toggleCouponStatus } from '@shared/services/coupon-service';
import { sendTestEmail } from '@shared/services/email-service';
import './styles/_admin-panel.scss';

// --- Types ---
type Tab = 'overview' | 'users' | 'studios' | 'services' | 'coupons' | 'emailTemplates';

// Email Template Types - Ordered by category
type EmailType =
  // Authentication & Account (1-5)
  | 'SIGNUP_CONFIRMATION_LEGACY'
  | 'PASSWORD_RESET'
  | 'WELCOME_SIGNUP'
  | 'EMAIL_VERIFICATION'
  | 'ACCOUNT_DEACTIVATION'
  // Transactions (6-9)
  | 'PURCHASE_CONFIRMATION'
  | 'PAYOUT_CONFIRMATION'
  | 'REFUND_CONFIRMATION'
  | 'ORDER_CANCELLED'
  // Bookings (10-15)
  | 'NEW_BOOKING_VENDOR'
  | 'BOOKING_CONFIRMED_CUSTOMER'
  | 'BOOKING_REMINDER'
  | 'BOOKING_CANCELLED_CUSTOMER'
  | 'BOOKING_CANCELLED_VENDOR'
  | 'BOOKING_MODIFIED'
  // Reviews (16)
  | 'REQUEST_REVIEW'
  // Subscriptions (17-26)
  | 'SUBSCRIPTION_ACTIVATED'
  | 'SUBSCRIPTION_PAYMENT_CONFIRMATION'
  | 'SUBSCRIPTION_CANCELLATION'
  | 'TRIAL_STARTED'
  | 'TRIAL_ENDING_REMINDER'
  | 'TRIAL_CHARGE_FAILED'
  | 'SUBSCRIPTION_PAYMENT_FAILED'
  | 'SUBSCRIPTION_EXPIRING'
  | 'SUBSCRIPTION_UPGRADED'
  | 'SUBSCRIPTION_DOWNGRADED'
  // Documents (27)
  | 'INVOICE_DOCUMENT_SENT';

type ThemeMode = 'light' | 'dark';

interface EmailData {
  customerName?: string;
  ownerName?: string;
  studioName?: string;
  experienceName?: string;
  dateTime?: string;
  duration?: string;
  location?: string;
  totalPaid?: string;
  reservationId?: string;
  notes?: string;
  guestEmail?: string;
  guestPhone?: string;
  planName?: string;
  startDate?: string;
  nextBillingDate?: string;
  price?: string;
  subscriptionId?: string;
  actionUrl?: string;
  daysRemaining?: number;
  trialEndDate?: string;
  failureReason?: string;
  // New fields for expanded templates
  orderNumber?: string;
  payoutAmount?: string;
  refundAmount?: string;
  documentName?: string;
  verificationCode?: string;
  serviceName?: string;
  invoiceUrl?: string;
}

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
                    <MoreVertIcon sx={{ fontSize: 16 }} />
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
                      <BuildingIcon sx={{ fontSize: 18 }} />
                    </div>
                    <div className="admin-studio-cell__info">
                      <div className="admin-studio-cell__name">{studio.name}</div>
                      <div className="admin-studio-cell__location">
                        <LocationIcon sx={{ fontSize: 10 }} /> {studio.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="admin-table__td">
                  <div className="admin-owner-cell">
                    <UserLucideIcon sx={{ fontSize: 14 }} />
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
                    <SettingsIcon sx={{ fontSize: 16 }} />
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
                    <BuildingIcon sx={{ fontSize: 12 }} />
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
                    <MoreVertIcon sx={{ fontSize: 16 }} />
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

// --- Coupon Components ---

interface CouponFormData {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  validFrom: string;
  validUntil: string;
  applicablePlans: string[];
  minPurchaseAmount: number;
}

const CouponCreator = ({
  onCouponCreated,
  onClose
}: {
  onCouponCreated: (coupon: Coupon) => void;
  onClose: () => void;
}) => {
  const { t } = useTranslation('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    maxUses: 0,
    validFrom: today,
    validUntil: nextMonth,
    applicablePlans: ['all'],
    minPurchaseAmount: 0
  });

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, code }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.code.trim()) {
      setError(t('coupons.errors.codeRequired', 'Coupon code is required'));
      return;
    }

    if (formData.discountValue <= 0) {
      setError(t('coupons.errors.valueRequired', 'Discount value must be greater than 0'));
      return;
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      setError(t('coupons.errors.percentageMax', 'Percentage cannot exceed 100%'));
      return;
    }

    setIsSubmitting(true);
    try {
      const coupon = await createCoupon({
        code: formData.code.toUpperCase().trim(),
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        maxUses: formData.maxUses,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
        applicablePlans: formData.applicablePlans,
        minPurchaseAmount: formData.minPurchaseAmount
      });
      onCouponCreated(coupon);
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create coupon';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-coupon-creator">
      <div className="admin-coupon-creator__header">
        <h3>{t('coupons.createNew', 'Create New Coupon')}</h3>
        <button className="admin-coupon-creator__close" onClick={onClose}>
          <XIcon sx={{ fontSize: 20 }} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-coupon-creator__form">
        {error && <div className="admin-coupon-creator__error">{error}</div>}

        <div className="admin-coupon-creator__field">
          <label>{t('coupons.fields.code', 'Coupon Code')}</label>
          <div className="admin-coupon-creator__code-input">
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="e.g., SUMMER2024"
              maxLength={20}
            />
            <button
              type="button"
              onClick={generateRandomCode}
              className="admin-btn admin-btn--secondary admin-btn--small"
            >
              {t('coupons.generate', 'Generate')}
            </button>
          </div>
        </div>

        <div className="admin-coupon-creator__row">
          <div className="admin-coupon-creator__field">
            <label>{t('coupons.fields.discountType', 'Discount Type')}</label>
            <select
              value={formData.discountType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  discountType: e.target.value as 'percentage' | 'fixed'
                }))
              }
            >
              <option value="percentage">{t('coupons.types.percentage', 'Percentage (%)')}</option>
              <option value="fixed">{t('coupons.types.fixed', 'Fixed Amount (₪)')}</option>
            </select>
          </div>

          <div className="admin-coupon-creator__field">
            <label>{t('coupons.fields.discountValue', 'Discount Value')}</label>
            <div className="admin-coupon-creator__value-input">
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData((prev) => ({ ...prev, discountValue: Number(e.target.value) }))}
                min={1}
                max={formData.discountType === 'percentage' ? 100 : undefined}
              />
              <span>{formData.discountType === 'percentage' ? '%' : '₪'}</span>
            </div>
          </div>
        </div>

        <div className="admin-coupon-creator__row">
          <div className="admin-coupon-creator__field">
            <label>{t('coupons.fields.validFrom', 'Valid From')}</label>
            <input
              type="date"
              value={formData.validFrom}
              onChange={(e) => setFormData((prev) => ({ ...prev, validFrom: e.target.value }))}
            />
          </div>

          <div className="admin-coupon-creator__field">
            <label>{t('coupons.fields.validUntil', 'Valid Until')}</label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData((prev) => ({ ...prev, validUntil: e.target.value }))}
              min={formData.validFrom}
            />
          </div>
        </div>

        <div className="admin-coupon-creator__row">
          <div className="admin-coupon-creator__field">
            <label>{t('coupons.fields.maxUses', 'Max Uses (0 = unlimited)')}</label>
            <input
              type="number"
              value={formData.maxUses}
              onChange={(e) => setFormData((prev) => ({ ...prev, maxUses: Number(e.target.value) }))}
              min={0}
            />
          </div>

          <div className="admin-coupon-creator__field">
            <label>{t('coupons.fields.minPurchase', 'Min Purchase Amount (₪)')}</label>
            <input
              type="number"
              value={formData.minPurchaseAmount}
              onChange={(e) => setFormData((prev) => ({ ...prev, minPurchaseAmount: Number(e.target.value) }))}
              min={0}
            />
          </div>
        </div>

        <div className="admin-coupon-creator__field">
          <label>{t('coupons.fields.applicablePlans', 'Applicable Plans')}</label>
          <select
            value={formData.applicablePlans[0]}
            onChange={(e) => setFormData((prev) => ({ ...prev, applicablePlans: [e.target.value] }))}
          >
            <option value="all">{t('coupons.plans.all', 'All Plans')}</option>
            <option value="starter">{t('coupons.plans.starter', 'Starter')}</option>
            <option value="pro">{t('coupons.plans.pro', 'Pro')}</option>
            <option value="enterprise">{t('coupons.plans.enterprise', 'Enterprise')}</option>
          </select>
        </div>

        <div className="admin-coupon-creator__actions">
          <button type="button" onClick={onClose} className="admin-btn admin-btn--secondary">
            {t('actions.cancel', 'Cancel')}
          </button>
          <button type="submit" disabled={isSubmitting} className="admin-btn admin-btn--primary">
            {isSubmitting ? t('actions.creating', 'Creating...') : t('coupons.create', 'Create Coupon')}
          </button>
        </div>
      </form>
    </div>
  );
};

const CouponsTable = ({
  coupons,
  searchTerm,
  onToggleStatus,
  onDelete
}: {
  coupons: Coupon[];
  searchTerm: string;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const { t } = useTranslation('admin');

  const filteredCoupons = useMemo(() => {
    if (!searchTerm.trim()) return coupons;
    const search = searchTerm.toLowerCase();
    return coupons.filter((coupon) => coupon.code.toLowerCase().includes(search));
  }, [coupons, searchTerm]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const isExpired = (validUntil: string) => new Date(validUntil) < new Date();

  return (
    <div className="admin-table-container">
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead className="admin-table__head">
            <tr>
              <th className="admin-table__th">{t('coupons.table.code', 'Code')}</th>
              <th className="admin-table__th">{t('coupons.table.discount', 'Discount')}</th>
              <th className="admin-table__th">{t('coupons.table.usage', 'Usage')}</th>
              <th className="admin-table__th">{t('coupons.table.validity', 'Validity')}</th>
              <th className="admin-table__th">{t('coupons.table.status', 'Status')}</th>
              <th className="admin-table__th admin-table__th--right">{t('table.actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="admin-table__body">
            {filteredCoupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-table__td admin-table__empty">
                  {t('coupons.noCoupons', 'No coupons found')}
                </td>
              </tr>
            ) : (
              filteredCoupons.map((coupon) => (
                <tr key={coupon._id} className="admin-table__row">
                  <td className="admin-table__td">
                    <div className="admin-coupon-cell">
                      <div className="admin-coupon-cell__icon">
                        <TicketIcon sx={{ fontSize: 16 }} />
                      </div>
                      <span className="admin-coupon-cell__code">{coupon.code}</span>
                    </div>
                  </td>
                  <td className="admin-table__td">
                    <div className="admin-discount-cell">
                      {coupon.discountType === 'percentage' ? (
                        <span className="admin-discount-cell__value">{coupon.discountValue}%</span>
                      ) : (
                        <span className="admin-discount-cell__value">₪{coupon.discountValue}</span>
                      )}
                      <span className="admin-discount-cell__type">
                        {coupon.discountType === 'percentage' ? 'off' : 'fixed'}
                      </span>
                    </div>
                  </td>
                  <td className="admin-table__td">
                    <div className="admin-usage-cell">
                      <span className="admin-usage-cell__count">{coupon.usedCount}</span>
                      <span className="admin-usage-cell__separator">/</span>
                      <span className="admin-usage-cell__max">{coupon.maxUses === 0 ? '∞' : coupon.maxUses}</span>
                    </div>
                  </td>
                  <td className="admin-table__td">
                    <div className="admin-validity-cell">
                      <CalendarIcon sx={{ fontSize: 12 }} />
                      <span>
                        {formatDate(coupon.validFrom)} - {formatDate(coupon.validUntil)}
                      </span>
                    </div>
                  </td>
                  <td className="admin-table__td">
                    {isExpired(coupon.validUntil) ? (
                      <StatusBadge status="Suspended" />
                    ) : coupon.isActive ? (
                      <StatusBadge status="Active" />
                    ) : (
                      <StatusBadge status="Pending" />
                    )}
                  </td>
                  <td className="admin-table__td admin-table__td--right">
                    <div className="admin-table__actions-group">
                      <button
                        className="admin-table__action-btn"
                        onClick={() => onToggleStatus(coupon._id)}
                        title={
                          coupon.isActive ? t('coupons.deactivate', 'Deactivate') : t('coupons.activate', 'Activate')
                        }
                      >
                        {coupon.isActive ? (
                          <ToggleRightIcon sx={{ fontSize: 18 }} />
                        ) : (
                          <ToggleLeftIcon sx={{ fontSize: 18 }} />
                        )}
                      </button>
                      <button
                        className="admin-table__action-btn admin-table__action-btn--danger"
                        onClick={() => onDelete(coupon._id)}
                        title={t('coupons.delete', 'Delete')}
                      >
                        <TrashIcon sx={{ fontSize: 16 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Email Template Components ---

// Sample data for preview mode
const SAMPLE_EMAIL_DATA: Record<EmailType, EmailData> = {
  // Authentication & Account
  SIGNUP_CONFIRMATION_LEGACY: {
    customerName: 'יוסי כהן',
    actionUrl: 'https://studioz.co.il/login'
  },
  PASSWORD_RESET: {
    customerName: 'יוסי כהן',
    reservationId: 'PR-2026-0115',
    actionUrl: 'https://studioz.co.il/reset-password?token=xxx'
  },
  WELCOME_SIGNUP: {
    customerName: 'יוסי כהן',
    actionUrl: 'https://studioz.co.il/studios'
  },
  EMAIL_VERIFICATION: {
    customerName: 'יוסי כהן',
    verificationCode: '123456',
    actionUrl: 'https://studioz.co.il/verify?code=123456'
  },
  ACCOUNT_DEACTIVATION: {
    customerName: 'יוסי כהן',
    actionUrl: 'https://studioz.co.il'
  },
  // Transactions
  PURCHASE_CONFIRMATION: {
    customerName: 'יוסי כהן',
    orderNumber: 'ORD-2026-0115',
    totalPaid: '₪450',
    actionUrl: 'https://studioz.co.il/orders/ORD-2026-0115'
  },
  PAYOUT_CONFIRMATION: {
    ownerName: 'אלון מזרחי',
    payoutAmount: '₪1,250',
    actionUrl: 'https://studioz.co.il/dashboard/payouts'
  },
  REFUND_CONFIRMATION: {
    customerName: 'יוסי כהן',
    refundAmount: '₪450',
    reservationId: 'RES-2026-0115',
    actionUrl: 'https://studioz.co.il/reservations/RES-2026-0115'
  },
  ORDER_CANCELLED: {
    customerName: 'יוסי כהן',
    reservationId: 'RES-2026-0115',
    studioName: 'Sonic Haven TLV',
    serviceName: 'אולפן הקלטה מקצועי',
    actionUrl: 'https://studioz.co.il/studios'
  },
  // Bookings
  NEW_BOOKING_VENDOR: {
    ownerName: 'אלון מזרחי',
    studioName: 'Sonic Haven TLV',
    customerName: 'יוסי כהן',
    guestPhone: '052-1234567',
    guestEmail: 'yossi@example.com',
    serviceName: 'אולפן הקלטה מקצועי',
    dateTime: '15 ינואר 2026, 14:00',
    duration: '3 שעות',
    actionUrl: 'https://studioz.co.il/dashboard/reservations/RES-2026-0115'
  },
  BOOKING_CONFIRMED_CUSTOMER: {
    customerName: 'יוסי כהן',
    studioName: 'Sonic Haven TLV',
    serviceName: 'אולפן הקלטה מקצועי',
    dateTime: '15 ינואר 2026, 14:00',
    duration: '3 שעות',
    location: 'דיזנגוף 50, תל אביב',
    totalPaid: '₪450',
    invoiceUrl: 'https://app.greeninvoice.co.il/view/xxx',
    actionUrl: 'https://studioz.co.il/reservations/RES-2026-0115'
  },
  BOOKING_REMINDER: {
    customerName: 'יוסי כהן',
    studioName: 'Sonic Haven TLV',
    dateTime: '15 ינואר 2026, 14:00',
    actionUrl: 'https://studioz.co.il/reservations/RES-2026-0115'
  },
  BOOKING_CANCELLED_CUSTOMER: {
    customerName: 'יוסי כהן',
    studioName: 'Sonic Haven TLV',
    actionUrl: 'https://studioz.co.il/studios'
  },
  BOOKING_CANCELLED_VENDOR: {
    ownerName: 'אלון מזרחי',
    studioName: 'Sonic Haven TLV',
    customerName: 'יוסי כהן',
    actionUrl: 'https://studioz.co.il/dashboard'
  },
  BOOKING_MODIFIED: {
    customerName: 'יוסי כהן',
    reservationId: 'RES-2026-0115',
    actionUrl: 'https://studioz.co.il/reservations/RES-2026-0115'
  },
  // Reviews
  REQUEST_REVIEW: {
    customerName: 'יוסי כהן',
    studioName: 'Sonic Haven TLV',
    actionUrl: 'https://studioz.co.il/studio/xxx/reviews'
  },
  // Subscriptions
  SUBSCRIPTION_ACTIVATED: {
    customerName: 'שרה לוי',
    planName: 'Pro',
    startDate: '1 ינואר 2026',
    actionUrl: 'https://studioz.co.il/profile'
  },
  SUBSCRIPTION_PAYMENT_CONFIRMATION: {
    customerName: 'שרה לוי',
    price: '₪149',
    nextBillingDate: '1 פברואר 2026',
    actionUrl: 'https://studioz.co.il/profile/subscription'
  },
  SUBSCRIPTION_CANCELLATION: {
    customerName: 'שרה לוי',
    planName: 'Pro',
    actionUrl: 'https://studioz.co.il/subscription'
  },
  TRIAL_STARTED: {
    customerName: 'מיכל רוזנברג',
    planName: 'Starter',
    price: '79',
    trialEndDate: '1 פברואר 2026',
    actionUrl: 'https://studioz.co.il/dashboard'
  },
  TRIAL_ENDING_REMINDER: {
    customerName: 'דוד בן ארי',
    planName: 'Pro',
    price: '149',
    daysRemaining: 3,
    trialEndDate: '18 ינואר 2026',
    actionUrl: 'https://studioz.co.il/profile/subscription'
  },
  TRIAL_CHARGE_FAILED: {
    customerName: 'נועה גולן',
    planName: 'Pro',
    failureReason: 'כרטיס האשראי נדחה - נא לבדוק את פרטי הכרטיס',
    actionUrl: 'https://studioz.co.il/profile/billing'
  },
  SUBSCRIPTION_PAYMENT_FAILED: {
    customerName: 'שרה לוי',
    price: '₪149',
    actionUrl: 'https://studioz.co.il/profile/billing'
  },
  SUBSCRIPTION_EXPIRING: {
    customerName: 'שרה לוי',
    nextBillingDate: '1 פברואר 2026',
    actionUrl: 'https://studioz.co.il/profile/subscription'
  },
  SUBSCRIPTION_UPGRADED: {
    customerName: 'שרה לוי',
    planName: 'Pro',
    actionUrl: 'https://studioz.co.il/profile'
  },
  SUBSCRIPTION_DOWNGRADED: {
    customerName: 'שרה לוי',
    planName: 'Starter',
    actionUrl: 'https://studioz.co.il/profile'
  },
  // Documents
  INVOICE_DOCUMENT_SENT: {
    customerName: 'יוסי כהן',
    documentName: 'חשבונית מס / קבלה #1234',
    invoiceUrl: 'https://app.greeninvoice.co.il/view/xxx',
    actionUrl: 'https://app.greeninvoice.co.il/view/xxx'
  }
};

// Brevo variable placeholders for export mode
const BREVO_VARIABLES: Record<EmailType, EmailData> = {
  // Authentication & Account
  SIGNUP_CONFIRMATION_LEGACY: {
    customerName: '{{ params.customerName }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  PASSWORD_RESET: {
    customerName: '{{ params.customerName }}',
    reservationId: '{{ params.reservationId }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  WELCOME_SIGNUP: {
    customerName: '{{ params.customerName }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  EMAIL_VERIFICATION: {
    customerName: '{{ params.customerName }}',
    verificationCode: '{{ params.verificationCode }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  ACCOUNT_DEACTIVATION: {
    customerName: '{{ params.customerName }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  // Transactions
  PURCHASE_CONFIRMATION: {
    customerName: '{{ params.customerName }}',
    orderNumber: '{{ params.orderNumber }}',
    totalPaid: '{{ params.totalPaid }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  PAYOUT_CONFIRMATION: {
    ownerName: '{{ params.ownerName }}',
    payoutAmount: '{{ params.payoutAmount }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  REFUND_CONFIRMATION: {
    customerName: '{{ params.customerName }}',
    refundAmount: '{{ params.refundAmount }}',
    reservationId: '{{ params.reservationId }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  ORDER_CANCELLED: {
    customerName: '{{ params.customerName }}',
    reservationId: '{{ params.reservationId }}',
    studioName: '{{ params.studioName }}',
    serviceName: '{{ params.serviceName }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  // Bookings
  NEW_BOOKING_VENDOR: {
    ownerName: '{{ params.ownerName }}',
    studioName: '{{ params.studioName }}',
    customerName: '{{ params.customerName }}',
    guestPhone: '{{ params.guestPhone }}',
    guestEmail: '{{ params.guestEmail }}',
    serviceName: '{{ params.serviceName }}',
    dateTime: '{{ params.dateTime }}',
    duration: '{{ params.duration }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  BOOKING_CONFIRMED_CUSTOMER: {
    customerName: '{{ params.customerName }}',
    studioName: '{{ params.studioName }}',
    serviceName: '{{ params.serviceName }}',
    dateTime: '{{ params.dateTime }}',
    duration: '{{ params.duration }}',
    location: '{{ params.location }}',
    totalPaid: '{{ params.totalPaid }}',
    invoiceUrl: '{{ params.invoiceUrl }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  BOOKING_REMINDER: {
    customerName: '{{ params.customerName }}',
    studioName: '{{ params.studioName }}',
    dateTime: '{{ params.dateTime }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  BOOKING_CANCELLED_CUSTOMER: {
    customerName: '{{ params.customerName }}',
    studioName: '{{ params.studioName }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  BOOKING_CANCELLED_VENDOR: {
    ownerName: '{{ params.ownerName }}',
    studioName: '{{ params.studioName }}',
    customerName: '{{ params.customerName }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  BOOKING_MODIFIED: {
    customerName: '{{ params.customerName }}',
    reservationId: '{{ params.reservationId }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  // Reviews
  REQUEST_REVIEW: {
    customerName: '{{ params.customerName }}',
    studioName: '{{ params.studioName }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  // Subscriptions
  SUBSCRIPTION_ACTIVATED: {
    customerName: '{{ params.customerName }}',
    planName: '{{ params.planName }}',
    startDate: '{{ params.startDate }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  SUBSCRIPTION_PAYMENT_CONFIRMATION: {
    customerName: '{{ params.customerName }}',
    price: '{{ params.price }}',
    nextBillingDate: '{{ params.nextBillingDate }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  SUBSCRIPTION_CANCELLATION: {
    customerName: '{{ params.customerName }}',
    planName: '{{ params.planName }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  TRIAL_STARTED: {
    customerName: '{{ params.customerName }}',
    planName: '{{ params.planName }}',
    price: '{{ params.price }}',
    trialEndDate: '{{ params.trialEndDate }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  TRIAL_ENDING_REMINDER: {
    customerName: '{{ params.customerName }}',
    planName: '{{ params.planName }}',
    price: '{{ params.price }}',
    daysRemaining: '{{ params.daysRemaining }}' as unknown as number,
    trialEndDate: '{{ params.trialEndDate }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  TRIAL_CHARGE_FAILED: {
    customerName: '{{ params.customerName }}',
    planName: '{{ params.planName }}',
    failureReason: '{{ params.failureReason }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  SUBSCRIPTION_PAYMENT_FAILED: {
    customerName: '{{ params.customerName }}',
    price: '{{ params.price }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  SUBSCRIPTION_EXPIRING: {
    customerName: '{{ params.customerName }}',
    nextBillingDate: '{{ params.nextBillingDate }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  SUBSCRIPTION_UPGRADED: {
    customerName: '{{ params.customerName }}',
    planName: '{{ params.planName }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  SUBSCRIPTION_DOWNGRADED: {
    customerName: '{{ params.customerName }}',
    planName: '{{ params.planName }}',
    actionUrl: '{{ params.actionUrl }}'
  },
  // Documents
  INVOICE_DOCUMENT_SENT: {
    customerName: '{{ params.customerName }}',
    documentName: '{{ params.documentName }}',
    invoiceUrl: '{{ params.invoiceUrl }}',
    actionUrl: '{{ params.actionUrl }}'
  }
};

// Template metadata with Brevo template IDs - synced with backend emailHandler.ts
const TEMPLATE_BREVO_IDS: Record<EmailType, number> = {
  // Authentication & Account
  SIGNUP_CONFIRMATION_LEGACY: 1,
  PASSWORD_RESET: 14,
  WELCOME_SIGNUP: 13,
  EMAIL_VERIFICATION: 15,
  ACCOUNT_DEACTIVATION: 16,
  // Transactions
  PURCHASE_CONFIRMATION: 17,
  PAYOUT_CONFIRMATION: 18,
  REFUND_CONFIRMATION: 19,
  ORDER_CANCELLED: 20,
  // Bookings
  NEW_BOOKING_VENDOR: 21,
  BOOKING_CONFIRMED_CUSTOMER: 22,
  BOOKING_REMINDER: 23,
  BOOKING_CANCELLED_CUSTOMER: 24,
  BOOKING_CANCELLED_VENDOR: 25,
  BOOKING_MODIFIED: 26,
  // Reviews
  REQUEST_REVIEW: 27,
  // Subscriptions
  SUBSCRIPTION_ACTIVATED: 28,
  SUBSCRIPTION_PAYMENT_CONFIRMATION: 29,
  SUBSCRIPTION_CANCELLATION: 30,
  TRIAL_STARTED: 31,
  TRIAL_ENDING_REMINDER: 32,
  TRIAL_CHARGE_FAILED: 33,
  SUBSCRIPTION_PAYMENT_FAILED: 34,
  SUBSCRIPTION_EXPIRING: 35,
  SUBSCRIPTION_UPGRADED: 36,
  SUBSCRIPTION_DOWNGRADED: 38,
  // Documents
  INVOICE_DOCUMENT_SENT: 37
};

// Editable template text content
interface TemplateTextContent {
  title: string;
  greeting: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  footerText: string;
}

const DEFAULT_TEMPLATE_TEXT: Record<EmailType, TemplateTextContent> = {
  // Authentication & Account
  SIGNUP_CONFIRMATION_LEGACY: {
    title: 'אישור הרשמה',
    greeting: 'היי',
    body: 'נרשמת בהצלחה ל-StudioZ. זהו אימייל אישור מהמערכת הקודמת שלנו.',
    ctaText: 'מעבר לאתר →',
    ctaUrl: 'https://studioz.co.il',
    footerText: ''
  },
  PASSWORD_RESET: {
    title: 'איפוס סיסמה',
    greeting: 'היי',
    body: 'ביקשת לאפס את הסיסמה שלך. השתמש בקישור למטה כדי להמשיך.',
    ctaText: 'איפוס סיסמה →',
    ctaUrl: '{{ params.resetLink }}',
    footerText: 'אם לא ביקשת איפוס סיסמה, התעלם מהודעה זו.'
  },
  WELCOME_SIGNUP: {
    title: 'ברוכים הבאים ל-StudioZ!',
    greeting: 'היי',
    body: 'אנחנו שמחים שהצטרפת אלינו! גלה את הסטודיו המושלם ליצירה הבאה שלך.',
    ctaText: 'גלה סטודיואים →',
    ctaUrl: 'https://studioz.co.il/studios',
    footerText: ''
  },
  EMAIL_VERIFICATION: {
    title: 'אימות כתובת אימייל',
    greeting: 'היי',
    body: 'אנא אמת את כתובת האימייל שלך כדי להשלים את תהליך ההרשמה.',
    ctaText: 'אימות אימייל →',
    ctaUrl: '{{ params.verificationLink }}',
    footerText: ''
  },
  ACCOUNT_DEACTIVATION: {
    title: 'חשבונך בוטל',
    greeting: 'היי',
    body: 'חשבונך ב-StudioZ בוטל בהצלחה. אנחנו מצטערים לראות אותך עוזב.',
    ctaText: 'מעבר לאתר →',
    ctaUrl: 'https://studioz.co.il',
    footerText: 'אם זו טעות, צור איתנו קשר.'
  },
  // Transactions
  PURCHASE_CONFIRMATION: {
    title: 'אישור רכישה',
    greeting: 'היי',
    body: 'תודה על הרכישה! ההזמנה שלך התקבלה ומעובדת.',
    ctaText: 'צפייה בהזמנה →',
    ctaUrl: '{{ params.orderUrl }}',
    footerText: ''
  },
  PAYOUT_CONFIRMATION: {
    title: 'אישור תשלום (Payout)',
    greeting: 'היי',
    body: 'התשלום עבור ההזמנות שלך הועבר לחשבונך.',
    ctaText: 'צפייה בפרטים →',
    ctaUrl: '{{ params.payoutUrl }}',
    footerText: ''
  },
  REFUND_CONFIRMATION: {
    title: 'אישור החזר כספי',
    greeting: 'היי',
    body: 'בוצע החזר כספי עבור הזמנתך.',
    ctaText: 'צפייה בפרטים →',
    ctaUrl: '{{ params.refundUrl }}',
    footerText: ''
  },
  ORDER_CANCELLED: {
    title: 'ההזמנה בוטלה',
    greeting: 'היי',
    body: 'הזמנתך בוטלה בהצלחה. אם בוצע תשלום, הזיכוי יבוצע בהתאם למדיניות הביטולים.',
    ctaText: 'מעבר לסטודיואים →',
    ctaUrl: 'https://studioz.co.il/studios',
    footerText: ''
  },
  // Bookings
  NEW_BOOKING_VENDOR: {
    title: 'הזמנה חדשה התקבלה',
    greeting: 'היי',
    body: 'יש לך הזמנה חדשה בסטודיו {studioName}.',
    ctaText: 'צפייה בהזמנה →',
    ctaUrl: '{{ params.bookingUrl }}',
    footerText: 'אתה מקבל הודעה זו כי הסטודיו בבעלותך.'
  },
  BOOKING_CONFIRMED_CUSTOMER: {
    title: 'הזמנתך אושרה',
    greeting: 'היי',
    body: 'הזמנתך לסטודיו {studioName} אושרה.',
    ctaText: 'צפייה / ניהול הזמנה →',
    ctaUrl: '{{ params.bookingUrl }}',
    footerText: 'צריכים עזרה? שלחו מייל או התקשרו אלינו בכל זמן.'
  },
  BOOKING_REMINDER: {
    title: 'תזכורת להזמנה',
    greeting: 'היי',
    body: 'הסשן שלך מתחיל בקרוב! אל תשכח להגיע בזמן.',
    ctaText: 'צפייה בפרטים →',
    ctaUrl: '{{ params.bookingUrl }}',
    footerText: ''
  },
  BOOKING_CANCELLED_CUSTOMER: {
    title: 'ההזמנה בוטלה',
    greeting: 'היי',
    body: 'לצערנו, ההזמנה שלך בוטלה. אם שילמת, ההחזר יבוצע בהתאם למדיניות הביטולים.',
    ctaText: 'מעבר לסטודיואים →',
    ctaUrl: 'https://studioz.co.il/studios',
    footerText: ''
  },
  BOOKING_CANCELLED_VENDOR: {
    title: 'הזמנה בוטלה',
    greeting: 'היי',
    body: 'אחת ההזמנות לסטודיו שלך בוטלה על ידי הלקוח.',
    ctaText: 'מעבר לדאשבורד →',
    ctaUrl: 'https://studioz.co.il/dashboard',
    footerText: ''
  },
  BOOKING_MODIFIED: {
    title: 'פרטי ההזמנה עודכנו',
    greeting: 'היי',
    body: 'חל שינוי בפרטי ההזמנה שלך.',
    ctaText: 'צפייה בפרטים →',
    ctaUrl: '{{ params.bookingUrl }}',
    footerText: ''
  },
  // Reviews
  REQUEST_REVIEW: {
    title: 'איך היה בסטודיו?',
    greeting: 'היי',
    body: 'נשמח לשמוע על החוויה שלך! הדירוג שלך עוזר ליוצרים אחרים.',
    ctaText: 'השאר ביקורת →',
    ctaUrl: '{{ params.reviewUrl }}',
    footerText: ''
  },
  // Subscriptions
  SUBSCRIPTION_ACTIVATED: {
    title: 'המינוי שלך הופעל',
    greeting: 'היי',
    body: 'ברוכים הבאים לתוכנית {planName}!',
    ctaText: 'מעבר לפרופיל →',
    ctaUrl: 'https://studioz.co.il/profile',
    footerText: ''
  },
  SUBSCRIPTION_PAYMENT_CONFIRMATION: {
    title: 'אישור תשלום מינוי',
    greeting: 'היי',
    body: 'התשלום התקופתי עבור המינוי שלך עובד בהצלחה.',
    ctaText: 'צפייה בפרטים →',
    ctaUrl: 'https://studioz.co.il/profile/subscription',
    footerText: ''
  },
  SUBSCRIPTION_CANCELLATION: {
    title: 'המינוי בוטל',
    greeting: 'היי',
    body: 'המינוי שלך בוטל לבקשתך. תוכל להמשיך להשתמש בשירות עד סוף תקופת החיוב הנוכחית.',
    ctaText: 'מעבר לאתר →',
    ctaUrl: 'https://studioz.co.il',
    footerText: ''
  },
  TRIAL_STARTED: {
    title: 'תקופת הניסיון שלך התחילה!',
    greeting: 'היי',
    body: 'ברוך הבא ל-StudioZ! תקופת הניסיון שלך לתוכנית {planName} הופעלה בהצלחה. עכשיו זה הזמן להפיח חיים ביצירה שלך.',
    ctaText: 'התחלת עבודה →',
    ctaUrl: 'https://studioz.co.il/dashboard',
    footerText: ''
  },
  TRIAL_ENDING_REMINDER: {
    title: 'תקופת הניסיון שלך עומדת להסתיים',
    greeting: 'היי',
    body: 'רצינו להזכיר שתקופת הניסיון שלך לתוכנית {planName} מסתיימת בעוד {daysRemaining} ימים.',
    ctaText: 'ניהול מינוי →',
    ctaUrl: 'https://studioz.co.il/profile/subscription',
    footerText: 'אם אתה נהנה מהשירות, אין צורך לבצע אף פעולה.'
  },
  TRIAL_CHARGE_FAILED: {
    title: 'פעולה נדרשת: התשלום נכשל',
    greeting: 'היי',
    body: 'לא הצלחנו לעבד את התשלום עבור המינוי שלך לתוכנית {planName} לאחר סיום תקופת הניסיון.',
    ctaText: 'עדכון פרטי תשלום →',
    ctaUrl: 'https://studioz.co.il/profile/billing',
    footerText: 'אנא עדכן את פרטי התשלום שלך בהקדם כדי למנוע השהיה של השירות.'
  },
  SUBSCRIPTION_PAYMENT_FAILED: {
    title: 'חיוב מינוי נכשל',
    greeting: 'היי',
    body: 'ניסיון החיוב עבור המינוי שלך נכשל.',
    ctaText: 'עדכון פרטי תשלום →',
    ctaUrl: 'https://studioz.co.il/profile/billing',
    footerText: ''
  },
  SUBSCRIPTION_EXPIRING: {
    title: 'המינוי עומד להסתיים',
    greeting: 'היי',
    body: 'המינוי שלך עומד לפוג בקרוב. הקפד לחדש אותו.',
    ctaText: 'חידוש מינוי →',
    ctaUrl: 'https://studioz.co.il/profile/subscription',
    footerText: ''
  },
  SUBSCRIPTION_UPGRADED: {
    title: 'המינוי שודרג!',
    greeting: 'היי',
    body: 'שדרגת בהצלחה לתוכנית {planName}.',
    ctaText: 'מעבר לפרופיל →',
    ctaUrl: 'https://studioz.co.il/profile',
    footerText: ''
  },
  SUBSCRIPTION_DOWNGRADED: {
    title: 'המינוי שונה',
    greeting: 'היי',
    body: 'המינוי שלך שונה לתוכנית {planName}.',
    ctaText: 'מעבר לפרופיל →',
    ctaUrl: 'https://studioz.co.il/profile',
    footerText: ''
  },
  // Documents
  INVOICE_DOCUMENT_SENT: {
    title: 'מסמך חדש נשלח אליך',
    greeting: 'היי',
    body: 'נשלח אליך מסמך חדש: {documentName}. תוכל לצפות בו ולהורידו בקישור המצורף.',
    ctaText: 'צפייה במסמך →',
    ctaUrl: '{{ params.documentUrl }}',
    footerText: ''
  }
};

// LocalStorage key for template text
const TEMPLATE_TEXT_STORAGE_KEY = 'studioz_email_template_text';

// Load template text from localStorage (with defaults)
const loadTemplateText = (): Record<EmailType, TemplateTextContent> => {
  try {
    const stored = localStorage.getItem(TEMPLATE_TEXT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all fields exist
      return Object.keys(DEFAULT_TEMPLATE_TEXT).reduce(
        (acc, key) => {
          acc[key as EmailType] = {
            ...DEFAULT_TEMPLATE_TEXT[key as EmailType],
            ...(parsed[key] || {})
          };
          return acc;
        },
        {} as Record<EmailType, TemplateTextContent>
      );
    }
  } catch (e) {
    console.error('Error loading template text:', e);
  }
  return { ...DEFAULT_TEMPLATE_TEXT };
};

// Save template text to localStorage
const saveTemplateText = (text: Record<EmailType, TemplateTextContent>): void => {
  try {
    localStorage.setItem(TEMPLATE_TEXT_STORAGE_KEY, JSON.stringify(text));
  } catch (e) {
    console.error('Error saving template text:', e);
  }
};

const EMAIL_TYPE_INFO: Record<
  EmailType,
  {
    label: string;
    description: string;
    icon: React.ElementType;
    variant?: 'default' | 'danger' | 'warning' | 'success' | 'info';
    category: string;
  }
> = {
  // Authentication & Account
  SIGNUP_CONFIRMATION_LEGACY: {
    label: 'אישור הרשמה (Legacy)',
    description: 'אימייל אישור מהמערכת הקודמת',
    icon: MailIcon,
    category: 'חשבון'
  },
  PASSWORD_RESET: {
    label: 'איפוס סיסמה',
    description: 'נשלח כשמבקשים איפוס סיסמה',
    icon: LockIcon,
    variant: 'warning',
    category: 'חשבון'
  },
  WELCOME_SIGNUP: {
    label: 'ברוכים הבאים',
    description: 'נשלח ללקוחות חדשים',
    icon: SparklesIcon,
    variant: 'success',
    category: 'חשבון'
  },
  EMAIL_VERIFICATION: {
    label: 'אימות אימייל',
    description: 'נשלח לאימות כתובת אימייל',
    icon: ShieldIcon,
    variant: 'info',
    category: 'חשבון'
  },
  ACCOUNT_DEACTIVATION: {
    label: 'ביטול חשבון',
    description: 'נשלח כשמבטלים חשבון',
    icon: CancelIcon,
    variant: 'danger',
    category: 'חשבון'
  },
  // Transactions
  PURCHASE_CONFIRMATION: {
    label: 'אישור רכישה',
    description: 'נשלח לאחר רכישה מוצלחת',
    icon: CheckCircle2Icon,
    variant: 'success',
    category: 'עסקאות'
  },
  PAYOUT_CONFIRMATION: {
    label: 'אישור תשלום לספק',
    description: 'נשלח לבעל סטודיו לאחר העברת תשלום',
    icon: DollarIcon,
    variant: 'success',
    category: 'עסקאות'
  },
  REFUND_CONFIRMATION: {
    label: 'אישור החזר כספי',
    description: 'נשלח לאחר ביצוע החזר',
    icon: RefreshIcon,
    variant: 'info',
    category: 'עסקאות'
  },
  ORDER_CANCELLED: {
    label: 'ביטול הזמנה',
    description: 'נשלח כשמבטלים הזמנה',
    icon: CancelIcon,
    variant: 'danger',
    category: 'עסקאות'
  },
  // Bookings
  NEW_BOOKING_VENDOR: {
    label: 'הזמנה חדשה לבעלים',
    description: 'נשלח לבעל הסטודיו כשמתקבלת הזמנה',
    icon: NotificationsIcon,
    variant: 'warning',
    category: 'הזמנות'
  },
  BOOKING_CONFIRMED_CUSTOMER: {
    label: 'אישור הזמנה ללקוח',
    description: 'נשלח ללקוח לאחר אישור ההזמנה',
    icon: CheckCircle2Icon,
    variant: 'success',
    category: 'הזמנות'
  },
  BOOKING_REMINDER: {
    label: 'תזכורת להזמנה',
    description: 'נשלח לפני מועד ההזמנה',
    icon: ClockIcon,
    variant: 'info',
    category: 'הזמנות'
  },
  BOOKING_CANCELLED_CUSTOMER: {
    label: 'ביטול הזמנה (ללקוח)',
    description: 'נשלח ללקוח כשהזמנה מבוטלת',
    icon: CancelIcon,
    variant: 'danger',
    category: 'הזמנות'
  },
  BOOKING_CANCELLED_VENDOR: {
    label: 'ביטול הזמנה (לספק)',
    description: 'נשלח לספק כשהזמנה מבוטלת',
    icon: CancelIcon,
    variant: 'danger',
    category: 'הזמנות'
  },
  BOOKING_MODIFIED: {
    label: 'עדכון הזמנה',
    description: 'נשלח כשמעדכנים פרטי הזמנה',
    icon: SettingsIcon,
    variant: 'info',
    category: 'הזמנות'
  },
  // Reviews
  REQUEST_REVIEW: {
    label: 'בקשה לביקורת',
    description: 'נשלח לאחר ביקור בסטודיו',
    icon: StarIcon,
    variant: 'success',
    category: 'ביקורות'
  },
  // Subscriptions
  SUBSCRIPTION_ACTIVATED: {
    label: 'הפעלת מינוי',
    description: 'נשלח לאחר הפעלת מינוי חדש',
    icon: CreditCardIcon,
    variant: 'success',
    category: 'מינויים'
  },
  SUBSCRIPTION_PAYMENT_CONFIRMATION: {
    label: 'אישור תשלום מינוי',
    description: 'נשלח לאחר חיוב תקופתי',
    icon: CheckCircle2Icon,
    variant: 'success',
    category: 'מינויים'
  },
  SUBSCRIPTION_CANCELLATION: {
    label: 'ביטול מינוי',
    description: 'נשלח כשמבטלים מינוי',
    icon: CancelIcon,
    variant: 'danger',
    category: 'מינויים'
  },
  TRIAL_STARTED: {
    label: 'תחילת ניסיון',
    description: 'נשלח בתחילת תקופת הניסיון',
    icon: PlayCircleIcon,
    variant: 'success',
    category: 'מינויים'
  },
  TRIAL_ENDING_REMINDER: {
    label: 'תזכורת סיום ניסיון',
    description: 'נשלח לפני סיום תקופת הניסיון',
    icon: AlertTriangleIcon,
    variant: 'warning',
    category: 'מינויים'
  },
  TRIAL_CHARGE_FAILED: {
    label: 'כשל בחיוב ניסיון',
    description: 'נשלח כשהתשלום אחרי ניסיון נכשל',
    icon: AlertTriangleIcon,
    variant: 'danger',
    category: 'מינויים'
  },
  SUBSCRIPTION_PAYMENT_FAILED: {
    label: 'כשל בחיוב מינוי',
    description: 'נשלח כשחיוב תקופתי נכשל',
    icon: AlertTriangleIcon,
    variant: 'danger',
    category: 'מינויים'
  },
  SUBSCRIPTION_EXPIRING: {
    label: 'מינוי עומד לפוג',
    description: 'נשלח לפני תפוגת מינוי',
    icon: ClockIcon,
    variant: 'warning',
    category: 'מינויים'
  },
  SUBSCRIPTION_UPGRADED: {
    label: 'שדרוג מינוי',
    description: 'נשלח לאחר שדרוג תוכנית',
    icon: SparklesIcon,
    variant: 'success',
    category: 'מינויים'
  },
  SUBSCRIPTION_DOWNGRADED: {
    label: 'שינוי מינוי',
    description: 'נשלח לאחר שנמוך תוכנית',
    icon: InfoIcon,
    variant: 'info',
    category: 'מינויים'
  },
  // Documents
  INVOICE_DOCUMENT_SENT: {
    label: 'שליחת מסמך',
    description: 'נשלח עם חשבונית או קבלה',
    icon: FileTextIcon,
    variant: 'info',
    category: 'מסמכים'
  }
};

// Email Template Shared Components
const EmailWrapper = ({ children, mode = 'dark' }: { children: React.ReactNode; mode?: ThemeMode }) => {
  const isLight = mode === 'light';
  return (
    <div className={`email-preview-container ${isLight ? 'email-preview-container--light' : ''}`} dir="rtl">
      <div className={`email-preview-card ${isLight ? 'email-preview-card--light' : ''}`}>{children}</div>
    </div>
  );
};

const EmailHeader = ({
  title,
  icon: Icon,
  mode = 'dark',
  variant = 'default'
}: {
  title: string;
  icon: React.ElementType;
  mode?: ThemeMode;
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info';
}) => {
  const isLight = mode === 'light';
  let iconClass = 'email-header__icon';
  if (variant === 'danger') iconClass += ' email-header__icon--danger';
  if (variant === 'warning') iconClass += ' email-header__icon--warning';
  if (variant === 'success') iconClass += ' email-header__icon--success';
  if (variant === 'info') iconClass += ' email-header__icon--info';

  return (
    <div className={`email-header ${isLight ? 'email-header--light' : ''}`}>
      <h1 className={`email-header__title ${isLight ? 'email-header__title--light' : ''}`}>{title}</h1>
      <div className={iconClass}>
        <Icon sx={{ fontSize: 24 }} />
      </div>
    </div>
  );
};

const EmailDetailRow = ({
  label,
  value,
  icon: Icon,
  mode = 'dark'
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  mode?: ThemeMode;
}) => {
  const isLight = mode === 'light';
  return (
    <div className={`email-detail-row ${isLight ? 'email-detail-row--light' : ''}`}>
      <div className="email-detail-row__label">
        <Icon sx={{ fontSize: 16 }} className="email-detail-row__icon" />
        <span>{label}</span>
      </div>
      <span className={`email-detail-row__value ${isLight ? 'email-detail-row__value--light' : ''}`}>{value}</span>
    </div>
  );
};

const EmailFooter = ({ studioName = 'StudioZ', mode = 'dark' }: { studioName?: string; mode?: ThemeMode }) => {
  const isLight = mode === 'light';
  return (
    <div className={`email-footer ${isLight ? 'email-footer--light' : ''}`}>
      <div className="email-footer__logo">
        <img src="https://www.studioz.co.il/logo.png" alt="StudioZ" className="email-footer__logo-img" />
        <span className={`email-footer__brand ${isLight ? 'email-footer__brand--light' : ''}`}>STUDIOZ</span>
      </div>
      <p className="email-footer__copyright">
        © {new Date().getFullYear()} {studioName} — תודה שאתם חלק מהקהילה היצירתית שלנו.
      </p>
    </div>
  );
};

const EmailActionButton = ({
  href,
  label,
  variant = 'primary'
}: {
  href?: string;
  label: string;
  variant?: 'primary' | 'danger';
}) => {
  return (
    <a href={href} className={`email-action-btn ${variant === 'danger' ? 'email-action-btn--danger' : ''}`}>
      <span>{label}</span>
      <ExternalLinkIcon sx={{ fontSize: 16 }} />
    </a>
  );
};

// Individual Email Templates (exported for potential reuse)
export const ReservationConfirmedEmail = ({ data, mode = 'dark' }: { data: EmailData; mode?: ThemeMode }) => {
  const isLight = mode === 'light';
  return (
    <EmailWrapper mode={mode}>
      <EmailHeader title="ההזמנה שלך אושרה" icon={CheckCircle2Icon} mode={mode} />
      <div className="email-body">
        <div className="email-greeting">
          <p className={`email-greeting__name ${isLight ? 'email-greeting__name--light' : ''}`}>
            היי {data.customerName},
          </p>
          <p className={`email-greeting__text ${isLight ? 'email-greeting__text--light' : ''}`}>
            תודה שהזמנת את <span className="email-text--bold">{data.experienceName}</span> בסטודיו{' '}
            <span className="email-text--brand">{data.studioName}</span>. הסשן היצירתי שלך משוריין!
          </p>
        </div>
        <div className={`email-details-card ${isLight ? 'email-details-card--light' : ''}`}>
          <EmailDetailRow
            label="תאריך ושעה"
            value={`${data.dateTime} (${data.duration})`}
            icon={CalendarIcon}
            mode={mode}
          />
          <EmailDetailRow label="מיקום" value={data.location || ''} icon={LocationIcon} mode={mode} />
          <EmailDetailRow label="סך הכל שולם" value={data.totalPaid || ''} icon={CreditCardIcon} mode={mode} />
          <EmailDetailRow label="מספר הזמנה" value={data.reservationId || ''} icon={HashIcon} mode={mode} />
          <EmailDetailRow label="הערות" value={data.notes || 'אין'} icon={FileTextIcon} mode={mode} />
        </div>
        <div className="email-actions">
          <EmailActionButton href={data.actionUrl} label="צפייה / ניהול הזמנה" />
          <p className="email-actions__helper">צריכים עזרה? שלחו מייל או התקשרו אלינו בכל זמן.</p>
        </div>
      </div>
      <EmailFooter studioName={data.studioName} mode={mode} />
    </EmailWrapper>
  );
};

export const NewReservationOwnerEmail = ({ data, mode = 'dark' }: { data: EmailData; mode?: ThemeMode }) => {
  const isLight = mode === 'light';
  return (
    <EmailWrapper mode={mode}>
      <EmailHeader title="הזמנה חדשה התקבלה" icon={SparklesIcon} mode={mode} />
      <div className="email-body">
        <div className="email-greeting">
          <p className={`email-greeting__name ${isLight ? 'email-greeting__name--light' : ''}`}>
            היי {data.ownerName},
          </p>
          <p className={`email-greeting__text ${isLight ? 'email-greeting__text--light' : ''}`}>
            יש לך הזמנה חדשה בסטודיו <span className="email-text--brand">{data.studioName}</span>. הגיע הזמן להכין את
            הסטודיו!
          </p>
        </div>
        <div className={`email-details-card ${isLight ? 'email-details-card--light' : ''}`}>
          <EmailDetailRow label="חוויה" value={data.experienceName || ''} icon={SparklesIcon} mode={mode} />
          <EmailDetailRow
            label="תאריך ושעה"
            value={`${data.dateTime} (${data.duration})`}
            icon={CalendarIcon}
            mode={mode}
          />
          <EmailDetailRow label="אורח" value={data.customerName || ''} icon={UserLucideIcon} mode={mode} />
          <EmailDetailRow
            label="פרטי קשר"
            value={`${data.guestEmail} • ${data.guestPhone}`}
            icon={MailIcon}
            mode={mode}
          />
          <EmailDetailRow label="סך הכל" value={data.totalPaid || ''} icon={CreditCardIcon} mode={mode} />
          <EmailDetailRow label="מספר הזמנה" value={data.reservationId || ''} icon={HashIcon} mode={mode} />
          <EmailDetailRow label="מיקום" value={data.location || ''} icon={LocationIcon} mode={mode} />
          <EmailDetailRow label="הערות" value={data.notes || 'אין'} icon={FileTextIcon} mode={mode} />
        </div>
        <div className="email-actions">
          <EmailActionButton href={data.actionUrl} label="צפייה בהזמנה" />
          <p className="email-actions__helper">אתה מקבל הודעה זו כי הסטודיו בבעלותך.</p>
        </div>
      </div>
      <EmailFooter studioName={data.studioName} mode={mode} />
    </EmailWrapper>
  );
};

export const SubscriptionConfirmedEmail = ({ data, mode = 'dark' }: { data: EmailData; mode?: ThemeMode }) => {
  const isLight = mode === 'light';
  return (
    <EmailWrapper mode={mode}>
      <EmailHeader title="המינוי שלך אושר" icon={CreditCardIcon} mode={mode} />
      <div className="email-body">
        <div className="email-greeting">
          <p className={`email-greeting__name ${isLight ? 'email-greeting__name--light' : ''}`}>
            היי {data.customerName},
          </p>
          <p className={`email-greeting__text ${isLight ? 'email-greeting__text--light' : ''}`}>
            תודה שהצטרפת לקהילת <span className="email-text--brand">StudioZ</span>! המינוי שלך פעיל כעת והמסע היצירתי
            שלך מתחיל כאן.
          </p>
        </div>
        <div className={`email-plan-highlight ${isLight ? 'email-plan-highlight--light' : ''}`}>
          <h2 className="email-plan-highlight__name">{data.planName}</h2>
          <div className="email-plan-highlight__price">
            <span className={`email-plan-highlight__amount ${isLight ? 'email-plan-highlight__amount--light' : ''}`}>
              ₪{data.price}
            </span>
            <span className="email-plan-highlight__period">/month</span>
          </div>
        </div>
        <div className={`email-details-card ${isLight ? 'email-details-card--light' : ''}`}>
          <EmailDetailRow label="מזהה מינוי" value={data.subscriptionId || ''} icon={HashIcon} mode={mode} />
          <EmailDetailRow label="תאריך התחלה" value={data.startDate || ''} icon={CalendarIcon} mode={mode} />
          <EmailDetailRow label="תאריך חיוב הבא" value={data.nextBillingDate || ''} icon={ClockIcon} mode={mode} />
        </div>
        <div className="email-actions">
          <EmailActionButton href={data.actionUrl} label="מעבר לפרופיל" />
        </div>
      </div>
      <EmailFooter mode={mode} />
    </EmailWrapper>
  );
};

export const TrialEndingReminderEmail = ({ data, mode = 'dark' }: { data: EmailData; mode?: ThemeMode }) => {
  const isLight = mode === 'light';
  return (
    <EmailWrapper mode={mode}>
      <EmailHeader title="תקופת הניסיון שלך עומדת להסתיים" icon={AlertTriangleIcon} mode={mode} variant="warning" />
      <div className="email-body">
        <div className="email-greeting">
          <p className={`email-greeting__name ${isLight ? 'email-greeting__name--light' : ''}`}>
            היי {data.customerName},
          </p>
          <p className={`email-greeting__text ${isLight ? 'email-greeting__text--light' : ''}`}>
            רצינו להזכיר שתקופת הניסיון שלך לתוכנית <span className="email-text--brand">{data.planName}</span> מסתיימת
            בעוד <span className="email-text--bold">{data.daysRemaining} ימים</span>.
          </p>
        </div>
        <div className={`email-alert-box email-alert-box--warning ${isLight ? 'email-alert-box--light' : ''}`}>
          <p>
            לאחר סיום תקופת הניסיון, תחויב אוטומטית בסך של <span className="email-text--bold">₪{data.price}</span>{' '}
            לחודש, אלא אם תבטל לפני ה-{data.trialEndDate}.
          </p>
        </div>
        <div className={`email-details-card ${isLight ? 'email-details-card--light' : ''}`}>
          <EmailDetailRow label="תוכנית" value={data.planName || ''} icon={CreditCardIcon} mode={mode} />
          <EmailDetailRow label="תאריך סיום ניסיון" value={data.trialEndDate || ''} icon={CalendarIcon} mode={mode} />
          <EmailDetailRow label="מחיר חודשי" value={`₪${data.price}`} icon={CreditCardIcon} mode={mode} />
        </div>
        <div className="email-actions">
          <EmailActionButton href={data.actionUrl} label="ניהול מינוי" />
          <p className="email-actions__helper">אם אתה נהנה מהשירות, אין צורך לבצע אף פעולה.</p>
        </div>
      </div>
      <EmailFooter mode={mode} />
    </EmailWrapper>
  );
};

export const TrialChargeFailedEmail = ({ data, mode = 'dark' }: { data: EmailData; mode?: ThemeMode }) => {
  const isLight = mode === 'light';
  return (
    <EmailWrapper mode={mode}>
      <EmailHeader title="פעולה נדרשת: התשלום נכשל" icon={AlertTriangleIcon} mode={mode} variant="danger" />
      <div className="email-body">
        <div className="email-greeting">
          <p className={`email-greeting__name ${isLight ? 'email-greeting__name--light' : ''}`}>
            היי {data.customerName},
          </p>
          <p className={`email-greeting__text ${isLight ? 'email-greeting__text--light' : ''}`}>
            לא הצלחנו לעבד את התשלום עבור המינוי שלך לתוכנית <span className="email-text--bold">{data.planName}</span>{' '}
            לאחר סיום תקופת הניסיון.
          </p>
        </div>
        <div className={`email-alert-box email-alert-box--danger ${isLight ? 'email-alert-box--light' : ''}`}>
          <div className="email-alert-box__header">
            <AlertTriangleIcon sx={{ fontSize: 16 }} />
            <span>סיבת הכישלון:</span>
          </div>
          <p>{data.failureReason || 'פרטי כרטיס לא מעודכנים או חוסר במסגרת אשראי'}</p>
        </div>
        <div className={`email-details-card ${isLight ? 'email-details-card--light' : ''}`}>
          <EmailDetailRow label="תוכנית" value={data.planName || ''} icon={CreditCardIcon} mode={mode} />
          <EmailDetailRow label="סכום לתשלום" value={`₪${data.price}`} icon={CreditCardIcon} mode={mode} />
          <EmailDetailRow label="מזהה מינוי" value={data.subscriptionId || ''} icon={HashIcon} mode={mode} />
        </div>
        <div className="email-actions">
          <EmailActionButton href={data.actionUrl} label="עדכון פרטי תשלום" variant="danger" />
          <p className="email-actions__helper">אנא עדכן את פרטי התשלום שלך בהקדם כדי למנוע השהיה של השירות.</p>
        </div>
      </div>
      <EmailFooter mode={mode} />
    </EmailWrapper>
  );
};

export const TrialStartedConfirmationEmail = ({ data, mode = 'dark' }: { data: EmailData; mode?: ThemeMode }) => {
  const isLight = mode === 'light';
  return (
    <EmailWrapper mode={mode}>
      <EmailHeader title="תקופת הניסיון שלך התחילה!" icon={PlayCircleIcon} mode={mode} />
      <div className="email-body">
        <div className="email-greeting">
          <p className={`email-greeting__name ${isLight ? 'email-greeting__name--light' : ''}`}>
            היי {data.customerName},
          </p>
          <p className={`email-greeting__text ${isLight ? 'email-greeting__text--light' : ''}`}>
            ברוך הבא ל-StudioZ! תקופת הניסיון שלך לתוכנית <span className="email-text--brand">{data.planName}</span>{' '}
            הופעלה בהצלחה. עכשיו זה הזמן להפיח חיים ביצירה שלך.
          </p>
        </div>
        <div className={`email-trial-highlight ${isLight ? 'email-trial-highlight--light' : ''}`}>
          <div className="email-trial-highlight__icon">
            <SparklesIcon sx={{ fontSize: 32 }} />
          </div>
          <h2 className={`email-trial-highlight__title ${isLight ? 'email-trial-highlight__title--light' : ''}`}>
            ניסיון ללא עלות
          </h2>
          <p className="email-trial-highlight__date">מסתיים ב-{data.trialEndDate}</p>
        </div>
        <div className={`email-details-card ${isLight ? 'email-details-card--light' : ''}`}>
          <EmailDetailRow label="תוכנית" value={data.planName || ''} icon={CreditCardIcon} mode={mode} />
          <EmailDetailRow label="תאריך סיום ניסיון" value={data.trialEndDate || ''} icon={CalendarIcon} mode={mode} />
          <EmailDetailRow label="מחיר לאחר הניסיון" value={`₪${data.price} לחודש`} icon={CreditCardIcon} mode={mode} />
        </div>
        <div className="email-actions">
          <EmailActionButton href={data.actionUrl} label="התחלת עבודה" />
        </div>
      </div>
      <EmailFooter mode={mode} />
    </EmailWrapper>
  );
};

// Email Template Renderer
const EmailTemplatePreview = ({
  type,
  mode,
  templateText
}: {
  type: EmailType;
  mode: ThemeMode;
  templateText?: TemplateTextContent;
}) => {
  const data = SAMPLE_EMAIL_DATA[type];
  const text = templateText || DEFAULT_TEMPLATE_TEXT[type];

  // Helper to process text and replace {variable} placeholders with actual sample values
  const processPreviewText = (inputText: string): React.ReactNode => {
    const parts = inputText.split(/(\{[^}]+\})/g);
    return parts.map((part, i) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        const varName = part.slice(1, -1);
        const value = (data as Record<string, unknown>)[varName];
        if (varName === 'studioName' || varName === 'planName') {
          return (
            <span key={i} className="email-text--brand">
              {String(value || varName)}
            </span>
          );
        }
        if (varName === 'experienceName' || varName === 'daysRemaining') {
          return (
            <span key={i} className="email-text--bold">
              {String(value || varName)}
            </span>
          );
        }
        return <span key={i}>{String(value || varName)}</span>;
      }
      return part;
    });
  };

  // Render preview with editable text
  const renderPreviewContent = () => {
    const isLight = mode === 'light';
    const info = EMAIL_TYPE_INFO[type];
    const Icon = info.icon;
    // Determine if this is a vendor/owner-facing template
    const isVendorTemplate =
      type === 'NEW_BOOKING_VENDOR' || type === 'BOOKING_CANCELLED_VENDOR' || type === 'PAYOUT_CONFIRMATION';
    const customerName = isVendorTemplate ? data.ownerName : data.customerName;

    return (
      <EmailWrapper mode={mode}>
        <EmailHeader title={text.title} icon={Icon} mode={mode} variant={info.variant} />
        <div className="email-body">
          <div className="email-greeting">
            <p className={`email-greeting__name ${isLight ? 'email-greeting__name--light' : ''}`}>
              {text.greeting} {customerName},
            </p>
            <p className={`email-greeting__text ${isLight ? 'email-greeting__text--light' : ''}`}>
              {processPreviewText(text.body)}
            </p>
          </div>

          {/* Booking templates */}
          {(type === 'BOOKING_CONFIRMED_CUSTOMER' || type === 'NEW_BOOKING_VENDOR') && (
            <div className={`email-details-card ${isLight ? 'email-details-card--light' : ''}`}>
              {type === 'NEW_BOOKING_VENDOR' && (
                <>
                  <EmailDetailRow label="לקוח" value={data.customerName || ''} icon={UserLucideIcon} mode={mode} />
                  <EmailDetailRow
                    label="פרטי קשר"
                    value={`${data.guestEmail} • ${data.guestPhone}`}
                    icon={MailIcon}
                    mode={mode}
                  />
                </>
              )}
              <EmailDetailRow label="שירות" value={data.serviceName || ''} icon={SparklesIcon} mode={mode} />
              <EmailDetailRow
                label="תאריך ושעה"
                value={`${data.dateTime} (${data.duration})`}
                icon={CalendarIcon}
                mode={mode}
              />
              {type === 'BOOKING_CONFIRMED_CUSTOMER' && (
                <>
                  <EmailDetailRow label="מיקום" value={data.location || ''} icon={LocationIcon} mode={mode} />
                  <EmailDetailRow label="סך הכל שולם" value={data.totalPaid || ''} icon={CreditCardIcon} mode={mode} />
                </>
              )}
            </div>
          )}

          {/* Subscription activation */}
          {type === 'SUBSCRIPTION_ACTIVATED' && (
            <>
              <div className={`email-plan-highlight ${isLight ? 'email-plan-highlight--light' : ''}`}>
                <h2 className="email-plan-highlight__name">{data.planName}</h2>
              </div>
              <div className={`email-details-card ${isLight ? 'email-details-card--light' : ''}`}>
                <EmailDetailRow label="תוכנית" value={data.planName || ''} icon={SparklesIcon} mode={mode} />
                <EmailDetailRow label="תאריך התחלה" value={data.startDate || ''} icon={CalendarIcon} mode={mode} />
              </div>
            </>
          )}

          {/* Trial & subscription payment templates */}
          {(type === 'TRIAL_ENDING_REMINDER' || type === 'TRIAL_CHARGE_FAILED' || type === 'TRIAL_STARTED') && (
            <>
              {type === 'TRIAL_ENDING_REMINDER' && (
                <div className={`email-alert-box email-alert-box--warning ${isLight ? 'email-alert-box--light' : ''}`}>
                  <p>
                    לאחר סיום תקופת הניסיון, תחויב אוטומטית בסך של{' '}
                    <span className="email-text--bold">₪{data.price}</span> לחודש, אלא אם תבטל לפני ה-
                    {data.trialEndDate}.
                  </p>
                </div>
              )}
              {type === 'TRIAL_CHARGE_FAILED' && (
                <div className={`email-alert-box email-alert-box--danger ${isLight ? 'email-alert-box--light' : ''}`}>
                  <div className="email-alert-box__header">
                    <AlertTriangleIcon sx={{ fontSize: 16 }} />
                    <span>סיבת הכישלון:</span>
                  </div>
                  <p>{data.failureReason || 'פרטי כרטיס לא מעודכנים או חוסר במסגרת אשראי'}</p>
                </div>
              )}
              {type === 'TRIAL_STARTED' && (
                <div className={`email-trial-highlight ${isLight ? 'email-trial-highlight--light' : ''}`}>
                  <div className="email-trial-highlight__icon">
                    <SparklesIcon sx={{ fontSize: 32 }} />
                  </div>
                  <h2
                    className={`email-trial-highlight__title ${isLight ? 'email-trial-highlight__title--light' : ''}`}
                  >
                    ניסיון ללא עלות
                  </h2>
                  <p className="email-trial-highlight__date">מסתיים ב-{data.trialEndDate}</p>
                </div>
              )}
              <div className={`email-details-card ${isLight ? 'email-details-card--light' : ''}`}>
                <EmailDetailRow label="תוכנית" value={data.planName || ''} icon={CreditCardIcon} mode={mode} />
                <EmailDetailRow
                  label="תאריך סיום ניסיון"
                  value={data.trialEndDate || ''}
                  icon={CalendarIcon}
                  mode={mode}
                />
                <EmailDetailRow
                  label={type === 'TRIAL_CHARGE_FAILED' ? 'סכום לתשלום' : 'מחיר חודשי'}
                  value={`₪${data.price}`}
                  icon={CreditCardIcon}
                  mode={mode}
                />
              </div>
            </>
          )}

          {/* Generic templates with simple details */}
          {[
            'PASSWORD_RESET',
            'EMAIL_VERIFICATION',
            'PURCHASE_CONFIRMATION',
            'PAYOUT_CONFIRMATION',
            'REFUND_CONFIRMATION',
            'ORDER_CANCELLED',
            'BOOKING_REMINDER',
            'BOOKING_MODIFIED',
            'SUBSCRIPTION_PAYMENT_CONFIRMATION',
            'SUBSCRIPTION_PAYMENT_FAILED',
            'SUBSCRIPTION_EXPIRING',
            'INVOICE_DOCUMENT_SENT'
          ].includes(type) && (
            <div className={`email-details-card ${isLight ? 'email-details-card--light' : ''}`}>
              {type === 'PASSWORD_RESET' && (
                <EmailDetailRow label="מזהה בקשה" value={data.reservationId || ''} icon={HashIcon} mode={mode} />
              )}
              {type === 'EMAIL_VERIFICATION' && (
                <EmailDetailRow label="קוד אימות" value={data.verificationCode || ''} icon={LockIcon} mode={mode} />
              )}
              {type === 'PURCHASE_CONFIRMATION' && (
                <>
                  <EmailDetailRow label="מספר הזמנה" value={data.orderNumber || ''} icon={HashIcon} mode={mode} />
                  <EmailDetailRow label="סכום" value={data.totalPaid || ''} icon={CreditCardIcon} mode={mode} />
                </>
              )}
              {type === 'PAYOUT_CONFIRMATION' && (
                <EmailDetailRow label="סכום הזיכוי" value={data.payoutAmount || ''} icon={DollarIcon} mode={mode} />
              )}
              {type === 'REFUND_CONFIRMATION' && (
                <EmailDetailRow label="סכום ההחזר" value={data.refundAmount || ''} icon={CreditCardIcon} mode={mode} />
              )}
              {type === 'ORDER_CANCELLED' && (
                <>
                  <EmailDetailRow label="מספר הזמנה" value={data.reservationId || ''} icon={HashIcon} mode={mode} />
                  <EmailDetailRow label="סטודיו" value={data.studioName || ''} icon={LocationIcon} mode={mode} />
                </>
              )}
              {type === 'BOOKING_REMINDER' && (
                <>
                  <EmailDetailRow label="סטודיו" value={data.studioName || ''} icon={LocationIcon} mode={mode} />
                  <EmailDetailRow label="מועד" value={data.dateTime || ''} icon={CalendarIcon} mode={mode} />
                </>
              )}
              {type === 'SUBSCRIPTION_PAYMENT_CONFIRMATION' && (
                <>
                  <EmailDetailRow label="סכום" value={data.price || ''} icon={CreditCardIcon} mode={mode} />
                  <EmailDetailRow
                    label="תאריך חיוב הבא"
                    value={data.nextBillingDate || ''}
                    icon={ClockIcon}
                    mode={mode}
                  />
                </>
              )}
              {type === 'SUBSCRIPTION_PAYMENT_FAILED' && (
                <EmailDetailRow label="סכום" value={data.price || ''} icon={CreditCardIcon} mode={mode} />
              )}
              {type === 'SUBSCRIPTION_EXPIRING' && (
                <EmailDetailRow
                  label="תאריך תפוגה"
                  value={data.nextBillingDate || ''}
                  icon={CalendarIcon}
                  mode={mode}
                />
              )}
              {type === 'INVOICE_DOCUMENT_SENT' && (
                <>
                  <EmailDetailRow label="שם המסמך" value={data.documentName || ''} icon={FileTextIcon} mode={mode} />
                  <EmailDetailRow label="צפייה במסמך" value="לחץ כאן" icon={ExternalLinkIcon} mode={mode} />
                </>
              )}
              {type === 'BOOKING_MODIFIED' && (
                <EmailDetailRow label="מספר הזמנה" value={data.reservationId || ''} icon={HashIcon} mode={mode} />
              )}
            </div>
          )}

          {/* Upgrade/Downgrade templates */}
          {(type === 'SUBSCRIPTION_UPGRADED' || type === 'SUBSCRIPTION_DOWNGRADED') && (
            <div className={`email-details-card ${isLight ? 'email-details-card--light' : ''}`}>
              <EmailDetailRow label="תוכנית" value={data.planName || ''} icon={SparklesIcon} mode={mode} />
            </div>
          )}

          <div className="email-actions">
            <EmailActionButton
              href={text.ctaUrl.startsWith('{{') ? data.actionUrl : text.ctaUrl}
              label={text.ctaText}
              variant={info.variant === 'danger' ? 'danger' : 'primary'}
            />
            {text.footerText && <p className="email-actions__helper">{text.footerText}</p>}
          </div>
        </div>
        <EmailFooter studioName={data.studioName} mode={mode} />
      </EmailWrapper>
    );
  };

  return renderPreviewContent();
};

// Generate Brevo-compatible HTML from the template
const generateBrevoHTML = (type: EmailType, mode: ThemeMode, templateText: TemplateTextContent): string => {
  const data = BREVO_VARIABLES[type];
  const isLight = mode === 'light';

  // Helper to replace {variable} placeholders with Brevo syntax
  const processText = (text: string): string => {
    return text
      .replace(/\{customerName\}/g, `{{ params.customerName }}`)
      .replace(/\{ownerName\}/g, `{{ params.ownerName }}`)
      .replace(
        /\{studioName\}/g,
        `</span><span style="font-weight: 700; color: #f7c041;">{{ params.studioName }}</span><span>`
      )
      .replace(
        /\{experienceName\}/g,
        `</span><span style="font-weight: 600; ${isLight ? 'color: #1c1917;' : 'color: #ffffff;'}">{{ params.experienceName }}</span><span>`
      )
      .replace(
        /\{planName\}/g,
        `</span><span style="font-weight: 700; color: #f7c041;">{{ params.planName }}</span><span>`
      )
      .replace(
        /\{daysRemaining\}/g,
        `</span><span style="font-weight: 600; ${isLight ? 'color: #1c1917;' : 'color: #ffffff;'}">{{ params.daysRemaining }}</span><span>`
      )
      .replace(/\{price\}/g, `{{ params.price }}`)
      .replace(/\{trialEndDate\}/g, `{{ params.trialEndDate }}`)
      .replace(/\{failureReason\}/g, `{{ params.failureReason }}`);
  };

  // Common styles
  const styles = {
    container: `font-family: 'DM Sans', Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; ${isLight ? 'background: #fafaf9;' : 'background: #18181b;'}`,
    card: `border-radius: 16px; overflow: hidden; ${isLight ? 'background: #ffffff; border: 1px solid #e7e5e4; box-shadow: 0 10px 40px rgba(0,0,0,0.08);' : 'background: #000000; border: 1px solid #27272a; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);'}`,
    header: `padding: 24px; display: flex; align-items: center; justify-content: space-between; ${isLight ? 'background: rgba(245,245,244,0.5); border-bottom: 1px solid #e7e5e4;' : 'background: rgba(39,39,42,0.5); border-bottom: 1px solid #27272a;'}`,
    headerTitle: `font-size: 24px; font-weight: 700; margin: 0; ${isLight ? 'color: #1c1917;' : 'color: #ffffff;'}`,
    headerIcon: `width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: #f7c041; box-shadow: 0 10px 25px -5px rgba(247,192,65,0.3); color: #000000;`,
    body: 'padding: 24px;',
    greeting: 'margin-bottom: 24px;',
    greetingName: `font-size: 20px; margin: 0 0 8px 0; ${isLight ? 'color: #1c1917;' : 'color: #ffffff;'}`,
    greetingText: `line-height: 1.7; margin: 0; ${isLight ? 'color: #57534e;' : 'color: #a1a1aa;'}`,
    detailsCard: `border-radius: 12px; padding: 20px; ${isLight ? 'background: #fafaf9; border: 1px solid #e7e5e4;' : 'background: rgba(39,39,42,0.2); border: 1px solid rgba(39,39,42,0.5);'}`,
    detailRow: `display: flex; align-items: flex-start; justify-content: space-between; padding: 12px 0; ${isLight ? 'border-bottom: 1px solid #e7e5e4;' : 'border-bottom: 1px solid #18181b;'}`,
    detailLabel: `font-size: 14px; font-weight: 500; ${isLight ? 'color: #57534e;' : 'color: #a1a1aa;'}`,
    detailValue: `font-size: 14px; font-weight: 600; text-align: left; ${isLight ? 'color: #1c1917;' : 'color: #ffffff;'}`,
    actionBtn: `display: inline-block; padding: 14px 32px; background: #f7c041; color: #000000; font-weight: 700; font-size: 14px; border-radius: 12px; text-decoration: none; box-shadow: 0 10px 25px -5px rgba(247,192,65,0.3);`,
    footer: `padding: 24px; text-align: center; ${isLight ? 'background: #f5f5f4; border-top: 1px solid #e7e5e4;' : 'background: rgba(39,39,42,0.3); border-top: 1px solid #18181b;'}`,
    footerBrand: `font-size: 14px; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 8px; ${isLight ? 'color: #1c1917;' : 'color: #ffffff;'}`,
    footerCopyright: 'font-size: 12px; color: #71717a; margin: 0;',
    brandHighlight: 'font-weight: 700; color: #f7c041;',
    textBold: `font-weight: 600; ${isLight ? 'color: #1c1917;' : 'color: #ffffff;'}`
  };

  // Generate template-specific content using editable templateText
  const { title, greeting, body, ctaText, ctaUrl, footerText } = templateText;
  const processedBody = processText(body);

  // Determine if this is a vendor/owner-facing template
  const isVendorTemplate =
    type === 'NEW_BOOKING_VENDOR' || type === 'BOOKING_CANCELLED_VENDOR' || type === 'PAYOUT_CONFIRMATION';
  const greetingSection = isVendorTemplate
    ? `<p style="${styles.greetingName}">${greeting} ${data.ownerName},</p>`
    : `<p style="${styles.greetingName}">${greeting} ${data.customerName},</p>`;

  // Icon mapping for templates
  const iconMap: Record<string, string> = {
    SIGNUP_CONFIRMATION_LEGACY: '📧',
    PASSWORD_RESET: '🔑',
    WELCOME_SIGNUP: '✨',
    EMAIL_VERIFICATION: '🛡️',
    ACCOUNT_DEACTIVATION: '👋',
    PURCHASE_CONFIRMATION: '✓',
    PAYOUT_CONFIRMATION: '💰',
    REFUND_CONFIRMATION: '↩️',
    ORDER_CANCELLED: '❌',
    NEW_BOOKING_VENDOR: '🔔',
    BOOKING_CONFIRMED_CUSTOMER: '✓',
    BOOKING_REMINDER: '⏰',
    BOOKING_CANCELLED_CUSTOMER: '❌',
    BOOKING_CANCELLED_VENDOR: '❌',
    BOOKING_MODIFIED: '⚙️',
    REQUEST_REVIEW: '⭐',
    SUBSCRIPTION_ACTIVATED: '💳',
    SUBSCRIPTION_PAYMENT_CONFIRMATION: '✓',
    SUBSCRIPTION_CANCELLATION: '❌',
    TRIAL_STARTED: '▶️',
    TRIAL_ENDING_REMINDER: '⚠️',
    TRIAL_CHARGE_FAILED: '⚠️',
    SUBSCRIPTION_PAYMENT_FAILED: '⚠️',
    SUBSCRIPTION_EXPIRING: '⏰',
    SUBSCRIPTION_UPGRADED: '🚀',
    SUBSCRIPTION_DOWNGRADED: 'ℹ️',
    INVOICE_DOCUMENT_SENT: '📄'
  };

  const icon = iconMap[type] || '📧';

  // Determine header icon color based on variant
  const info = EMAIL_TYPE_INFO[type];
  // Header icon always uses brand gold - no green variants
  const headerIconStyle = styles.headerIcon;

  // Generate details based on template type
  const generateDetails = (): string => {
    const rows: string[] = [];

    // Booking templates
    if (type === 'NEW_BOOKING_VENDOR') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">👤 לקוח</span><span style="${styles.detailValue}">${data.customerName}</span></div>`
      );
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">📧 פרטי קשר</span><span style="${styles.detailValue}">${data.guestEmail} • ${data.guestPhone}</span></div>`
      );
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">✨ שירות</span><span style="${styles.detailValue}">${data.serviceName}</span></div>`
      );
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">📅 תאריך ושעה</span><span style="${styles.detailValue}">${data.dateTime} (${data.duration})</span></div>`
      );
    } else if (type === 'BOOKING_CONFIRMED_CUSTOMER') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">✨ שירות</span><span style="${styles.detailValue}">${data.serviceName}</span></div>`
      );
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">📅 תאריך ושעה</span><span style="${styles.detailValue}">${data.dateTime} (${data.duration})</span></div>`
      );
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">📍 מיקום</span><span style="${styles.detailValue}">${data.location}</span></div>`
      );
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">💳 סך הכל שולם</span><span style="${styles.detailValue}">${data.totalPaid}</span></div>`
      );
    }
    // Subscription templates
    else if (type === 'SUBSCRIPTION_ACTIVATED') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">✨ תוכנית</span><span style="${styles.detailValue}">${data.planName}</span></div>`
      );
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">📅 תאריך התחלה</span><span style="${styles.detailValue}">${data.startDate}</span></div>`
      );
    }
    // Trial templates
    else if (type === 'TRIAL_STARTED' || type === 'TRIAL_ENDING_REMINDER') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">💳 תוכנית</span><span style="${styles.detailValue}">${data.planName}</span></div>`
      );
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">📅 תאריך סיום ניסיון</span><span style="${styles.detailValue}">${data.trialEndDate}</span></div>`
      );
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">💰 מחיר חודשי</span><span style="${styles.detailValue}">₪${data.price}</span></div>`
      );
    } else if (type === 'TRIAL_CHARGE_FAILED' || type === 'SUBSCRIPTION_PAYMENT_FAILED') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">💳 תוכנית</span><span style="${styles.detailValue}">${data.planName}</span></div>`
      );
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">💰 סכום</span><span style="${styles.detailValue}">${data.price}</span></div>`
      );
    }
    // Transaction templates
    else if (type === 'PURCHASE_CONFIRMATION') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}"># מספר הזמנה</span><span style="${styles.detailValue}">${data.orderNumber}</span></div>`
      );
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">💳 סכום</span><span style="${styles.detailValue}">${data.totalPaid}</span></div>`
      );
    } else if (type === 'PAYOUT_CONFIRMATION') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">💰 סכום הזיכוי</span><span style="${styles.detailValue}">${data.payoutAmount}</span></div>`
      );
    } else if (type === 'REFUND_CONFIRMATION') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">↩️ סכום ההחזר</span><span style="${styles.detailValue}">${data.refundAmount}</span></div>`
      );
    } else if (type === 'ORDER_CANCELLED') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}"># מספר הזמנה</span><span style="${styles.detailValue}">${data.reservationId}</span></div>`
      );
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">📍 סטודיו</span><span style="${styles.detailValue}">${data.studioName}</span></div>`
      );
    }
    // Auth templates
    else if (type === 'PASSWORD_RESET') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}"># מזהה בקשה</span><span style="${styles.detailValue}">${data.reservationId}</span></div>`
      );
    } else if (type === 'EMAIL_VERIFICATION') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">🔐 קוד אימות</span><span style="${styles.detailValue}">${data.verificationCode}</span></div>`
      );
    }
    // Document templates
    else if (type === 'INVOICE_DOCUMENT_SENT') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">📄 שם המסמך</span><span style="${styles.detailValue}">${data.documentName}</span></div>`
      );
    }
    // Misc templates
    else if (type === 'BOOKING_REMINDER') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">📍 סטודיו</span><span style="${styles.detailValue}">${data.studioName}</span></div>`
      );
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">📅 מועד</span><span style="${styles.detailValue}">${data.dateTime}</span></div>`
      );
    } else if (type === 'SUBSCRIPTION_PAYMENT_CONFIRMATION') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">💳 סכום</span><span style="${styles.detailValue}">${data.price}</span></div>`
      );
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">⏰ תאריך חיוב הבא</span><span style="${styles.detailValue}">${data.nextBillingDate}</span></div>`
      );
    } else if (type === 'SUBSCRIPTION_EXPIRING') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">📅 תאריך תפוגה</span><span style="${styles.detailValue}">${data.nextBillingDate}</span></div>`
      );
    } else if (type === 'SUBSCRIPTION_UPGRADED' || type === 'SUBSCRIPTION_DOWNGRADED') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">✨ תוכנית</span><span style="${styles.detailValue}">${data.planName}</span></div>`
      );
    } else if (type === 'BOOKING_MODIFIED') {
      rows.push(
        `<div style="${styles.detailRow}"><span style="${styles.detailLabel}"># מספר הזמנה</span><span style="${styles.detailValue}">${data.reservationId}</span></div>`
      );
    }

    if (rows.length === 0) return '';
    // Set last row without border
    const lastIdx = rows.length - 1;
    rows[lastIdx] = rows[lastIdx].replace(styles.detailRow, `${styles.detailRow}; border-bottom: none;`);
    return `<div style="${styles.detailsCard}">${rows.join('')}</div>`;
  };

  // Generate special highlight sections for certain templates
  const generateHighlight = (): string => {
    if (type === 'TRIAL_STARTED') {
      return `
        <div style="background: rgba(247,192,65,0.05); border: 1px solid rgba(247,192,65,0.1); border-radius: 16px; padding: 32px; margin-bottom: 24px; text-align: center;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: #f7c041; display: inline-flex; align-items: center; justify-content: center; color: #000000; margin-bottom: 16px; box-shadow: 0 20px 40px -10px rgba(247,192,65,0.4);">✨</div>
          <h2 style="font-size: 24px; font-weight: 800; ${isLight ? 'color: #1c1917;' : 'color: #ffffff;'} margin: 0 0 8px 0;">ניסיון ללא עלות</h2>
          <p style="font-size: 14px; color: #a1a1aa; margin: 0;">מסתיים ב-${data.trialEndDate}</p>
        </div>`;
    }
    if (type === 'SUBSCRIPTION_ACTIVATED') {
      return `
        <div style="background: rgba(247,192,65,0.05); border: 1px solid rgba(247,192,65,0.1); border-radius: 16px; padding: 32px; margin-bottom: 24px; text-align: center;">
          <h2 style="font-size: 24px; font-weight: 800; color: #f7c041; margin: 0;">${data.planName}</h2>
        </div>`;
    }
    if (type === 'TRIAL_ENDING_REMINDER') {
      return `
        <div style="background: rgba(245,158,11,0.05); border: 1px dashed rgba(245,158,11,0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center; color: ${isLight ? '#92400e' : 'rgba(253,230,138,0.7)'};">
          <p style="margin: 0;">לאחר סיום תקופת הניסיון, תחויב אוטומטית בסך של <span style="${styles.textBold}">₪${data.price}</span> לחודש, אלא אם תבטל לפני ה-${data.trialEndDate}.</p>
        </div>`;
    }
    if (type === 'TRIAL_CHARGE_FAILED' || type === 'SUBSCRIPTION_PAYMENT_FAILED') {
      return `
        <div style="background: rgba(239,68,68,0.05); border: 1px dashed rgba(239,68,68,0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center; color: ${isLight ? '#991b1b' : 'rgba(252,165,165,0.7)'};">
          <p style="font-weight: 700; margin: 0 0 8px 0;">⚠️ סיבת הכישלון:</p>
          <p style="margin: 0;">${data.failureReason || 'פרטי כרטיס לא מעודכנים או חוסר במסגרת אשראי'}</p>
        </div>`;
    }
    return '';
  };

  // Determine CTA button style
  const ctaBtnStyle =
    info.variant === 'danger'
      ? `${styles.actionBtn}; background: #ef4444; box-shadow: 0 10px 25px -5px rgba(239,68,68,0.3);`
      : styles.actionBtn;

  // Build the content
  const content = `
    <div style="${styles.header}">
      <h1 style="${styles.headerTitle}">${title}</h1>
      <div style="${headerIconStyle}">${icon}</div>
    </div>
    <div style="${styles.body}">
      <div style="${styles.greeting}">
        ${greetingSection}
        <p style="${styles.greetingText}"><span>${processedBody}</span></p>
      </div>
      ${generateHighlight()}
      ${generateDetails()}
      <div style="margin-top: 32px; text-align: center;">
        <a href="${ctaUrl}" style="${ctaBtnStyle}">${ctaText}</a>
        ${footerText ? `<p style="font-size: 12px; color: #71717a; margin-top: 16px;">${footerText}</p>` : ''}
      </div>
    </div>`;

  // Wrap in full HTML document
  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${EMAIL_TYPE_INFO[type].label}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
  </style>
</head>
<body style="margin: 0; padding: 20px; ${isLight ? 'background: #fafaf9;' : 'background: #18181b;'}">
  <div style="${styles.container}">
    <div style="${styles.card}">
      ${content}
      <div style="${styles.footer}">
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px;">
          <img src="https://www.studioz.co.il/logo.png" alt="StudioZ" style="width: 24px; height: 24px; border-radius: 6px;">
          <span style="${styles.footerBrand}">STUDIOZ</span>
        </div>
        <p style="${styles.footerCopyright}">© ${new Date().getFullYear()} StudioZ — תודה שאתם חלק מהקהילה היצירתית שלנו.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
};

// Email Templates Tab Content
const EmailTemplatesView = () => {
  const { t } = useTranslation('admin');
  const [selectedType, setSelectedType] = useState<EmailType>('BOOKING_CONFIRMED_CUSTOMER');
  const [previewMode, setPreviewMode] = useState<ThemeMode>('dark');
  const [viewMode, setViewMode] = useState<'preview' | 'variables' | 'edit'>('preview');
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  // Editable template text state
  const [templateText, setTemplateText] = useState<Record<EmailType, TemplateTextContent>>(() => loadTemplateText());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Test email state
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const emailTypes = Object.keys(EMAIL_TYPE_INFO) as EmailType[];

  // Get current template's text content
  const currentText = templateText[selectedType];

  // Update a single field for the current template
  const handleTextChange = (field: keyof TemplateTextContent, value: string) => {
    setTemplateText((prev) => ({
      ...prev,
      [selectedType]: {
        ...prev[selectedType],
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Save all changes to localStorage
  const handleSave = () => {
    saveTemplateText(templateText);
    setHasUnsavedChanges(false);
    setExportStatus('השינויים נשמרו בהצלחה!');
    setTimeout(() => setExportStatus(null), 3000);
  };

  // Reset current template to default
  const handleResetCurrent = () => {
    setTemplateText((prev) => ({
      ...prev,
      [selectedType]: { ...DEFAULT_TEMPLATE_TEXT[selectedType] }
    }));
    setHasUnsavedChanges(true);
    setExportStatus('התבנית אופסה לברירת מחדל (שמור כדי להחיל)');
    setTimeout(() => setExportStatus(null), 3000);
  };

  // Export template as HTML file
  const handleExportHTML = () => {
    try {
      const html = generateBrevoHTML(selectedType, previewMode, currentText);
      const blob = new Blob([html], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${selectedType.toLowerCase()}_${previewMode}_template.html`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setExportStatus('הקובץ הורד בהצלחה!');
      setTimeout(() => setExportStatus(null), 3000);
    } catch (err) {
      console.error('Export failed:', err);
      setExportStatus('שגיאה בהורדה');
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  // Copy HTML to clipboard
  const handleCopyHTML = async () => {
    try {
      const html = generateBrevoHTML(selectedType, previewMode, currentText);
      await navigator.clipboard.writeText(html);
      setExportStatus('HTML הועתק ללוח!');
      setTimeout(() => setExportStatus(null), 3000);
    } catch (err) {
      console.error('Copy failed:', err);
      setExportStatus('שגיאה בהעתקה');
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  // Send test email
  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    setTestEmailStatus(null);
    try {
      const result = await sendTestEmail('admin@studioz.online', selectedType);
      setTestEmailStatus({
        type: 'success',
        message: `נשלח בהצלחה! (Template ID: ${result.templateId})`
      });
      setTimeout(() => setTestEmailStatus(null), 5000);
    } catch (err) {
      console.error('Failed to send test email:', err);
      setTestEmailStatus({
        type: 'error',
        message: 'שגיאה בשליחת המייל'
      });
      setTimeout(() => setTestEmailStatus(null), 5000);
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  // Get variables for current template
  const getVariablesList = (type: EmailType): string[] => {
    const vars = BREVO_VARIABLES[type];
    return Object.entries(vars)
      .filter(([_, value]) => typeof value === 'string' && value.includes('params.'))
      .map(([key, value]) => {
        const paramName = (value as string).replace('{{ params.', '').replace(' }}', '');
        return `${key}: {{ params.${paramName} }}`;
      });
  };

  return (
    <div className="admin-email-templates">
      <div className="admin-email-templates__sidebar">
        <div className="admin-email-templates__controls">
          <h3 className="admin-email-templates__controls-title">{t('emailTemplates.mode', 'מצב תצוגה')}</h3>
          <div className="admin-email-templates__mode-toggle">
            <button
              className={cn(
                'admin-email-templates__mode-btn',
                previewMode === 'dark' && 'admin-email-templates__mode-btn--active'
              )}
              onClick={() => setPreviewMode('dark')}
            >
              <MoonIcon size={16} />
              <span>{t('emailTemplates.dark', 'כהה')}</span>
            </button>
            <button
              className={cn(
                'admin-email-templates__mode-btn',
                previewMode === 'light' && 'admin-email-templates__mode-btn--active'
              )}
              onClick={() => setPreviewMode('light')}
            >
              <SunIcon size={16} />
              <span>{t('emailTemplates.light', 'בהיר')}</span>
            </button>
          </div>
        </div>

        {/* Export Controls */}
        <div className="admin-email-templates__controls">
          <h3 className="admin-email-templates__controls-title">ייצוא ל-Brevo</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={handleExportHTML}
              style={{ width: '100%' }}
            >
              <DownloadIcon sx={{ fontSize: 16 }} />
              הורד HTML
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--secondary"
              onClick={handleCopyHTML}
              style={{ width: '100%' }}
            >
              העתק HTML
            </button>
          </div>
          {exportStatus && (
            <div
              style={{
                marginTop: '8px',
                padding: '8px',
                background: 'var(--color-success-bg)',
                color: 'var(--color-success-text)',
                borderRadius: '8px',
                fontSize: '12px',
                textAlign: 'center'
              }}
            >
              {exportStatus}
            </div>
          )}
        </div>

        {/* Edit Controls */}
        <div className="admin-email-templates__controls">
          <h3 className="admin-email-templates__controls-title">עריכת טקסט</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              className={cn('admin-btn', viewMode === 'edit' ? 'admin-btn--primary' : 'admin-btn--secondary')}
              onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
              style={{ width: '100%' }}
            >
              {viewMode === 'edit' ? 'סגור עריכה' : 'ערוך טקסט'}
            </button>
            {hasUnsavedChanges && (
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                onClick={handleSave}
                style={{ width: '100%' }}
              >
                שמור שינויים
              </button>
            )}
            <button
              type="button"
              className="admin-btn admin-btn--secondary"
              onClick={handleResetCurrent}
              style={{ width: '100%', fontSize: '12px' }}
            >
              אפס תבנית נוכחית
            </button>
          </div>
          {hasUnsavedChanges && (
            <div
              style={{
                marginTop: '8px',
                padding: '8px',
                background: 'rgba(245,158,11,0.1)',
                color: '#f59e0b',
                borderRadius: '8px',
                fontSize: '11px',
                textAlign: 'center'
              }}
            >
              יש שינויים שלא נשמרו
            </div>
          )}
        </div>

        {/* Template Info */}
        <div className="admin-email-templates__controls">
          <h3 className="admin-email-templates__controls-title">מידע על התבנית</h3>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Brevo Template ID:</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--color-brand)' }}>
                {TEMPLATE_BREVO_IDS[selectedType]}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>סוג:</span>
              <span>{EMAIL_TYPE_INFO[selectedType].label}</span>
            </div>
          </div>
        </div>

        {/* Send Test Email */}
        <div className="admin-email-templates__controls">
          <h3 className="admin-email-templates__controls-title">שליחת מייל בדיקה</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              שלח מייל בדיקה ל-admin@studioz.online עם נתונים לדוגמה
            </div>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={handleSendTestEmail}
              disabled={isSendingTestEmail}
              style={{ width: '100%', opacity: isSendingTestEmail ? 0.7 : 1 }}
            >
              <MailIcon sx={{ fontSize: 16 }} />
              {isSendingTestEmail ? 'שולח...' : 'שלח מייל בדיקה'}
            </button>
          </div>
          {testEmailStatus && (
            <div
              style={{
                marginTop: '8px',
                padding: '8px',
                background: testEmailStatus.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                color: testEmailStatus.type === 'success' ? '#22c55e' : '#ef4444',
                borderRadius: '8px',
                fontSize: '11px',
                textAlign: 'center'
              }}
            >
              {testEmailStatus.message}
            </div>
          )}
        </div>

        <div className="admin-email-templates__list">
          <h3 className="admin-email-templates__list-title">{t('emailTemplates.templates', 'תבניות')}</h3>
          {emailTypes.map((type) => {
            const info = EMAIL_TYPE_INFO[type];
            const Icon = info.icon;
            return (
              <button
                key={type}
                className={cn(
                  'admin-email-templates__item',
                  selectedType === type && 'admin-email-templates__item--active'
                )}
                onClick={() => setSelectedType(type)}
              >
                <div
                  className={cn(
                    'admin-email-templates__item-icon',
                    info.variant === 'danger' && 'admin-email-templates__item-icon--danger',
                    info.variant === 'warning' && 'admin-email-templates__item-icon--warning'
                  )}
                >
                  <Icon sx={{ fontSize: 18 }} />
                </div>
                <div className="admin-email-templates__item-text">
                  <span className="admin-email-templates__item-label">{info.label}</span>
                  <span className="admin-email-templates__item-desc">{info.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="admin-email-templates__preview">
        <div className="admin-email-templates__preview-header">
          <h3>{EMAIL_TYPE_INFO[selectedType].label}</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div className="admin-email-templates__mode-toggle" style={{ background: 'var(--bg-elevated)' }}>
              <button
                className={cn(
                  'admin-email-templates__mode-btn',
                  viewMode === 'preview' && 'admin-email-templates__mode-btn--active'
                )}
                onClick={() => setViewMode('preview')}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                תצוגה מקדימה
              </button>
              <button
                className={cn(
                  'admin-email-templates__mode-btn',
                  viewMode === 'edit' && 'admin-email-templates__mode-btn--active'
                )}
                onClick={() => setViewMode('edit')}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                עריכה
              </button>
              <button
                className={cn(
                  'admin-email-templates__mode-btn',
                  viewMode === 'variables' && 'admin-email-templates__mode-btn--active'
                )}
                onClick={() => setViewMode('variables')}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                משתנים
              </button>
            </div>
            <span className="admin-email-templates__preview-badge">
              {previewMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
        </div>
        <div className="admin-email-templates__preview-content">
          {viewMode === 'preview' && (
            <EmailTemplatePreview type={selectedType} mode={previewMode} templateText={currentText} />
          )}
          {viewMode === 'edit' && (
            <div style={{ padding: '24px', color: 'var(--text-primary)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>עריכת טקסט התבנית</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                ערוך את טקסט המייל. השתמש ב-{'{'}משתנה{'}'} כדי להוסיף ערכים דינמיים (לדוגמה: {'{'}customerName{'}'},{' '}
                {'{'}studioName{'}'}, {'{'}planName{'}'})
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Title */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>כותרת</label>
                  <input
                    type="text"
                    value={currentText.title}
                    onChange={(e) => handleTextChange('title', e.target.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-primary)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      direction: 'rtl'
                    }}
                  />
                </div>

                {/* Greeting */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>ברכה</label>
                  <input
                    type="text"
                    value={currentText.greeting}
                    onChange={(e) => handleTextChange('greeting', e.target.value)}
                    placeholder="לדוגמה: היי, שלום"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-primary)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      direction: 'rtl'
                    }}
                  />
                </div>

                {/* Body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>גוף ההודעה</label>
                  <textarea
                    value={currentText.body}
                    onChange={(e) => handleTextChange('body', e.target.value)}
                    rows={4}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-primary)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      resize: 'vertical',
                      direction: 'rtl',
                      lineHeight: 1.6
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    משתנים זמינים: {'{'}customerName{'}'}, {'{'}studioName{'}'}, {'{'}experienceName{'}'}, {'{'}planName
                    {'}'}, {'{'}daysRemaining{'}'}, {'{'}price{'}'}, {'{'}trialEndDate{'}'}
                  </span>
                </div>

                {/* CTA Text */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>טקסט כפתור</label>
                  <input
                    type="text"
                    value={currentText.ctaText}
                    onChange={(e) => handleTextChange('ctaText', e.target.value)}
                    placeholder="לדוגמה: צפייה בהזמנה →"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-primary)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      direction: 'rtl'
                    }}
                  />
                </div>

                {/* CTA URL */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    קישור כפתור (URL)
                  </label>
                  <input
                    type="text"
                    value={currentText.ctaUrl}
                    onChange={(e) => handleTextChange('ctaUrl', e.target.value)}
                    placeholder="לדוגמה: https://studioz.co.il/profile או {{ params.bookingUrl }}"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-primary)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      direction: 'ltr',
                      fontFamily: 'monospace'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    השתמש ב-{'{{ params.variableName }}'} לקישורים דינמיים מ-Brevo
                  </span>
                </div>

                {/* Footer Text */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    טקסט תחתון (אופציונלי)
                  </label>
                  <input
                    type="text"
                    value={currentText.footerText}
                    onChange={(e) => handleTextChange('footerText', e.target.value)}
                    placeholder="לדוגמה: צריכים עזרה? צרו קשר בכל זמן"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-primary)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      direction: 'rtl'
                    }}
                  />
                </div>
              </div>

              {/* Save/Reset buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'flex-start' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  style={{ opacity: hasUnsavedChanges ? 1 : 0.5 }}
                >
                  שמור שינויים
                </button>
                <button type="button" className="admin-btn admin-btn--secondary" onClick={handleResetCurrent}>
                  אפס לברירת מחדל
                </button>
              </div>
            </div>
          )}
          {viewMode === 'variables' && (
            <div style={{ padding: '24px', color: 'var(--text-primary)' }}>
              <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>משתני Brevo לתבנית זו:</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                העתק את המשתנים הבאים והשתמש בהם בעת שליחת המייל דרך ה-API:
              </p>
              <div
                style={{
                  background: 'var(--bg-primary)',
                  borderRadius: '12px',
                  padding: '16px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  direction: 'ltr',
                  textAlign: 'left'
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
                  {`{
  "params": {
${getVariablesList(selectedType)
  .map((v) => `    "${v.split(':')[0].trim()}": "value"`)
  .join(',\n')}
  }
}`}
                </pre>
              </div>
              <h4 style={{ margin: '24px 0 12px 0', color: 'var(--text-primary)' }}>רשימת משתנים:</h4>
              <ul style={{ margin: 0, padding: '0 0 0 20px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                {getVariablesList(selectedType).map((v, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    <code
                      style={{
                        background: 'var(--bg-elevated)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      {v.split(':')[0].trim()}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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

  // Coupon state
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showCouponCreator, setShowCouponCreator] = useState(false);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

  // Fetch coupons when tab is active
  useEffect(() => {
    if (activeTab === 'coupons') {
      loadCoupons();
    }
  }, [activeTab]);

  const loadCoupons = async () => {
    setIsLoadingCoupons(true);
    try {
      const data = await getAllCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Failed to load coupons:', error);
    } finally {
      setIsLoadingCoupons(false);
    }
  };

  const handleCouponCreated = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
  };

  const handleToggleCouponStatus = async (id: string) => {
    try {
      const updated = await toggleCouponStatus(id);
      setCoupons((prev) => prev.map((c) => (c._id === id ? updated : c)));
    } catch (error) {
      console.error('Failed to toggle coupon status:', error);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm(t('coupons.confirmDelete', 'Are you sure you want to delete this coupon?'))) {
      return;
    }
    try {
      await deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error('Failed to delete coupon:', error);
    }
  };

  // Calculate real metrics from data
  const metrics: Metric[] = useMemo(() => {
    const activeStudios = studios.filter((s) => s.active).length;
    const totalServices = studios.reduce((acc, s) => acc + s.items.length, 0);
    const totalRevenue = reservations.reduce((acc, r) => acc + (r.totalPrice || 0), 0);

    return [
      { label: t('metrics.totalUsers'), value: '2,543', change: '+12.5%', trend: 'up', icon: UsersIcon },
      {
        label: t('metrics.activeStudios'),
        value: activeStudios.toString(),
        change: '+4.2%',
        trend: 'up',
        icon: BuildingIcon
      },
      {
        label: t('metrics.activeServices'),
        value: totalServices.toString(),
        change: '+8.3%',
        trend: 'up',
        icon: PackageIcon
      },
      {
        label: t('metrics.monthlyRevenue'),
        value: `₪${Math.round(totalRevenue / 1000)}k`,
        change: '+8.1%',
        trend: 'up',
        icon: DollarIcon
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
    { id: 'overview', label: t('nav.overview'), icon: BarChart3Icon },
    { id: 'users', label: t('nav.users'), icon: UsersIcon },
    { id: 'studios', label: t('nav.studios'), icon: BuildingIcon },
    { id: 'services', label: t('nav.services'), icon: PackageIcon },
    { id: 'coupons', label: t('nav.coupons', 'Coupons'), icon: TicketIcon },
    { id: 'emailTemplates', label: t('nav.emailTemplates', 'Email Templates'), icon: MailIcon }
  ];

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <ShieldLucideIcon sx={{ fontSize: 28 }} />
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
                <item.icon sx={{ fontSize: 18 }} />
                {item.label}
                {activeTab === item.id && (
                  <ChevronRightIcon sx={{ fontSize: 14 }} className="admin-sidebar__nav-chevron" />
                )}
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
            <ShieldLucideIcon sx={{ fontSize: 20 }} />
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
                <item.icon sx={{ fontSize: 18 }} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Search Bar - shown for tables */}
        {activeTab !== 'overview' && (
          <div className="admin-toolbar">
            <div className="admin-search">
              <SearchIcon className="admin-search__icon" sx={{ fontSize: 16 }} />
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
                <FilterIcon sx={{ fontSize: 18 }} />
              </button>
              <button className="admin-btn admin-btn--icon">
                <DownloadIcon sx={{ fontSize: 18 }} />
              </button>
              {activeTab === 'studios' && (
                <button className="admin-btn admin-btn--primary">
                  <CheckCircle2Icon sx={{ fontSize: 16 }} />
                  {t('actions.verifyPending')}
                </button>
              )}
              {activeTab === 'users' && (
                <button className="admin-btn admin-btn--secondary">
                  <UserLucideIcon sx={{ fontSize: 16 }} />
                  {t('actions.addUser')}
                </button>
              )}
              {activeTab === 'coupons' && (
                <button className="admin-btn admin-btn--primary" onClick={() => setShowCouponCreator(true)}>
                  <AddIcon sx={{ fontSize: 16 }} />
                  {t('coupons.createNew', 'Create Coupon')}
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
                  <DownloadIcon sx={{ fontSize: 16 }} /> {t('actions.exportReport')}
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
                            <BuildingIcon sx={{ fontSize: 14 }} />
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

        {activeTab === 'coupons' && (
          <div className="admin-content admin-content--animate">
            <SectionHeader
              title={t('sections.coupons.title', 'Coupons')}
              description={t('sections.coupons.description', 'Create and manage discount coupons for your platform')}
            />

            {showCouponCreator && (
              <div className="admin-modal-overlay" onClick={() => setShowCouponCreator(false)}>
                <div onClick={(e) => e.stopPropagation()}>
                  <CouponCreator onCouponCreated={handleCouponCreated} onClose={() => setShowCouponCreator(false)} />
                </div>
              </div>
            )}

            {isLoadingCoupons ? (
              <div className="admin-loading">
                <div className="admin-loading__spinner" />
                <p>{t('loading', 'Loading...')}</p>
              </div>
            ) : (
              <CouponsTable
                coupons={coupons}
                searchTerm={searchTerm}
                onToggleStatus={handleToggleCouponStatus}
                onDelete={handleDeleteCoupon}
              />
            )}
          </div>
        )}

        {activeTab === 'emailTemplates' && (
          <div className="admin-content admin-content--animate admin-content--full-width">
            <SectionHeader
              title={t('sections.emailTemplates.title', 'Email Templates')}
              description={t('sections.emailTemplates.description', 'Preview and manage automated email templates')}
            />
            <EmailTemplatesView />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
