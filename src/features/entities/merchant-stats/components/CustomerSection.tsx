import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useCustomerAnalytics, useCustomerDetail } from '@shared/hooks';
import { SearchIcon } from '@shared/components/icons';
import { ChurnBadge } from './ChurnBadge';
import { CustomerDetailModal } from './CustomerDetailModal';
import type { DateRange } from './DateRangePicker';
import type { CustomerAnalyticsRow } from '@shared/services';

interface CustomerSectionProps {
  dateRange: DateRange;
  formatCurrency: (amount: number) => string;
}

const SORT_OPTIONS = [
  { value: 'totalSpent', labelKey: 'customers.sortByLTV' },
  { value: 'bookings', labelKey: 'customers.sortByBookings' },
  { value: 'lastVisit', labelKey: 'customers.sortByLastVisit' }
];

export const CustomerSection: React.FC<CustomerSectionProps> = ({ dateRange, formatCurrency }) => {
  const { t } = useTranslation('merchantStats');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'totalSpent' | 'bookings' | 'lastVisit'>('totalSpent');
  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');

  const { data: customerData, isLoading } = useCustomerAnalytics({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    page,
    limit: 15,
    sortBy,
    search: search || undefined
  });

  const { data: customerDetail, isLoading: detailLoading } = useCustomerDetail(
    selectedCustomerId,
    { startDate: dateRange.startDate, endDate: dateRange.endDate }
  );

  const handleRowClick = useCallback((row: CustomerAnalyticsRow) => {
    setSelectedCustomerId(row.customerId);
    setSelectedCustomerName(row.customerName);
  }, []);

  const customers = customerData?.customers ?? [];
  const total = customerData?.total ?? 0;
  const pages = customerData?.pages ?? 1;

  const repeatCount = customers.filter((c) => c.bookingCount > 1).length;
  const newCount = customers.length - repeatCount;
  const pieData = [
    { name: t('customers.repeat', 'חוזרים'), value: repeatCount, color: 'var(--color-brand)' },
    { name: t('customers.new', 'חדשים'), value: newCount, color: 'var(--color-secondary, #6b7280)' }
  ];

  if (isLoading) {
    return (
      <div className="merchant-stats__section merchant-stats__section--customers">
        <div className="merchant-stats__loader">{t('loading', 'טוען נתונים...')}</div>
      </div>
    );
  }

  return (
    <div className="merchant-stats__section merchant-stats__section--customers">
      <div className="customers-section__controls">
        <div className="customers-section__search">
          <SearchIcon style={{ width: 20, height: 20, color: 'var(--text-muted)' }} />
          <input
            type="search"
            placeholder={t('customers.searchPlaceholder', 'חיפוש לפי שם...')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="customers-section__search-input"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'totalSpent' | 'bookings' | 'lastVisit')}
          className="customers-section__sort"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey, opt.value)}
            </option>
          ))}
        </select>
      </div>

      <div className="customers-section__layout">
        <div className="customers-section__table-wrap">
          <table className="customers-table">
            <thead>
              <tr>
                <th>{t('customers.name', 'שם')}</th>
                <th>{t('customers.ltv', 'ערך לאורך זמן')}</th>
                <th>{t('customers.bookings', 'הזמנות')}</th>
                <th>{t('customers.lastVisit', 'ביקור אחרון')}</th>
                <th>{t('customers.churnRisk', 'סיכון נטישה')}</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((row) => (
                <tr
                  key={row.customerId}
                  onClick={() => handleRowClick(row)}
                  className="customers-table__row"
                >
                  <td>
                    <span className="customers-table__name">{row.customerName}</span>
                  </td>
                  <td>{formatCurrency(row.lifetimeValue)}</td>
                  <td>{row.bookingCount}</td>
                  <td>{row.lastVisit}</td>
                  <td>
                    <ChurnBadge risk={row.churnRisk} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pages > 1 && (
            <div className="customers-section__pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                {t('pagination.prev', 'הקודם')}
              </button>
              <span>
                {t('pagination.page', 'עמוד')} {page} / {pages}
              </span>
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
              >
                {t('pagination.next', 'הבא')}
              </button>
            </div>
          )}
        </div>

        {pieData.length > 0 && (
          <div className="customers-section__charts">
            <div className="customers-section__pie">
              <h4>{t('customers.repeatVsNew', 'חוזרים vs חדשים')}</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    stroke="var(--bg-surface, #fff)"
                    strokeWidth={2}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, _name, props) => [value ?? 0, (props as { payload?: { name: string } })?.payload?.name ?? '']} />
                  <Legend formatter={(_: string, entry: { payload?: { name?: string; value?: number } }) => `${entry.payload?.name ?? ''}: ${entry.payload?.value ?? 0}` as string} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {total === 0 && (
        <div className="merchant-stats__empty">
          <p>{t('customers.noCustomers', 'אין לקוחות בתקופה זו')}</p>
        </div>
      )}

      <CustomerDetailModal
        open={!!selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        customerId={selectedCustomerId}
        customerName={selectedCustomerName}
        data={customerDetail}
        isLoading={detailLoading}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};
