import { useTranslation } from 'react-i18next';

interface SumitPaymentFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  error?: string;
  totalAmount?: number;
}

export const SumitPaymentForm: React.FC<SumitPaymentFormProps> = ({ onSubmit, error, totalAmount }) => {
  const { t } = useTranslation('forms');

  return (
    <div className="sumit-payment-form">
      <div className="sumit-payment-form__header">
        <h2>{t('form.payment.header.title')}</h2>
        <p>{t('form.payment.header.subtitle')}</p>
      </div>

      {error && <div className="sumit-payment-form__error">{error}</div>}

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
            name="CardHolderId"
            data-og="citizenid"
            autoComplete="off"
            maxLength={9}
            required
            placeholder={t('form.payment.idNumber.placeholder')}
          />
        </div>

        <div className="sumit-payment-form__submit">
          <button type="submit">
            {t('form.payment.submit.text')}
            {totalAmount && `${totalAmount}₪`}
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
