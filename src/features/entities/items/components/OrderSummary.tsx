import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { SumitPaymentForm } from '@shared/components';
import { sumitService } from '@shared/services';
import { prepareFormData } from '@features/entities/payments/sumit/utils';
import '../styles/_order-summary.scss';

// --- Types ---
export interface OrderItem {
  id: string;
  label: string;
  value: string | number;
  isPrice?: boolean;
}

export interface SavedCard {
  id: string;
  last4: string;
  brand: 'visa' | 'mastercard' | 'amex';
  expiryMonth: string;
  expiryYear: string;
}

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
    singleUseToken?: string;  // Sumit token for new card
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

  const [paymentMethod, setPaymentMethod] = useState<'saved' | 'new'>(savedCards.length > 0 ? 'saved' : 'new');
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
      // Get Sumit token from the form
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
      {/* Order Details Column */}
      <div className="order-summary__details-column">
        {/* Studio Info Card */}
        <div className="order-summary__card">
          <h3 className="order-summary__card-title">{t('orderDetails', 'פרטי ההזמנה')}</h3>

          <div className="order-summary__info-list">
            {/* Studio */}
            <div className="order-summary__info-item">
              <div className="order-summary__info-icon">
                <LocationOnIcon />
              </div>
              <div className="order-summary__info-content">
                <p className="order-summary__info-primary">{studioName}</p>
                <p className="order-summary__info-secondary">{studioLocation}</p>
              </div>
            </div>

            {/* Date */}
            <div className="order-summary__info-item">
              <div className="order-summary__info-icon order-summary__info-icon--neutral">
                <CalendarTodayIcon />
              </div>
              <div className="order-summary__info-content">
                <p className="order-summary__info-primary">{bookingDate}</p>
                <p className="order-summary__info-secondary">{t('date', 'תאריך')}</p>
              </div>
            </div>

            {/* Time */}
            <div className="order-summary__info-item">
              <div className="order-summary__info-icon order-summary__info-icon--neutral">
                <AccessTimeIcon />
              </div>
              <div className="order-summary__info-content">
                <p className="order-summary__info-primary">{bookingTime}</p>
                <p className="order-summary__info-secondary">{t('time', 'שעה')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Breakdown Card */}
        <div className="order-summary__card">
          <h3 className="order-summary__card-title order-summary__card-title--small">
            {t('priceBreakdown', 'פירוט תשלום')}
          </h3>

          <div className="order-summary__price-list">
            {formattedItems.map((item) => (
              <div key={item.id} className="order-summary__price-item">
                <span className="order-summary__price-label">{item.label}</span>
                <span className="order-summary__price-value">{item.displayValue}</span>
              </div>
            ))}
          </div>

          <div className="order-summary__total-row">
            <span className="order-summary__total-label">{t('totalToPay', 'סה״כ לתשלום')}</span>
            <span className="order-summary__total-value">
              {currency}
              {totalAmount}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Form Column */}
      <div className="order-summary__payment-column">
        <div className="order-summary__payment-card">
          {/* Header */}
          <div className="order-summary__payment-header">
            <h2 className="order-summary__payment-title">{t('paymentMethod', 'אמצעי תשלום')}</h2>
            <div className="order-summary__secure-badge">
              <VerifiedUserIcon />
              <span>{t('securePayment', 'תשלום מאובטח')}</span>
            </div>
          </div>

          {/* Payment Method Toggle */}
          {savedCards.length > 0 && (
            <div className="order-summary__method-toggle">
              <button
                type="button"
                className={`order-summary__method-btn ${paymentMethod === 'saved' ? 'order-summary__method-btn--active' : ''}`}
                onClick={() => setPaymentMethod('saved')}
              >
                <AccountBalanceWalletIcon />
                {t('savedCards', 'כרטיסים שמורים')}
              </button>
              <button
                type="button"
                className={`order-summary__method-btn ${paymentMethod === 'new' ? 'order-summary__method-btn--active' : ''}`}
                onClick={() => setPaymentMethod('new')}
              >
                <AddIcon />
                {t('newCard', 'כרטיס חדש')}
              </button>
            </div>
          )}

          {paymentMethod === 'saved' && savedCards.length > 0 ? (
            /* Saved Cards Selection */
            <form onSubmit={handleSavedCardSubmit} className="order-summary__form">
              {displayError && (
                <div className="order-summary__error">
                  {displayError}
                </div>
              )}

              <div className="order-summary__saved-cards">
                {savedCards.map((card) => (
                  <label
                    key={card.id}
                    className={`order-summary__card-option ${selectedCardId === card.id ? 'order-summary__card-option--selected' : ''}`}
                  >
                    <div className="order-summary__card-option-content">
                      <input
                        type="radio"
                        name="saved_card"
                        className="order-summary__card-radio"
                        checked={selectedCardId === card.id}
                        onChange={() => setSelectedCardId(card.id)}
                      />
                      <div className="order-summary__card-details">
                        <span className="order-summary__card-number">•••• •••• •••• {card.last4}</span>
                        <span className="order-summary__card-expiry">
                          {t('expires', 'תוקף')} {card.expiryMonth}/{card.expiryYear}
                        </span>
                      </div>
                    </div>
                    <div className="order-summary__card-brand">
                      <span>{card.brand.toUpperCase()}</span>
                    </div>
                  </label>
                ))}

                {onRemoveCard && (
                  <button type="button" className="order-summary__remove-card-btn" onClick={handleRemoveCard}>
                    <DeleteIcon />
                    {t('removeSelectedCard', 'הסר כרטיס נבחר')}
                  </button>
                )}
              </div>

              <button type="submit" className="order-summary__submit-btn" disabled={processing}>
                {processing ? (
                  <span className="order-summary__submit-btn-loading">{t('processing', 'מעבד תשלום...')}</span>
                ) : (
                  <>
                    <span>{t('payNow', 'שלם עכשיו')}</span>
                    <span className="order-summary__submit-btn-amount">
                      {currency}
                      {totalAmount}
                    </span>
                  </>
                )}
              </button>

              <p className="order-summary__terms">
                {t('termsAgreement', 'בלחיצה על "שלם עכשיו" אני מסכים/ה')}{' '}
                <a href="/terms">{t('termsOfService', 'לתנאי השימוש')}</a> {t('and', 'ו')}
                <a href="/cancellation-policy">{t('cancellationPolicy', 'מדיניות הביטולים')}</a>
              </p>
            </form>
          ) : (
            /* New Card - Use SumitPaymentForm */
            <div className="order-summary__new-card-wrapper">
              <SumitPaymentForm
                variant="order"
                onSubmit={handleNewCardSubmit}
                error={displayError}
                totalAmount={totalAmount}
                isProcessing={processing}
                showHeader={false}
                showFooter={true}
                currency={currency}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
