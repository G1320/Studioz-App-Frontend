import { useUserContext } from '@core/contexts';
import { useEffect, useState } from 'react';
import { sumitService } from '@shared/services/sumit-service';
import { createSubscription, activateSubscription } from '@shared/services/subscription-service';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { sendSubscriptionConfirmation } from '@shared/services/email-service';

const SumitSubscriptionPaymentForm = ({ plan }) => {
  const [error, setError] = useState('');
  const { user, updateSubscription } = useUserContext();
  const langNavigate = useLanguageNavigate();
  const { t } = useTranslation('forms');

  const createPendingSubscription = async () => {
    try {
      const subscription = await createSubscription({
        userId: user?._id,
        planId: plan.planId
      });

      if (!subscription?._id) {
        throw new Error('Invalid subscription response');
      }

      return subscription;
    } catch (error) {
      throw new Error('Failed to create subscription: ' + error.message);
    }
  };

  const getSumitToken = async (formData) => {
    const tokenResponse = await fetch('https://api.sumit.co.il/creditguy/vault/tokenizesingleuse', {
      method: 'POST',
      headers: {
        accept: 'text/plain'
      },
      body: formData
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.Status !== 0) {
      throw new Error(tokenData.UserErrorMessage || tokenData.TechnicalErrorDetails || 'Failed to get payment token');
    }

    return tokenData.Data?.SingleUseToken;
  };

  const processPayment = async (token) => {
    const paymentResponse = await sumitService.createSubscriptionPayment(
      token,
      {
        costumerName: user?.name,
        costumerEmail: user?.email
      },
      {
        name: `Monthly ${plan.name} Subscription`,
        amount: plan.price,
        description: 'Monthly subscription plan',
        durationMonths: 1,
        recurrence: 48
      }
    );

    if (!paymentResponse?.success) {
      throw new Error(paymentResponse?.error || 'Payment processing failed');
    }

    return paymentResponse;
  };

  const activateSubscriptionWithPayment = async (subscriptionId, paymentDetails) => {
    try {
      return await activateSubscription({
        subscriptionId,
        sumitPaymentResponse: paymentDetails
      });
    } catch (error) {
      throw new Error('Failed to activate subscription: ' + error.message);
    }
  };

  const prepareFormData = (form) => {
    const formData = new FormData();
    formData.append('CardNumber', form.CreditCardNumber.value);
    formData.append('ExpirationMonth', form.ExpMonth.value);
    formData.append('ExpirationYear', form.ExpYear.value);
    formData.append('CVV', form.CVV.value);
    formData.append('CitizenID', form.CardHolderId.value);
    formData.append('Credentials.CompanyID', import.meta.env.VITE_SUMIT_COMPANY_ID);
    formData.append('Credentials.APIPublicKey', import.meta.env.VITE_SUMIT_PUBLIC_API_KEY);
    formData.append('ResponseLanguage', 'he');
    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Create pending subscription
      const pendingSubscription = await createPendingSubscription();

      // 2. Get token from Sumit
      const formData = prepareFormData(e.target);
      const token = await getSumitToken(formData);

      // 3. Process payment with Sumit
      const paymentResponse = await processPayment(token);
      if (!paymentResponse.data) {
        throw new Error('Invalid payment response');
      }
      // 4. Activate subscription
      const activeSubscription = await activateSubscriptionWithPayment(pendingSubscription._id, paymentResponse.data);
      updateSubscription(activeSubscription._id, 'ACTIVE');
      await sendSubscriptionConfirmation(user?.email, {
        customerName: user?.name,
        planName: activeSubscription.planName,
        planPrice: activeSubscription.sumitPaymentDetails.Payment.Amount,
        subscriptionId: activeSubscription._id,
        startDate: new Date()
      });

      console.log('Subscription activated successfully');
      langNavigate('/profile');
    } catch (error) {
      console.error('Subscription process error:', error);
      setError(error.message || 'Failed to complete subscription process');
    }
  };
  return (
    <div className="sumit-payment-form">
      <div className="sumit-payment-form__header">
        <h2>{t('form.payment.header.title')}</h2>
        <p>{t('form.payment.header.subtitle')}</p>
      </div>

      {error && <div className="sumit-payment-form__error">{error}</div>}

      <form className="sumit-payment-form__form" onSubmit={handleSubmit}>
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
              {[...Array(12)].map((_, i) => {
                const month = (i + 1).toString().padStart(2, '0');
                return (
                  <option key={month} value={month}>
                    {month}
                  </option>
                );
              })}
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
              maxLength="4"
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
            maxLength="9"
            required
            placeholder={t('form.payment.idNumber.placeholder')}
          />
        </div>

        <div className="sumit-payment-form__submit">
          <button type="submit">
            {t('form.payment.submit.text')}
            {plan.price}₪
          </button>
        </div>
      </form>

      <div className="sumit-payment-form__footer">
        <p>
          {t('form.payment.footer.secured')}
          <a
            href="https://sumit.co.il"
            target="_blank"
            rel="noopener noreferrer"
            className="sumit-payment-form__footer-link"
          >
            Sumit.co.il
          </a>
          {t('form.payment.footer.solutions')}
        </p>
      </div>
    </div>
  );
};

export default SumitSubscriptionPaymentForm;
