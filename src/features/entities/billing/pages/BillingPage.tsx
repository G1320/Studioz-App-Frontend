import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCardIcon } from '@shared/components/icons';
import { useBillingHistory, useCurrentFees } from '@shared/hooks';
import { BillingCurrentCard } from '../components/BillingCurrentCard';
import { BillingHistoryTable } from '../components/BillingHistoryTable';
import { BillingCycleModal } from '../components/BillingCycleModal';
import '../styles/_billing.scss';

const BillingPage: React.FC = () => {
  const { t } = useTranslation('billing');
  const { data: history = [], isLoading: historyLoading } = useBillingHistory();
  const { data: currentFees, isLoading: currentLoading } = useCurrentFees();

  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);

  const handleCycleClick = useCallback((cycleId: string) => {
    setSelectedCycleId(cycleId);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCycleId(null);
  }, []);

  const isLoading = historyLoading || currentLoading;

  if (isLoading) {
    return (
      <div className="billing">
        <div className="billing__loader">{t('loading', 'טוען נתוני חיוב...')}</div>
      </div>
    );
  }

  return (
    <div className="billing">
      <header className="billing__header">
        <div className="billing__title-row">
          <CreditCardIcon className="billing__title-icon" />
          <h1 className="billing__title">{t('title', 'עמלות פלטפורמה')}</h1>
        </div>
        <p className="billing__subtitle">
          {t('subtitle', 'סיכום העמלות החודשיות על עסקאות דרך הפלטפורמה')}
        </p>
      </header>

      {currentFees && (
        <BillingCurrentCard
          period={currentFees.period}
          feePercentage={currentFees.feePercentage}
          totalFeeAmount={currentFees.totalFeeAmount}
          totalTransactionAmount={currentFees.totalTransactionAmount}
          count={currentFees.count}
          feeTier={currentFees.feeTier}
          nextTier={currentFees.nextTier}
          tiers={currentFees.tiers}
        />
      )}

      <BillingHistoryTable
        cycles={history}
        onCycleClick={handleCycleClick}
      />

      {selectedCycleId && (
        <BillingCycleModal
          cycleId={selectedCycleId}
          open={!!selectedCycleId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default BillingPage;
