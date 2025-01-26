import { useUserContext } from '@core/contexts';
import { useLanguageNavigate } from '@shared/hooks';
import { useState } from 'react';
import { SumitPaymentForm } from '@shared/components';
import { sumitService } from '@shared/services';

export const SumitMultiVendorPaymentForm = ({ cartItems, customerInfo }) => {
  const [error, setError] = useState('');
  const { user } = useUserContext();
  const langNavigate = useLanguageNavigate();

  const processPayment = async (token) => {
    const paymentResponse = await sumitService.multivendorCharge({
      singleUseToken: token,
      items: cartItems,
      customerInfo: {
        name: customerInfo.name || user?.name,
        email: customerInfo.email || user?.email,
        phone: customerInfo.phone
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

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return <SumitPaymentForm onSubmit={handleSubmit} error={error} totalAmount={totalAmount} />;
};
