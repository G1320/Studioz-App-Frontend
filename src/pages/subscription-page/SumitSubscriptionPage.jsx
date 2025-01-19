import { useEffect, useState } from 'react';

const SumitSubscriptionPage = () => {
  const [status, setStatus] = useState('initializing');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkDependencies = () => {
      if (window.jQuery && window.OfficeGuy) {
        initializeSumit();
      } else {
        setTimeout(checkDependencies, 100);
      }
    };

    const initializeSumit = () => {
      try {
        // First set default settings
        window.OfficeGuy.Payments.DefaultSettings({
          Language: 'he',
          RequireCardHolderId: true,
          RequireCVV: true
        });

        // Then bind the form
        window.OfficeGuy.Payments.BindFormSubmit({
          CompanyID: import.meta.env.VITE_SUMIT_COMPANY_ID,
          APIPublicKey: import.meta.env.VITE_SUMIT_PUBLIC_API_KEY,
          Debug: true,

          ResponseCallback: (response) => {
            console.log('ResponseCallback triggered:', response);
            if (response.Status === 0) {
              const token = response.Data?.SingleUseToken;
              console.log('Token received:', token);
            } else {
              console.error('Error:', response.UserErrorMessage || response.TechnicalErrorDetails);
            }
          }
        });
        setStatus('ready');
      } catch (error) {
        console.error('Initialization error:', error);
        setError('Failed to initialize payment system');
      }
    };

    checkDependencies();
  }, []);

  return (
    <div>
      {error && <div>{error}</div>}

      {status === 'initializing' ? (
        <div>Loading payment form...</div>
      ) : (
        <form data-og="form" id="payment-form">
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
      )}
    </div>
  );
};

export default SumitSubscriptionPage;
