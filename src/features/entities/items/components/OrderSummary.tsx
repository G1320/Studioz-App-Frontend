import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
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
  onPaymentSubmit?: (paymentData: {
    method: 'saved' | 'new';
    cardId?: string;
    newCard?: {
      number: string;
      expiry: string;
      cvv: string;
      holderId: string;
    };
  }) => void;
  onRemoveCard?: (cardId: string) => void;
  currency?: string;
  isProcessing?: boolean;
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
  isProcessing: externalProcessing = false
}) => {
  const { t, i18n } = useTranslation('orders');
  const isRTL = i18n.language === 'he';

  const [paymentMethod, setPaymentMethod] = useState<'saved' | 'new'>(
    savedCards.length > 0 ? 'saved' : 'new'
  );
  const [selectedCardId, setSelectedCardId] = useState<string>(savedCards[0]?.id || '');
  const [newCardData, setNewCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holderId: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const processing = externalProcessing || isProcessing;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate processing delay for UX
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSubmit?.({
        method: paymentMethod,
        cardId: paymentMethod === 'saved' ? selectedCardId : undefined,
        newCard: paymentMethod === 'new' ? newCardData : undefined
      });
    }, 1500);
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

          <form onSubmit={handleSubmit} className="order-summary__form">
            {paymentMethod === 'saved' && savedCards.length > 0 ? (
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
                  <button
                    type="button"
                    className="order-summary__remove-card-btn"
                    onClick={handleRemoveCard}
                  >
                    <DeleteIcon />
                    {t('removeSelectedCard', 'הסר כרטיס נבחר')}
                  </button>
                )}
              </div>
            ) : (
              /* New Card Form */
              <div className="order-summary__new-card-form">
                <div className="order-summary__input-group">
                  <label className="order-summary__input-label">{t('cardNumber', 'מספר כרטיס')}</label>
                  <div className="order-summary__input-wrapper">
                    <input
                      type="text"
                      className="order-summary__input"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      value={newCardData.number}
                      onChange={(e) => setNewCardData({ ...newCardData, number: e.target.value })}
                    />
                    <CreditCardIcon className="order-summary__input-icon" />
                  </div>
                </div>

                <div className="order-summary__input-row">
                  <div className="order-summary__input-group">
                    <label className="order-summary__input-label">{t('expiry', 'תוקף (MM/YY)')}</label>
                    <input
                      type="text"
                      className="order-summary__input"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={newCardData.expiry}
                      onChange={(e) => setNewCardData({ ...newCardData, expiry: e.target.value })}
                    />
                  </div>
                  <div className="order-summary__input-group">
                    <label className="order-summary__input-label">CVV</label>
                    <input
                      type="text"
                      className="order-summary__input"
                      placeholder="123"
                      maxLength={3}
                      value={newCardData.cvv}
                      onChange={(e) => setNewCardData({ ...newCardData, cvv: e.target.value })}
                    />
                  </div>
                </div>

                <div className="order-summary__input-group">
                  <label className="order-summary__input-label">{t('holderId', 'תעודת זהות של בעל הכרטיס')}</label>
                  <input
                    type="text"
                    className="order-summary__input"
                    placeholder={t('holderIdPlaceholder', 'מספר תעודת זהות (9 ספרות)')}
                    maxLength={9}
                    value={newCardData.holderId}
                    onChange={(e) => setNewCardData({ ...newCardData, holderId: e.target.value })}
                  />
                </div>

                <div className="order-summary__accepted-cards">
                  <div className="order-summary__accepted-cards-line" />
                  <span className="order-summary__accepted-cards-text">{t('weAccept', 'אנו מקבלים')}</span>
                  <div className="order-summary__accepted-cards-icons">
                    <div className="order-summary__card-icon" />
                    <div className="order-summary__card-icon" />
                    <div className="order-summary__card-icon" />
                  </div>
                  <div className="order-summary__accepted-cards-line" />
                </div>
              </div>
            )}

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
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
