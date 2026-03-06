import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScheduleIcon } from '@shared/components/icons';
import type { FeeTierInfo, NextTierNudge, FeeTierConfig } from '@shared/services/billing-service';

interface BillingCurrentCardProps {
  period: string;
  feePercentage: number;
  totalFeeAmount: number;
  totalTransactionAmount: number;
  count: number;
  feeTier?: FeeTierInfo;
  nextTier?: NextTierNudge;
  tiers?: FeeTierConfig[];
}

export const BillingCurrentCard: React.FC<BillingCurrentCardProps> = ({
  period,
  feePercentage,
  totalFeeAmount,
  totalTransactionAmount,
  count,
  feeTier,
  nextTier,
  tiers,
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
            {t('current.effectiveFee', 'עמלה אפקטיבית')} ({(feePercentage * 100).toFixed(1)}%)
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

      {/* Tier breakdown */}
      {feeTier && feeTier.breakdown.length > 0 && (
        <div className="billing__tier-breakdown">
          <h4 className="billing__tier-breakdown-title">{t('current.tierBreakdown', 'פירוט מדרגות')}</h4>
          <div className="billing__tier-breakdown-list">
            {feeTier.breakdown.map((item) => (
              <div key={item.tierIndex} className={`billing__tier-row ${item.tierIndex === feeTier.tierIndex ? 'billing__tier-row--active' : ''}`}>
                <span className="billing__tier-rate">{item.label}</span>
                <span className="billing__tier-band">
                  ₪{item.amountInBand.toLocaleString()}
                </span>
                <span className="billing__tier-fee">₪{item.feeAmount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tier scale overview */}
      {tiers && tiers.length > 0 && (
        <div className="billing__tier-scale">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`billing__tier-scale-item ${feeTier && i === feeTier.tierIndex ? 'billing__tier-scale-item--current' : ''}`}
            >
              <span className="billing__tier-scale-rate">{tier.label}</span>
              <span className="billing__tier-scale-range">
                {tier.maxAmount !== null
                  ? t('current.tierUpTo', 'עד ₪{{amount}}', { amount: tier.maxAmount.toLocaleString() })
                  : t('current.tierAbove', 'מעל')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Next tier nudge */}
      {nextTier && (
        <div className="billing__nudge">
          <span className="billing__nudge-text">
            {t('current.nudge', 'עוד ₪{{amount}} עד עמלה של {{rate}} — המשך כך!', {
              amount: nextTier.amountToGo.toLocaleString(),
              rate: nextTier.nextLabel,
            })}
          </span>
          <div className="billing__nudge-bar">
            <div
              className="billing__nudge-bar-fill"
              style={{ width: `${Math.min(100, (nextTier.currentAmount / nextTier.thresholdAmount) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
