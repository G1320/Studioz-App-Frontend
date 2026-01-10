import { useUserContext } from '@core/contexts';
import { useLanguageNavigate } from '@shared/hooks';
import { useState } from 'react';
import { SumitPaymentForm } from '@shared/components';
import { sumitService } from '@shared/services';
import { prepareFormData } from '../utils';

export const SumitMultiVendorPaymentForm = ({ cartItems, customer, vendorId }) => {
  const [error, setError] = useState('');
  const { user } = useUserContext();
  const langNavigate = useLanguageNavigate();

  const processPayment = async (token) => {
    const paymentResponse = await sumitService.multivendorCharge({
      vendorId,
      singleUseToken: token,
      items: cartItems,
      customerInfo: {
        name: customer.name || user?.name,
        email: customer.email || user?.email,
        phone: customer.phone
      }
    });

    if (!paymentResponse?.success) {
      throw new Error(paymentResponse?.error || 'Payment failed');
    }
    return paymentResponse;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formData = prepareFormData(e.target);
      const token = await sumitService.getSumitToken(formData);
      await processPayment(token);
      langNavigate('/payment-success');
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed');
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return <SumitPaymentForm onSubmit={handleSubmit} error={error} totalAmount={totalAmount} />;
};
