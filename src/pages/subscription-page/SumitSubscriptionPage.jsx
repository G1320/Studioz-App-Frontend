import { sumitService } from '@services/sumit-service';
import { useEffect, useState } from 'react';

const SumitSubscriptionPage = () => {
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Append form fields matching the cURL example exactly
      formData.append('CardNumber', e.target.CreditCardNumber.value);
      formData.append('ExpirationMonth', e.target.ExpMonth.value);
      formData.append('ExpirationYear', e.target.ExpYear.value);
      formData.append('CVV', e.target.CVV.value);
      formData.append('CitizenID', e.target.CardHolderId.value);
      formData.append('Credentials.CompanyID', import.meta.env.VITE_SUMIT_COMPANY_ID);
      formData.append('Credentials.APIPublicKey', import.meta.env.VITE_SUMIT_PUBLIC_API_KEY);
      formData.append('ResponseLanguage', 'he');

      const response = await fetch('https://api.sumit.co.il/creditguy/vault/tokenizesingleuse', {
        method: 'POST',
        headers: {
          accept: 'text/plain'
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.UserErrorMessage || data.TechnicalErrorDetails || 'Failed to process payment');
      }

      console.log('Payment success:', data);

      if (data.Data?.Token) {
        console.log('Token received:', data.Data.Token);
      }

      if (data.Status === 0) {
        const token = data.Data?.SingleUseToken;
        const paymentResponse = await sumitService.processCreditCardPayment(token, 100, 'test');
        // Save the token or proceed with your logic
      } else {
        console.error('Error:', data.UserErrorMessage || data.TechnicalErrorDetails);
        setError(data.UserErrorMessage || data.TechnicalErrorDetails || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to process payment');
    }

    return false;
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
