import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScheduleIcon } from '@shared/components/icons';

interface BillingCurrentCardProps {
  period: string;
  feePercentage: number;
  totalFeeAmount: number;
  totalTransactionAmount: number;
  count: number;
}

export const BillingCurrentCard: React.FC<BillingCurrentCardProps> = ({
  period,
  feePercentage,
  totalFeeAmount,
  totalTransactionAmount,
  count,
}) => {
  const { t } = useTranslation('billing');

  const formatPeriod = (p: string) => {
    const [year, month] = p.split('-');
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="billing__current-card">
      <div className="billing__current-header">
        <ScheduleIcon className="billing__current-icon" />
        <div>
          <h3 className="billing__current-title">
            {t('current.title', 'תקופה נוכחית')} — {formatPeriod(period)}
          </h3>
          <span className="billing__current-badge">
            {t('current.pendingBadge', 'ממתין לחיוב בסוף החודש')}
          </span>
        </div>
      </div>

      <div className="billing__current-stats">
        <div className="billing__current-stat">
          <span className="billing__current-stat-label">{t('current.transactions', 'סה"כ עסקאות')}</span>
          <span className="billing__current-stat-value">₪{totalTransactionAmount.toLocaleString()}</span>
        </div>
        <div className="billing__current-stat">
          <span className="billing__current-stat-label">
            {t('current.fee', 'עמלה')} ({(feePercentage * 100).toFixed(0)}%)
          </span>
          <span className="billing__current-stat-value billing__current-stat-value--fee">
            ₪{totalFeeAmount.toFixed(2)}
          </span>
        </div>
        <div className="billing__current-stat">
          <span className="billing__current-stat-label">{t('current.count', 'מספר עסקאות')}</span>
          <span className="billing__current-stat-value">{count}</span>
        </div>
      </div>
    </div>
  );
};
