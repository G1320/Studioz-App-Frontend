import React, { useState } from 'react';
import { useLanguageNavigate } from '@shared/hooks';
import { paymeService, PayMeCartItem, PayMeCustomerInfo } from '@shared/services/payme-service';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import './styles/_payme-checkout.scss';

interface PaymeCheckoutProps {
  cartItems: PayMeCartItem[];
  customer: PayMeCustomerInfo;
  vendorId?: string;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
}

export const PaymeCheckout: React.FC<PaymeCheckoutProps> = ({
  cartItems,
  customer,
  vendorId,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const langNavigate = useLanguageNavigate();
  const { t } = useTranslation('forms');

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handlePayment = async () => {
    if (!cartItems || cartItems.length === 0) {
      setError(t('form.payment.errors.emptyCart', 'Cart is empty'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate payment through PayMe
      const paymentResponse = await paymeService.generatePayment({
        amount: totalAmount,
        currency: 'ILS',
        description: `Studio booking - ${cartItems.length} item(s)`,
        customer: {
          name: customer.name || '',
          email: customer.email || '',
          phone: customer.phone
        },
        items: cartItems,
        vendorId,
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/payment-cancelled`
      });

      if (!paymentResponse.success || !paymentResponse.data) {
        throw new Error(paymentResponse.error || 'Failed to generate payment');
      }

      // If payment_url is provided, redirect to PayMe hosted payment page
      if (paymentResponse.data.payment_url) {
        window.location.href = paymentResponse.data.payment_url;
        return;
      }

      // If using Hosted Fields or iframe, handle differently
      if (paymentResponse.data.payment_id) {
        // Process marketplace payment if vendorId is provided
        if (vendorId) {
          const marketplaceResponse = await paymeService.processMarketplacePayment(
            paymentResponse.data.payment_id,
            vendorId,
            cartItems
          );

          if (!marketplaceResponse.success) {
            throw new Error(marketplaceResponse.error || 'Failed to process marketplace payment');
          }
        }

        // Confirm payment
        await paymeService.confirmPayment(paymentResponse.data.payment_id);

        onPaymentSuccess?.(paymentResponse.data.payment_id);
        toast.success(t('form.payment.success', 'Payment processed successfully'));
        langNavigate('/payment-success');
      }
    } catch (err: any) {
      let errorMessage = t('form.payment.errors.generic', 'Payment failed. Please try again.');

      // Handle 404 specifically (backend endpoint not implemented)
      if (err.response?.status === 404) {
        errorMessage = t(
          'form.payment.errors.endpointNotFound',
          'Payment service is not available. Please contact support.'
        );
        console.error('PayMe backend endpoint not found. Please implement the backend API endpoints.');
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      onPaymentError?.(errorMessage);
      toast.error(errorMessage);
      console.error('PayMe payment error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payme-checkout">
      <div className="payme-checkout__summary">
        <h3 className="payme-checkout__title">{t('form.payment.summary.title', 'Order Summary')}</h3>
        <div className="payme-checkout__total">
          <span className="payme-checkout__total-label">{t('form.payment.summary.total', 'Total')}:</span>
          <span className="payme-checkout__total-amount">₪{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {error && <div className="payme-checkout__error">{error}</div>}

      <button
        className="payme-checkout__button"
        onClick={handlePayment}
        disabled={isLoading || !cartItems || cartItems.length === 0}
      >
        {isLoading ? t('form.payment.processing', 'Processing...') : t('form.payment.payNow', 'Pay Now')}
      </button>

      <div className="payme-checkout__security">
        <p className="payme-checkout__security-text">
          {t('form.payment.security', 'Your payment is secure and encrypted')}
        </p>
      </div>
    </div>
  );
};

export default PaymeCheckout;
