import { useUserContext } from '@contexts/UserContext';
import { useEffect, useState } from 'react';
import { sumitService } from '@services/sumit-service';
import { createSubscription, activateSubscription } from '@services/subscription-service';

const SumitSubscriptionPage = () => {
  const [error, setError] = useState('');
  const { user } = useUserContext();

  const createPendingSubscription = async () => {
    try {
      const subscription = await createSubscription({
        userId: user?._id,
        planId: 'starter'
      });

      console.log('subscription: ', subscription);
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
        name: 'Monthly Subscription',
        amount: 5,
        description: 'Monthly subscription plan',
        durationMonths: 1,
        recurrence: 12
      }
    );

    console.log('Payment response:', paymentResponse);

    if (!paymentResponse?.success) {
      throw new Error(paymentResponse?.error || 'Payment processing failed');
    }

    return paymentResponse;
  };

  const activateSubscriptionWithPayment = async (subscriptionId, paymentDetails) => {
    try {
      await activateSubscription({
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
      await activateSubscriptionWithPayment(pendingSubscription._id, paymentResponse.data);

      console.log('Subscription activated successfully');
      // Handle success (redirect, show message, etc.)
    } catch (error) {
      console.error('Subscription process error:', error);
      setError(error.message || 'Failed to complete subscription process');
    }
  };

  return (
    <div>
      {error && <div>{error}</div>}
      <form data-og="form" id="payment-form" onSubmit={handleSubmit}>
        <div>
          <label>Card Number</label>
          <input type="text" name="CreditCardNumber" data-og="cardnumber" required />
        </div>

        <div>
          <div>
            <label>Month</label>
            <select name="ExpMonth" data-og="expirationmonth" required>
              <option value="">Month</option>
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
          <div>
            <label>Year</label>
            <select name="ExpYear" data-og="expirationyear" required>
              <option value="">Year</option>
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
        </div>

        <div>
          <label>CVV</label>
          <input type="text" name="CVV" data-og="cvv" maxLength="4" required />
        </div>

        <div>
          <label>ID Number</label>
          <input type="text" name="CardHolderId" data-og="citizenid" maxLength="9" required />
        </div>

        <button type="submit">Submit Payment</button>
      </form>
    </div>
  );
};

export default SumitSubscriptionPage;
