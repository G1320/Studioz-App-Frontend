/**
 * QuickChargeModal Component
 * Modal for processing quick one-time payments (סליקה מהירה)
 * Uses vendor's Sumit credentials to charge and creates receipt
 */
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Trash2, CreditCard, CheckCircle } from 'lucide-react';
import { GenericModal } from '@shared/components/modal';
import { sumitService } from '@shared/services';
import { SumitPaymentForm } from '@shared/components';
import { prepareFormData } from '@features/entities/payments/sumit/utils';
import { useUserContext } from '@core/contexts';

interface LineItem {
  description: string;
  quantity: number;
  price: number;
}

interface QuickChargeFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: LineItem[];
  remarks: string;
}

interface QuickChargeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studioName?: string;
}

type ModalStep = 'details' | 'payment' | 'success';

const INITIAL_ITEM: LineItem = { description: '', quantity: 1, price: 0 };

const INITIAL_FORM_DATA: QuickChargeFormData = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  items: [{ ...INITIAL_ITEM }],
  remarks: ''
};

export const QuickChargeModal: React.FC<QuickChargeModalProps> = ({
  open,
  onClose,
  onSuccess,
  studioName
}) => {
  const { t } = useTranslation('merchantDocs');
  const { user } = useUserContext();
  const [step, setStep] = useState<ModalStep>('details');
  const [formData, setFormData] = useState<QuickChargeFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    amount: number;
    documentUrl?: string;
  } | null>(null);

  const handleClose = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setError(null);
    setStep('details');
    setSuccessData(null);
    onClose();
  }, [onClose]);

  const handleInputChange = (field: keyof QuickChargeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index 
          ? { ...item, [field]: field === 'quantity' || field === 'price' ? Number(value) : value } 
          : item
      )
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...INITIAL_ITEM }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const validateDetailsForm = (): boolean => {
    if (!formData.customerName.trim()) {
      setError(t('quickCharge.errors.nameRequired', 'Customer name is required'));
      return false;
    }
    if (!formData.customerEmail.trim()) {
      setError(t('quickCharge.errors.emailRequired', 'Customer email is required'));
      return false;
    }
    if (!formData.items.some(item => item.description.trim() && item.price > 0)) {
      setError(t('quickCharge.errors.itemsRequired', 'At least one item with description and price is required'));
      return false;
    }
    setError(null);
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateDetailsForm()) {
      setStep('payment');
    }
  };

  const handleBackToDetails = () => {
    setStep('details');
    setError(null);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Get Sumit token from form
      const form = e.target as HTMLFormElement;
      const tokenFormData = prepareFormData(form);
      const singleUseToken = await sumitService.getSumitToken(tokenFormData);

      // Process the quick charge
      const response = await sumitService.quickCharge({
        singleUseToken,
        customerInfo: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone || undefined
        },
        items: formData.items.filter(item => item.description.trim() && item.price > 0),
        description: formData.items[0]?.description || 'Quick Charge',
        remarks: formData.remarks || undefined,
        vendorId: user?._id || ''
      });

      if (!response.success) {
        throw new Error(response.error || t('quickCharge.errors.paymentFailed', 'Payment failed'));
      }

      // Success!
      setSuccessData({
        amount: response.data?.amount || calculateTotal(),
        documentUrl: response.data?.documentUrl || response.data?.greenInvoiceUrl
      });
      setStep('success');
      onSuccess();

    } catch (err: any) {
      console.error('Quick charge error:', err);
      setError(err.message || t('quickCharge.errors.paymentFailed', 'Payment failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = calculateTotal();

  return (
    <GenericModal open={open} onClose={handleClose} className="quick-charge-modal">
      <div className="quick-charge-modal__content">
        {/* Header */}
        <div className="quick-charge-modal__header">
          <div className="quick-charge-modal__header-icon">
            <CreditCard size={24} />
          </div>
          <h2>{t('quickCharge.title', 'סליקה מהירה')}</h2>
          <button
            type="button"
            className="quick-charge-modal__close"
            onClick={handleClose}
            aria-label={t('quickCharge.close', 'Close')}
          >
            <X size={20} />
          </button>
        </div>

        {studioName && (
          <div className="quick-charge-modal__studio-info">
            <span>{studioName}</span>
          </div>
        )}

        {/* Step Indicator */}
        <div className="quick-charge-modal__steps">
          <div className={`quick-charge-modal__step ${step === 'details' ? 'active' : 'completed'}`}>
            <span className="quick-charge-modal__step-number">1</span>
            <span className="quick-charge-modal__step-label">{t('quickCharge.steps.details', 'פרטים')}</span>
          </div>
          <div className="quick-charge-modal__step-divider" />
          <div className={`quick-charge-modal__step ${step === 'payment' ? 'active' : step === 'success' ? 'completed' : ''}`}>
            <span className="quick-charge-modal__step-number">2</span>
            <span className="quick-charge-modal__step-label">{t('quickCharge.steps.payment', 'תשלום')}</span>
          </div>
          <div className="quick-charge-modal__step-divider" />
          <div className={`quick-charge-modal__step ${step === 'success' ? 'active' : ''}`}>
            <span className="quick-charge-modal__step-number">3</span>
            <span className="quick-charge-modal__step-label">{t('quickCharge.steps.done', 'סיום')}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="quick-charge-modal__error">
            {error}
          </div>
        )}

        {/* Step 1: Customer & Items Details */}
        {step === 'details' && (
          <div className="quick-charge-modal__details-form">
            {/* Customer Details */}
            <div className="quick-charge-modal__section">
              <h3>{t('quickCharge.customerDetails', 'פרטי לקוח')}</h3>
              <div className="quick-charge-modal__row">
                <div className="quick-charge-modal__field">
                  <label htmlFor="qc-customerName">{t('quickCharge.customerName', 'שם לקוח')} *</label>
                  <input
                    id="qc-customerName"
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder={t('quickCharge.customerNamePlaceholder', 'הזן שם לקוח')}
                  />
                </div>
                <div className="quick-charge-modal__field">
                  <label htmlFor="qc-customerEmail">{t('quickCharge.customerEmail', 'אימייל')} *</label>
                  <input
                    id="qc-customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="quick-charge-modal__row">
                <div className="quick-charge-modal__field">
                  <label htmlFor="qc-customerPhone">{t('quickCharge.customerPhone', 'טלפון')}</label>
                  <input
                    id="qc-customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    placeholder="050-0000000"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="quick-charge-modal__section">
              <h3>{t('quickCharge.items', 'פירוט התשלום')}</h3>
              <div className="quick-charge-modal__items">
                {formData.items.map((item, index) => (
                  <div key={index} className="quick-charge-modal__item">
                    <div className="quick-charge-modal__item-row">
                      <div className="quick-charge-modal__field quick-charge-modal__field--description">
                        <label htmlFor={`qc-item-desc-${index}`}>{t('quickCharge.itemDescription', 'תיאור')}</label>
                        <input
                          id={`qc-item-desc-${index}`}
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          placeholder={t('quickCharge.itemDescriptionPlaceholder', 'תיאור השירות/מוצר')}
                        />
                      </div>
                      <div className="quick-charge-modal__field quick-charge-modal__field--qty">
                        <label htmlFor={`qc-item-qty-${index}`}>{t('quickCharge.quantity', 'כמות')}</label>
                        <input
                          id={`qc-item-qty-${index}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        />
                      </div>
                      <div className="quick-charge-modal__field quick-charge-modal__field--price">
                        <label htmlFor={`qc-item-price-${index}`}>{t('quickCharge.price', 'מחיר')} (₪)</label>
                        <input
                          id={`qc-item-price-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        />
                      </div>
                      <div className="quick-charge-modal__field quick-charge-modal__field--total">
                        <label>{t('quickCharge.itemTotal', 'סה"כ')}</label>
                        <span className="quick-charge-modal__item-total">
                          ₪{(item.quantity * item.price).toLocaleString()}
                        </span>
                      </div>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          className="quick-charge-modal__remove-item"
                          onClick={() => removeItem(index)}
                          aria-label={t('quickCharge.removeItem', 'הסר פריט')}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="quick-charge-modal__add-item"
                onClick={addItem}
              >
                <Plus size={16} />
                {t('quickCharge.addItem', 'הוסף פריט')}
              </button>
            </div>

            {/* Remarks */}
            <div className="quick-charge-modal__section">
              <div className="quick-charge-modal__field">
                <label htmlFor="qc-remarks">{t('quickCharge.remarks', 'הערות')}</label>
                <textarea
                  id="qc-remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  placeholder={t('quickCharge.remarksPlaceholder', 'הערות נוספות (אופציונלי)')}
                  rows={2}
                />
              </div>
            </div>

            {/* Total */}
            <div className="quick-charge-modal__total-section">
              <div className="quick-charge-modal__total">
                <span>{t('quickCharge.totalToCharge', 'סכום לחיוב')}</span>
                <span className="quick-charge-modal__total-amount">₪{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="quick-charge-modal__actions">
              <button
                type="button"
                className="quick-charge-modal__btn quick-charge-modal__btn--secondary"
                onClick={handleClose}
              >
                {t('quickCharge.cancel', 'ביטול')}
              </button>
              <button
                type="button"
                className="quick-charge-modal__btn quick-charge-modal__btn--primary"
                onClick={handleContinueToPayment}
                disabled={totalAmount <= 0}
              >
                {t('quickCharge.continueToPayment', 'המשך לתשלום')}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 'payment' && (
          <div className="quick-charge-modal__payment-form">
            <div className="quick-charge-modal__payment-summary">
              <div className="quick-charge-modal__payment-summary-row">
                <span>{t('quickCharge.customer', 'לקוח')}:</span>
                <span>{formData.customerName}</span>
              </div>
              <div className="quick-charge-modal__payment-summary-row quick-charge-modal__payment-summary-row--total">
                <span>{t('quickCharge.amount', 'סכום')}:</span>
                <span>₪{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <SumitPaymentForm
              onSubmit={handlePaymentSubmit}
              error={error || undefined}
              totalAmount={totalAmount}
              isProcessing={isSubmitting}
              variant="order"
              submitButtonText={t('quickCharge.chargeNow', 'חייב עכשיו')}
              showHeader={false}
              showCouponInput={false}
            />

            <button
              type="button"
              className="quick-charge-modal__back-btn"
              onClick={handleBackToDetails}
              disabled={isSubmitting}
            >
              {t('quickCharge.backToDetails', 'חזור לפרטים')}
            </button>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && successData && (
          <div className="quick-charge-modal__success">
            <div className="quick-charge-modal__success-icon">
              <CheckCircle size={48} />
            </div>
            <h3>{t('quickCharge.success.title', 'התשלום בוצע בהצלחה!')}</h3>
            <p className="quick-charge-modal__success-amount">
              ₪{successData.amount.toLocaleString()}
            </p>
            <p className="quick-charge-modal__success-message">
              {t('quickCharge.success.message', 'קבלה נשלחה ללקוח באימייל')}
            </p>

            {successData.documentUrl && (
              <a
                href={successData.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="quick-charge-modal__success-link"
              >
                {t('quickCharge.success.viewReceipt', 'צפה בקבלה')}
              </a>
            )}

            <button
              type="button"
              className="quick-charge-modal__btn quick-charge-modal__btn--primary"
              onClick={handleClose}
            >
              {t('quickCharge.success.done', 'סיום')}
            </button>
          </div>
        )}
      </div>
    </GenericModal>
  );
};

export default QuickChargeModal;
