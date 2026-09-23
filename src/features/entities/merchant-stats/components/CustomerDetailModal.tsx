import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { CloseIcon } from '@shared/components/icons';
import type { CustomerDetailResponse } from '@shared/services';

interface CustomerDetailModalProps {
  open: boolean;
  onClose: () => void;
  customerId: string | null;
  customerName: string;
  data: CustomerDetailResponse | undefined;
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
}

const MONTH_KEYS = [
  'months.jan', 'months.feb', 'months.mar', 'months.apr', 'months.may', 'months.jun',
  'months.jul', 'months.aug', 'months.sep', 'months.oct', 'months.nov', 'months.dec'
];

const DAY_NAME_TO_KEY: Record<string, string> = {
  sunday: 'days.sun',
  monday: 'days.mon',
  tuesday: 'days.tue',
  wednesday: 'days.wed',
  thursday: 'days.thu',
  friday: 'days.fri',
  saturday: 'days.sat'
};

const STATUS_TO_KEY: Record<string, string> = {
  confirmed: 'customerDetail.statusConfirmed',
  pending: 'customerDetail.statusPending',
  cancelled: 'customerDetail.statusCancelled',
  canceled: 'customerDetail.statusCancelled',
  completed: 'customerDetail.statusCompleted',
  noshow: 'customerDetail.statusNoShow',
  'no-show': 'customerDetail.statusNoShow',
  'no show': 'customerDetail.statusNoShow'
};

const formatAxisValue = (v: number) => (v >= 1000 ? `₪${(v / 1000).toFixed(1).replace(/\.0$/, '')}k` : `₪${v}`);

const MoneyYTick = ({
  x,
  y,
  payload
}: {
  x?: number;
  y?: number;
  payload?: { value?: number };
}) => (
  <text
    x={(x ?? 0) - 10}
    y={y}
    dy={4}
    textAnchor="end"
    fill="var(--text-muted)"
    fontSize={11}
  >
    {formatAxisValue(Number(payload?.value ?? 0))}
  </text>
);

const MonthXTick = ({
  x,
  y,
  payload
}: {
  x?: number;
  y?: number;
  payload?: { value?: string };
}) => {
  if (!payload?.value) return null;
  return (
    <text
      x={x}
      y={(y ?? 0) + 4}
      dy={10}
      textAnchor="end"
      fill="var(--text-muted)"
      fontSize={10}
      transform={`rotate(-30, ${x}, ${(y ?? 0) + 4})`}
    >
      {payload.value}
    </text>
  );
};

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  open,
  onClose,
  customerName,
  data,
  isLoading,
  formatCurrency
}) => {
  const { t } = useTranslation('merchantStats');

  const translateStatus = (status: string) => {
    const key = STATUS_TO_KEY[status.toLowerCase().trim()];
    return key ? t(key) : status;
  };

  const translateDayNames = (days: string[]) =>
    days.map((day) => {
      const key = DAY_NAME_TO_KEY[day.toLowerCase().trim()];
      return key ? t(key) : day;
    });

  if (!open) return null;

  const chartData = data?.spendingTrend?.map((value, i) => ({
    name: t(MONTH_KEYS[i], String(i + 1)),
    value
  })) ?? [];

  return (
    <div className="customer-detail-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="customer-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="customer-detail-modal__header">
          <h2>{customerName}</h2>
          <button type="button" className="customer-detail-modal__close" onClick={onClose} aria-label={t('close', 'סגור')}>
            <CloseIcon />
          </button>
        </div>

        {isLoading ? (
          <div className="customer-detail-modal__loader">{t('loading', 'טוען...')}</div>
        ) : data ? (
          <div className="customer-detail-modal__body">
            {data.bookingHistory && data.bookingHistory.length > 0 && (
              <section className="customer-detail-modal__section">
                <h3>{t('customerDetail.bookingHistory', 'היסטוריית הזמנות')}</h3>
                <div className="customer-detail-modal__table-wrap">
                  <table className="customer-detail-modal__table">
                    <thead>
                      <tr>
                        <th>{t('customerDetail.date', 'תאריך')}</th>
                        <th>{t('customerDetail.studio', 'אולפן')}</th>
                        <th>{t('customerDetail.item', 'פריט')}</th>
                        <th>{t('customerDetail.price', 'מחיר')}</th>
                        <th>{t('customerDetail.status', 'סטטוס')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.bookingHistory.map((row) => (
                        <tr key={row.id}>
                          <td>{row.date}</td>
                          <td>{row.studioName}</td>
                          <td>{row.itemName}</td>
                          <td>{formatCurrency(row.price)}</td>
                          <td>{translateStatus(row.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {chartData.length > 0 && (
              <section className="customer-detail-modal__section">
                <h3>{t('customerDetail.spendingTrend', 'מגמת הוצאות')}</h3>
                <div className="customer-detail-modal__chart ms-chart-plot" dir="ltr">
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={chartData} margin={{ top: 12, right: 12, left: 52, bottom: 40 }}>
                      <CartesianGrid stroke="var(--border-secondary)" strokeDasharray="0" vertical={false} />
                      <XAxis
                        dataKey="name"
                        height={48}
                        interval={0}
                        tick={<MonthXTick />}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis width={1} tick={<MoneyYTick />} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-secondary)',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number | undefined) => [
                          formatCurrency(value ?? 0),
                          t('revenueChart.revenue', 'הכנסה')
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-brand)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}

            {(data.preferredTimeSlots?.length > 0 || data.preferredDays?.length > 0) && (
              <section className="customer-detail-modal__section">
                <h3>{t('customerDetail.preferences', 'העדפות')}</h3>
                <p>
                  {data.preferredTimeSlots?.length > 0 && (
                    <span>{t('customerDetail.preferredSlots', 'שעות')}: {data.preferredTimeSlots.join(', ')}</span>
                  )}
                  {data.preferredTimeSlots?.length > 0 && data.preferredDays?.length > 0 && ' · '}
                  {data.preferredDays?.length > 0 && (
                    <span>{t('customerDetail.preferredDays', 'ימים')}: {translateDayNames(data.preferredDays).join(', ')}</span>
                  )}
                </p>
              </section>
            )}
          </div>
        ) : (
          <div className="customer-detail-modal__empty">{t('customerDetail.noData', 'אין נתונים')}</div>
        )}
      </div>
    </div>
  );
};
