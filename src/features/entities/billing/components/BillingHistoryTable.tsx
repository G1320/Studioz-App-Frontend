import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, ErrorIcon, ScheduleIcon } from '@shared/components/icons';
import type { BillingCycle } from '@shared/services/billing-service';

interface BillingHistoryTableProps {
  cycles: BillingCycle[];
  onCycleClick: (cycleId: string) => void;
}

const StatusBadge: React.FC<{ status: BillingCycle['status'] }> = ({ status }) => {
  const { t } = useTranslation('billing');

  const config: Record<string, { className: string; label: string; Icon: React.FC<any> }> = {
    paid: { className: 'billing__status--paid', label: t('status.paid', 'שולם'), Icon: CheckCircleIcon },
    pending: { className: 'billing__status--pending', label: t('status.pending', 'ממתין'), Icon: ScheduleIcon },
    processing: { className: 'billing__status--pending', label: t('status.processing', 'בעיבוד'), Icon: ScheduleIcon },
    failed: { className: 'billing__status--failed', label: t('status.failed', 'נכשל'), Icon: ErrorIcon },
  };

  const { className, label, Icon } = config[status] || config.pending;

  return (
    <span className={`billing__status ${className}`}>
      <Icon style={{ fontSize: 14 }} />
      {label}
    </span>
  );
};

const formatPeriod = (period: string) => {
  const [year, month] = period.split('-');
  const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  return `${months[parseInt(month) - 1]} ${year}`;
};

export const BillingHistoryTable: React.FC<BillingHistoryTableProps> = ({ cycles, onCycleClick }) => {
  const { t } = useTranslation('billing');

  if (cycles.length === 0) {
    return (
      <div className="billing__empty">
        <p>{t('history.empty', 'אין היסטוריית חיובים עדיין')}</p>
      </div>
    );
  }

  return (
    <div className="billing__history">
      <h2 className="billing__section-title">{t('history.title', 'היסטוריית חיובים')}</h2>
      <div className="billing__table-wrapper">
        <table className="billing__table">
          <thead>
            <tr>
              <th>{t('history.period', 'תקופה')}</th>
              <th>{t('history.transactions', 'עסקאות')}</th>
              <th>{t('history.transactionTotal', 'סה"כ עסקאות')}</th>
              <th>{t('history.fee', 'עמלה')}</th>
              <th>{t('history.status', 'סטטוס')}</th>
              <th>{t('history.invoice', 'חשבונית')}</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => (
              <tr
                key={cycle._id}
                className="billing__table-row"
                onClick={() => onCycleClick(cycle._id)}
              >
                <td className="billing__cell--period">{formatPeriod(cycle.period)}</td>
                <td>{cycle.feeCount}</td>
                <td>₪{cycle.totalTransactionAmount.toLocaleString()}</td>
                <td className="billing__cell--fee">
                  <span>₪{cycle.totalFeeAmount.toFixed(2)}</span>
                  {cycle.feeModel === 'tiered' && (
                    <span className="billing__tiered-badge" title={t('history.tieredTooltip', 'עמלה מדורגת')}>
                      {(cycle.feePercentage * 100).toFixed(1)}%
                    </span>
                  )}
                </td>
                <td><StatusBadge status={cycle.status} /></td>
                <td>
                  {cycle.invoiceDocumentUrl ? (
                    <a
                      href={cycle.invoiceDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="billing__invoice-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('history.viewInvoice', 'צפייה')}
                    </a>
                  ) : (
                    <span className="billing__no-invoice">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
