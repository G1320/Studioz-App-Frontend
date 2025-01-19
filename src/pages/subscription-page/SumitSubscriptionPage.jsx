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
          CompanyID: 627914026,
          APIPublicKey: 'lGs1HCXGTotE4R471WmBoTh252I2BaA4YqAAWrgf5AoUrW7Qu0',
          Debug: true,
          OnSuccess: (response) => {
            console.log('Payment success:', response);
            if (response.Data?.Token) {
              console.log('Token received:', response.Data.Token);
            }
          },
          OnError: (error) => {
            console.error('Payment error:', error);
            setError(error?.Description || 'Payment error occurred');
          },
          OnValidate: (formData) => {
            console.log('Validating form data:', formData);
            return true;
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
    <div className="max-w-md mx-auto p-4">
      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {status === 'initializing' ? (
        <div>Loading payment form...</div>
      ) : (
        <form data-og="form" id="payment-form" className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Card Number</label>
            <input
              type="text"
              name="CreditCardNumber"
              data-og="cardnumber"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Month</label>
              <select
                name="ExpMonth"
                data-og="expirationmonth"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              >
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
              <label className="block text-sm font-medium">Year</label>
              <select
                name="ExpYear"
                data-og="expirationyear"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              >
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
            <label className="block text-sm font-medium">CVV</label>
            <input
              type="text"
              name="CVV"
              data-og="cvv"
              maxLength="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">ID Number</label>
            <input
              type="text"
              name="CardHolderId"
              data-og="citizenid"
              maxLength="9"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Submit Payment
          </button>
        </form>
      )}
    </div>
  );
};

export default SumitSubscriptionPage;
