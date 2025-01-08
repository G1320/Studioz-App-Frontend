import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payment = ({ amount, vendorId, description }) => {
  const [hostedFields, setHostedFields] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize BlueSnap hosted fields
    const initializeBlueSnap = async () => {
      try {
        // Get token from your backend
        const {
          data: { token }
        } = await axios.get('/api/bluesnap/token');

        // Initialize BlueSnap hosted payment fields
        const bsFields = bluesnap.hostedPaymentFieldsCreate({
          token: token,
          targetElement: 'payment-form',
          ccnHolder: {
            selector: 'ccn-holder',
            style: 'form-control'
          },
          ccNumber: {
            selector: 'ccn',
            style: 'form-control'
          },
          cvv: {
            selector: 'cvv',
            style: 'form-control'
          },
          exp: {
            selector: 'exp',
            style: 'form-control'
          }
        });

        setHostedFields(bsFields);
        setLoading(false);
      } catch (err) {
        setError('Failed to initialize payment form');
        setLoading(false);
      }
    };

    initializeBlueSnap();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Submit hosted fields to get payment fields token
      const result = await hostedFields.submit();

      if (result.error) {
        setError(result.error);
        return;
      }

      // Submit payment to your backend
      const response = await axios.post('/api/bluesnap/process-payment', {
        paymentFieldsToken: result.token,
        amount: amount,
        vendorId: vendorId,
        description: description
      });

      // Handle successful payment
      if (response.data.success) {
        // Redirect to success page or update UI
      }
    } catch (err) {
      setError('Payment processing failed');
    }
  };

  if (loading) return <div>Loading payment form...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="payment-container">
      <form id="payment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Card Holder Name</label>
          <div id="ccn-holder"></div>
        </div>
        <div className="form-group">
          <label>Card Number</label>
          <div id="ccn"></div>
        </div>
        <div className="form-row">
          <div className="form-group col">
            <label>Expiration</label>
            <div id="exp"></div>
          </div>
          <div className="form-group col">
            <label>CVV</label>
            <div id="cvv"></div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Pay {amount} ILS
        </button>
      </form>
    </div>
  );
};

export default Payment;
