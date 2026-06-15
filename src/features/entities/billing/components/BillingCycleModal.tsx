import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBillingCycleFees } from '@shared/hooks';
import { GenericModal } from '@shared/components/modal/GenericModal';

interface BillingCycleModalProps {
  cycleId: string;
  open: boolean;
  onClose: () => void;
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const typeLabels: Record<string, string> = {
  reservation: 'הזמנה',
  quick_charge: 'סליקה מהירה',
  multivendor: 'סליקה מרובת ספקים',
};

export const BillingCycleModal: React.FC<BillingCycleModalProps> = ({ cycleId, open, onClose }) => {
  const { t } = useTranslation('billing');
  const { data: fees = [], isLoading } = useBillingCycleFees(open ? cycleId : null);

  return (
    <GenericModal open={open} onClose={onClose} className="billing__modal-wrapper">
      <div className="billing__modal">
        <div className="billing__modal-header">
          <h2>{t('modal.title', 'פירוט עמלות')}</h2>
          <button
            type="button"
            className="billing__modal-close"
            onClick={onClose}
            aria-label={t('modal.close', 'סגור')}
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="billing__modal-loader">{t('loading', 'טוען...')}</div>
        ) : fees.length === 0 ? (
          <div className="billing__modal-empty">{t('modal.empty', 'אין עמלות לתצוגה')}</div>
        ) : (
          <div className="billing__modal-content">
            <table className="billing__modal-table">
              <thead>
                <tr>
                  <th scope="col">{t('modal.date', 'תאריך')}</th>
                  <th scope="col">{t('modal.type', 'סוג')}</th>
                  <th scope="col">{t('modal.amount', 'סכום עסקה')}</th>
                  <th scope="col">{t('modal.fee', 'עמלה')}</th>
                  <th scope="col">{t('modal.status', 'סטטוס')}</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((fee) => (
                  <tr key={fee._id}>
                    <td>{formatDate(fee.createdAt)}</td>
                    <td>{typeLabels[fee.transactionType] || fee.transactionType}</td>
                    <td>₪{fee.transactionAmount.toLocaleString()}</td>
                    <td>₪{fee.feeAmount.toFixed(2)}</td>
                    <td>
                      <span className={`billing__fee-status billing__fee-status--${fee.status}`}>
                        {fee.status === 'paid' ? 'שולם' :
                         fee.status === 'pending' ? 'ממתין' :
                         fee.status === 'billed' ? 'חויב' :
                         fee.status === 'credited' ? 'זוכה' :
                         fee.status === 'waived' ? 'בוטל' : fee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </GenericModal>
  );
};
