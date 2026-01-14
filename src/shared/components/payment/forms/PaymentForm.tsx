import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { validateCoupon, CouponValidationResult } from '@shared/services/coupon-service';
import { LockIcon } from '@shared/components/icons';

export type PaymentFormVariant = 'subscription' | 'order' | 'default';

interface SumitPaymentFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  error?: string;
  totalAmount?: number;
  planId?: string;
  onCouponApplied?: (coupon: CouponValidationResult['coupon'] | null) => void;
  showCouponInput?: boolean;
  isProcessing?: boolean;
  /**
   * Form variant to customize appearance and behavior
   * - 'subscription': For recurring subscriptions (shows coupon, "Subscribe" button)
   * - 'order': For one-time orders/reservations (no coupon, "Pay Now" button)
   * - 'default': Standard payment form
   */
  variant?: PaymentFormVariant;
  /** Custom submit button text (overrides variant default) */
  submitButtonText?: string;
  /** Whether to show the header section */
  showHeader?: boolean;
  /** Whether to show the footer section */
  showFooter?: boolean;
  /** Currency symbol */
  currency?: string;
}

export const SumitPaymentForm: React.FC<SumitPaymentFormProps> = ({
  onSubmit,
  error,
  totalAmount,
  planId,
  onCouponApplied,
  showCouponInput,
  isProcessing = false,
  variant = 'default',
  submitButtonText,
  showHeader = true,
  showFooter = true,
  currency = '₪'
}) => {
  const { t } = useTranslation('forms');
  
  // Derive defaults from variant
  const shouldShowCoupon = showCouponInput ?? (variant === 'subscription');
  
  // Get submit button text based on variant
  const getSubmitText = () => {
    if (submitButtonText) return submitButtonText;
    switch (variant) {
      case 'subscription':
        return t('form.payment.submit.subscribe', 'Subscribe');
      case 'order':
        return t('form.payment.submit.payNow', 'Pay Now');
      default:
        return t('form.payment.submit.text', 'Complete Payment');
    }
  };
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult['coupon'] | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError(t('form.payment.coupon.errorEmpty', 'Please enter a coupon code'));
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const result = await validateCoupon(couponCode, planId, totalAmount);
      if (result.valid) {
        setAppliedCoupon(result.coupon);
        setCouponSuccess(
          result.coupon.discountType === 'percentage'
            ? t('form.payment.coupon.successPercent', { percent: result.coupon.discountValue })
            : t('form.payment.coupon.successFixed', { amount: result.coupon.discountValue })
        );
        onCouponApplied?.(result.coupon);
      }
    } catch (err: any) {
      setCouponError(err.message || t('form.payment.coupon.errorInvalid', 'Invalid coupon code'));
      setAppliedCoupon(null);
      onCouponApplied?.(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponError('');
    setCouponSuccess('');
    onCouponApplied?.(null);
  };

  const finalAmount = appliedCoupon
    ? Math.max(0, (totalAmount || 0) - appliedCoupon.discountAmount)
    : totalAmount;

  const couponStatus = appliedCoupon ? 'success' : couponError ? 'error' : 'idle';

  return (
    <div className={`sumit-payment-form sumit-payment-form--${variant}`}>
      {showHeader && (
        <div className="sumit-payment-form__header">
          <h2>{t('form.payment.header.title')}</h2>
          <p>{t('form.payment.header.subtitle')}</p>

          {/* Custom Divider with Gold Accent */}
          <div className="sumit-payment-form__header-divider" aria-hidden="true">
            <div className="sumit-payment-form__divider-line" />
            <div className="sumit-payment-form__divider-accent" />
          </div>
        </div>
      )}

      {error && <div className="sumit-payment-form__error">{error}</div>}

      {appliedCoupon && totalAmount && (
        <div className="sumit-payment-form__discount-summary">
          <div className="sumit-payment-form__discount-row">
            <span>{t('form.payment.subtotal', 'Subtotal')}:</span>
            <span>{currency}{totalAmount}</span>
          </div>
          <div className="sumit-payment-form__discount-row sumit-payment-form__discount-row--discount">
            <span>{t('form.payment.discount', 'Discount')} ({appliedCoupon.code}):</span>
            <span>-{currency}{appliedCoupon.discountAmount}</span>
          </div>
          <div className="sumit-payment-form__discount-row sumit-payment-form__discount-row--total">
            <span>{t('form.payment.total', 'Total')}:</span>
            <span>{currency}{finalAmount}</span>
          </div>
        </div>
      )}

      <form className="sumit-payment-form__form" onSubmit={onSubmit}>
        <div className="sumit-payment-form__field sumit-payment-form__field--card-number">
          <label>{t('form.payment.cardNumber.label')}</label>
          <input
            type="text"
            name="CreditCardNumber"
            data-og="cardnumber"
            required
            placeholder={t('form.payment.cardNumber.placeholder')}
          />
        </div>

        <div className="sumit-payment-form__date-cvv">
          <div className="sumit-payment-form__field">
            <label>{t('form.payment.expiration.month.label')}</label>
            <select name="ExpMonth" data-og="expirationmonth" required>
              <option value="">{t('form.payment.expiration.month.placeholder')}</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                  {(i + 1).toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          <div className="sumit-payment-form__field">
            <label>{t('form.payment.expiration.year.label')}</label>
            <select name="ExpYear" data-og="expirationyear" required>
              <option value="">{t('form.payment.expiration.year.placeholder')}</option>
              {[...Array(10)].map((_, i) => {
                const year = (new Date().getFullYear() + i).toString();
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="sumit-payment-form__field">
            <label>{t('form.payment.cvv.label')}</label>
            <input
              type="text"
              name="CVV"
              data-og="cvv"
              maxLength={4}
              required
              placeholder={t('form.payment.cvv.placeholder')}
            />
          </div>
        </div>

        <div className="sumit-payment-form__field">
          <label>{t('form.payment.idNumber.label')}</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="citizen-id"
            data-og="citizenid"
            autoComplete="one-time-code"
            maxLength={9}
            required
            placeholder={t('form.payment.idNumber.placeholder')}
          />
        </div>

        {shouldShowCoupon && (
          <div className="sumit-payment-form__coupon">
            <label>{t('form.payment.coupon.label', 'Coupon Code')}</label>
            <div className="sumit-payment-form__coupon-input">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder={t('form.payment.coupon.placeholder', 'Enter coupon code')}
                disabled={!!appliedCoupon || isValidatingCoupon}
                className={couponStatus === 'error' ? 'error' : couponStatus === 'success' ? 'success' : ''}
              />
              {!appliedCoupon ? (
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isValidatingCoupon}
                  className="sumit-payment-form__coupon-btn"
                >
                  {isValidatingCoupon
                    ? t('form.payment.coupon.validating', 'Validating...')
                    : t('form.payment.coupon.apply', 'Apply')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="sumit-payment-form__coupon-btn sumit-payment-form__coupon-btn--success"
                >
                  {t('form.payment.coupon.applied', 'Applied')}
                </button>
              )}
            </div>
            {couponError && <div className="sumit-payment-form__coupon-error">{couponError}</div>}
            {couponSuccess && <div className="sumit-payment-form__coupon-success">{couponSuccess}</div>}
          </div>
        )}

        {/* Divider before CTA */}
        <div className="sumit-payment-form__divider" aria-hidden="true" />

        <div className="sumit-payment-form__submit">
          <button type="submit" disabled={isProcessing}>
            {isProcessing ? (
              <span className="animate-pulse">{t('form.payment.submit.processing', 'Processing payment...')}</span>
            ) : (
              <>
                <span>{getSubmitText()}</span>
                {finalAmount !== undefined && <span>{currency}{finalAmount}</span>}
              </>
            )}
          </button>
        </div>
      </form>

      {showFooter && (
        <div className="sumit-payment-form__footer">
          <div className="sumit-payment-form__footer-secured">
            <span>{t('form.payment.footer.secured')}</span>
            <a href="https://sumit.co.il" target="_blank" rel="noopener noreferrer">
              Sumit.co.il
            </a>
            <span>{t('form.payment.footer.solutions')}</span>
          </div>
          <div className="sumit-payment-form__footer-ssl">
            <LockIcon sx={{ fontSize: 12 }} />
            <span>SSL Secured Transaction</span>
          </div>
        </div>
      )}
    </div>
  );
};
