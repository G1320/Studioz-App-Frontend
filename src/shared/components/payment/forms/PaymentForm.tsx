import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { validateCoupon, CouponValidationResult } from '@shared/services/coupon-service';

interface SumitPaymentFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  error?: string;
  totalAmount?: number;
  planId?: string;
  onCouponApplied?: (coupon: CouponValidationResult['coupon'] | null) => void;
  showCouponInput?: boolean;
}

export const SumitPaymentForm: React.FC<SumitPaymentFormProps> = ({
  onSubmit,
  error,
  totalAmount,
  planId,
  onCouponApplied,
  showCouponInput = true
}) => {
  const { t } = useTranslation('forms');
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

  return (
    <div className="sumit-payment-form">
      <div className="sumit-payment-form__header">
        <h2>{t('form.payment.header.title')}</h2>
        <p>{t('form.payment.header.subtitle')}</p>
      </div>

      {error && <div className="sumit-payment-form__error">{error}</div>}

      {showCouponInput && (
        <div className="sumit-payment-form__coupon">
          <label>{t('form.payment.coupon.label', 'Coupon Code')}</label>
          <div className="sumit-payment-form__coupon-input">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder={t('form.payment.coupon.placeholder', 'Enter coupon code')}
              disabled={!!appliedCoupon || isValidatingCoupon}
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
                className="sumit-payment-form__coupon-btn sumit-payment-form__coupon-btn--remove"
              >
                {t('form.payment.coupon.remove', 'Remove')}
              </button>
            )}
          </div>
          {couponError && <div className="sumit-payment-form__coupon-error">{couponError}</div>}
          {couponSuccess && <div className="sumit-payment-form__coupon-success">{couponSuccess}</div>}
        </div>
      )}

      {appliedCoupon && totalAmount && (
        <div className="sumit-payment-form__discount-summary">
          <div className="sumit-payment-form__discount-row">
            <span>{t('form.payment.subtotal', 'Subtotal')}:</span>
            <span>₪{totalAmount}</span>
          </div>
          <div className="sumit-payment-form__discount-row sumit-payment-form__discount-row--discount">
            <span>{t('form.payment.discount', 'Discount')} ({appliedCoupon.code}):</span>
            <span>-₪{appliedCoupon.discountAmount}</span>
          </div>
          <div className="sumit-payment-form__discount-row sumit-payment-form__discount-row--total">
            <span>{t('form.payment.total', 'Total')}:</span>
            <span>₪{finalAmount}</span>
          </div>
        </div>
      )}

      <form className="sumit-payment-form__form" onSubmit={onSubmit}>
        <div className="sumit-payment-form__field">
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

        <div className="sumit-payment-form__submit">
          <button type="submit">
            {t('form.payment.submit.text')}
            {finalAmount !== undefined && `${finalAmount}₪`}
          </button>
        </div>
      </form>

      <div className="sumit-payment-form__footer">
        <p>
          {t('form.payment.footer.secured')}
          <a href="https://sumit.co.il" target="_blank" rel="noopener noreferrer">
            Sumit.co.il
          </a>
          {t('form.payment.footer.solutions')}
        </p>
      </div>
    </div>
  );
};
