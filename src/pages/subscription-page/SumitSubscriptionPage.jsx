import { useUserContext } from '@contexts/UserContext';
import { useEffect, useState } from 'react';
import { sumitService } from '@services/sumit-service';
import { createSubscription, activateSubscription } from '@services/subscription-service';

const SumitSubscriptionPage = () => {
  const [error, setError] = useState('');
  const { user } = useUserContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Create pending subscription
      try {
        const pendingSubscription = await createSubscription({
          userId: user?._id,
          planId: 'starter'
        });
      } catch (error) {
        throw new Error('Failed to create subscription: ' + error.message);
      }

      // 2. Get token from Sumit
      const formData = new FormData();
      formData.append('CardNumber', e.target.CreditCardNumber.value);
      formData.append('ExpirationMonth', e.target.ExpMonth.value);
      formData.append('ExpirationYear', e.target.ExpYear.value);
      formData.append('CVV', e.target.CVV.value);
      formData.append('CitizenID', e.target.CardHolderId.value);
      formData.append('Credentials.CompanyID', import.meta.env.VITE_SUMIT_COMPANY_ID);
      formData.append('Credentials.APIPublicKey', import.meta.env.VITE_SUMIT_PUBLIC_API_KEY);
      formData.append('ResponseLanguage', 'he');

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

      // 3. Process payment with Sumit
      const subscriptionPaymentResponse = await sumitService.createSubscriptionPayment(
        tokenData.Data?.SingleUseToken,
        {
          costumerName: user?.name,
          costumerEmail: user?.email
        },
        {
          name: 'Monthly Subscription',
          amount: 79,
          description: 'Monthly subscription plan',
          durationMonths: 1,
          recurrence: 12
        }
      );

      if (!subscriptionPaymentResponse.success) {
        throw new Error(subscriptionPaymentResponse.error || 'Payment processing failed');
      }

      // 4. Activate subscription
      try {
        await activateSubscription({
          subscriptionId: pendingSubscription.data._id,
          subscriptionDetails: subscriptionPaymentResponse.data
        });

        // Success! You can redirect or show success message here
        console.log('Subscription activated successfully');
      } catch (error) {
        throw new Error('Failed to activate subscription: ' + error.message);
      }
    } catch (error) {
      console.error('Subscription process error:', error);
      setError(error.message || 'Failed to complete subscription process');
    } finally {
      setLoading(false);
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
