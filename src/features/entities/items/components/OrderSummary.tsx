import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LocationIcon, CalendarTodayIcon, ArrowBackIcon, LockIcon } from '@shared/components/icons';
import { SumitPaymentForm } from '@shared/components';
import { sumitService } from '@shared/services';
import { prepareFormData } from '@features/entities/payments/sumit/utils';
import { SavedCards, type SavedCard } from './SavedCards';
import '../styles/_order-summary.scss';

// --- Types ---
export interface OrderItem {
  id: string;
  label: string;
  value: string | number;
  isPrice?: boolean;
}

export type { SavedCard };

export interface OrderSummaryProps {
  className?: string;
  studioName?: string;
  studioLocation?: string;
  bookingDate?: string;
  bookingTime?: string;
  items?: OrderItem[];
  totalAmount?: number;
  savedCards?: SavedCard[];
  /**
   * Called with the Sumit single-use token when payment form is submitted
   * This token should be passed to the booking API
   */
  onPaymentSubmit?: (paymentData: {
    method: 'saved' | 'new';
    cardId?: string;
    singleUseToken?: string; // Sumit token for new card
  }) => Promise<void>;
  onRemoveCard?: (cardId: string) => void;
  currency?: string;
  isProcessing?: boolean;
  error?: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  className = '',
  studioName = '',
  studioLocation = '',
  bookingDate = '',
  bookingTime = '',
  items = [],
  totalAmount = 0,
  savedCards = [],
  onPaymentSubmit,
  onRemoveCard,
  currency = '₪',
  isProcessing: externalProcessing = false,
  error: externalError
}) => {
  const { t, i18n } = useTranslation('orders');
  const isRTL = i18n.language === 'he';

  const [paymentMethod, setPaymentMethod] = useState<'saved' | 'new'>('saved');
  const [selectedCardId, setSelectedCardId] = useState<string>(savedCards[0]?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const processing = externalProcessing || isProcessing;
  const displayError = externalError || error;

  // Handle saved card payment
  const handleSavedCardSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      await onPaymentSubmit?.({
        method: 'saved',
        cardId: selectedCardId
      });
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || t('paymentError', 'Payment failed. Please try again.'));
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle new card payment (via SumitPaymentForm)
  const handleNewCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      // Get Sumit token using platform credentials
      // Cards saved at platform level work across all vendors
      const formData = prepareFormData(e.target as HTMLFormElement);
      const token = await sumitService.getSumitToken(formData);

      await onPaymentSubmit?.({
        method: 'new',
        singleUseToken: token
      });
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || t('paymentError', 'Payment failed. Please try again.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveCard = () => {
    if (selectedCardId && onRemoveCard) {
      onRemoveCard(selectedCardId);
    }
  };

  const formattedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      displayValue: item.isPrice ? `${currency}${item.value}` : item.value
    }));
  }, [items, currency]);

  return (
    <div className={`order-summary ${className}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="order-summary__header">
        {paymentMethod === 'new' && (
          <button type="button" className="order-summary__back-btn" onClick={() => setPaymentMethod('saved')}>
            <ArrowBackIcon />
          </button>
        )}
        <h3 className="order-summary__title">
          {paymentMethod === 'new' ? t('addPaymentMethod', 'הוסף אמצעי תשלום') : t('checkout', 'תשלום')}
        </h3>
      </div>

      <div className="order-summary__content">
        {/* VIEW: Saved Cards List */}
        {paymentMethod === 'saved' && (
          <div className="order-summary__view-list animate-in fade-in slide-in-from-start duration-300">
            {/* Order Summary Section */}
            <div className="order-summary__section">
              <h4 className="order-summary__section-title">{t('orderSummary', 'סיכום הזמנה')}</h4>

              <div className="order-summary__details-card">
                {/* Info Items */}
                <div className="order-summary__info-row">
                  <div className="order-summary__info-item">
                    <LocationIcon className="order-summary__info-icon" />
                    <div>
                      <p className="order-summary__info-primary">{studioName}</p>
                      <p className="order-summary__info-secondary">{studioLocation}</p>
                    </div>
                  </div>

                  <div className="order-summary__info-divider" />

                  <div className="order-summary__info-item">
                    <CalendarTodayIcon className="order-summary__info-icon" />
                    <div>
                      <p className="order-summary__info-primary">{bookingDate}</p>
                      <p className="order-summary__info-secondary">{bookingTime}</p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="order-summary__price-list">
                  {formattedItems.map((item) => (
                    <div key={item.id} className="order-summary__price-item">
                      <span className="order-summary__price-label">{item.label}</span>
                      <span className="order-summary__price-value">{item.displayValue}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="order-summary__total-row">
                  <span className="order-summary__total-label">{t('totalToPay', 'סה״כ לתשלום')}</span>
                  <span className="order-summary__total-value">
                    {currency}
                    {totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="order-summary__section">
              <h4 className="order-summary__section-title">{t('paymentMethod', 'אמצעי תשלום')}</h4>

              <SavedCards
                cards={savedCards}
                selectedCardId={selectedCardId}
                onSelectCard={setSelectedCardId}
                onRemoveCard={onRemoveCard ? handleRemoveCard : undefined}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
              />
            </div>

            {/* Footer / Submit */}
            <div className="order-summary__footer">
              {savedCards.length > 0 && (
                <form onSubmit={handleSavedCardSubmit} className="order-summary__form">
                  {displayError && <div className="order-summary__error">{displayError}</div>}

                  <button type="submit" className="order-summary__submit-btn" disabled={processing}>
                    {processing ? (
                      <span className="order-summary__submit-btn-loading">{t('processing', 'מעבד תשלום...')}</span>
                    ) : (
                      <>
                        <span>{t('pay', 'לתשלום')}</span>
                        <span className="order-summary__submit-btn-amount">
                          {currency}
                          {totalAmount}
                        </span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="order-summary__footer-sumit">
                <div className="sumit-secured">
                  <span>מאובטח על ידי </span>
                  <a href="https://sumit.co.il" target="_blank" rel="noopener noreferrer" className="sumit-link">
                    Sumit.co.il
                  </a>
                  <span> פתרונות תשלום</span>
                </div>
                <div className="sumit-ssl">
                  <span className="ssl-text">SSL Secured Transaction</span>
                  <LockIcon style={{ fontSize: 12 }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Add New Card */}
        {paymentMethod === 'new' && (
          <div className="order-summary__view-add animate-in fade-in slide-in-from-end duration-300">
            <SavedCards
              cards={savedCards}
              selectedCardId={selectedCardId}
              onSelectCard={setSelectedCardId}
              onRemoveCard={onRemoveCard ? handleRemoveCard : undefined}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            >
              <SumitPaymentForm
                variant="order"
                onSubmit={handleNewCardSubmit}
                error={displayError}
                totalAmount={totalAmount}
                isProcessing={processing}
                showHeader={false}
                showFooter={true}
                currency={currency}
                submitButtonText={t('pay', 'לתשלום')}
              />
            </SavedCards>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
