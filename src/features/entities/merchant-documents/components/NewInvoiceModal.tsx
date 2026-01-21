/**
 * NewInvoiceModal Component
 * Modal for creating a new invoice via Sumit
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Trash2, FileText } from 'lucide-react';
import { GenericModal } from '@shared/components/modal';
import { sumitService } from '@shared/services';

interface InvoiceLineItem {
  description: string;
  quantity: number;
  price: number;
}

interface NewInvoiceFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: InvoiceLineItem[];
  vatType: 'INCLUDED' | 'EXCLUDED' | 'NONE';
  remarks: string;
}

interface NewInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studioName?: string;
  vendorId?: string; // User ID with Sumit credentials
}

const INITIAL_ITEM: InvoiceLineItem = { description: '', quantity: 1, price: 0 };

const INITIAL_FORM_DATA: NewInvoiceFormData = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  items: [{ ...INITIAL_ITEM }],
  vatType: 'INCLUDED',
  remarks: ''
};

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  open,
  onClose,
  onSuccess,
  studioName,
  vendorId
}) => {
  const { t } = useTranslation('merchantDocs');
  const [formData, setFormData] = useState<NewInvoiceFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA);
    setError(null);
    onClose();
  };

  const handleInputChange = (field: keyof NewInvoiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceLineItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: field === 'quantity' || field === 'price' ? Number(value) : value } : item
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

  const validateForm = (): boolean => {
    if (!formData.customerName.trim()) {
      setError(t('invoice.errors.nameRequired'));
      return false;
    }
    if (!formData.customerEmail.trim()) {
      setError(t('invoice.errors.emailRequired'));
      return false;
    }
    if (!formData.items.some(item => item.description.trim() && item.price > 0)) {
      setError(t('invoice.errors.itemsRequired'));
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!vendorId) {
      setError(t('invoice.errors.noVendor', 'Missing vendor credentials'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await sumitService.createInvoice({
        vendorId,
        customerInfo: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone || undefined
        },
        items: formData.items
          .filter(item => item.description.trim() && item.price > 0)
          .map(item => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price
          })),
        vatIncluded: formData.vatType === 'INCLUDED',
        remarks: formData.remarks || undefined
      });

      if (!response.success) {
        throw new Error(response.error || t('invoice.errors.createFailed'));
      }

      handleClose();
      onSuccess();
    } catch (err: any) {
      console.error('Failed to create invoice:', err);
      setError(err.message || t('invoice.errors.createFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GenericModal open={open} onClose={handleClose} className="new-invoice-modal">
      <div className="new-invoice-modal__content">
        <div className="new-invoice-modal__header">
          <div className="new-invoice-modal__header-icon">
            <FileText size={24} />
          </div>
          <h2>{t('invoice.title')}</h2>
          <button
            type="button"
            className="new-invoice-modal__close"
            onClick={handleClose}
            aria-label={t('invoice.close')}
          >
            <X size={20} />
          </button>
        </div>

        {studioName && (
          <div className="new-invoice-modal__studio-info">
            <span>{t('invoice.issuedFor', 'מופק עבור')}: {studioName}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="new-invoice-modal__form">
          {/* Customer Details */}
          <div className="new-invoice-modal__section">
            <h3>{t('invoice.customerDetails')}</h3>
            <div className="new-invoice-modal__row">
              <div className="new-invoice-modal__field">
                <label htmlFor="customerName">{t('invoice.customerName')} *</label>
                <input
                  id="customerName"
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder={t('invoice.customerNamePlaceholder')}
                  required
                />
              </div>
              <div className="new-invoice-modal__field">
                <label htmlFor="customerEmail">{t('invoice.customerEmail')} *</label>
                <input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>
            <div className="new-invoice-modal__row">
              <div className="new-invoice-modal__field">
                <label htmlFor="customerPhone">{t('invoice.customerPhone', 'טלפון')}</label>
                <input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  placeholder="050-0000000"
                />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="new-invoice-modal__section">
            <h3>{t('invoice.items')}</h3>
            <div className="new-invoice-modal__items">
              {formData.items.map((item, index) => (
                <div key={index} className="new-invoice-modal__item">
                  <div className="new-invoice-modal__item-row">
                    <div className="new-invoice-modal__field new-invoice-modal__field--description">
                      <label htmlFor={`item-desc-${index}`}>{t('invoice.itemDescription')}</label>
                      <input
                        id={`item-desc-${index}`}
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder={t('invoice.itemDescriptionPlaceholder')}
                      />
                    </div>
                    <div className="new-invoice-modal__field new-invoice-modal__field--qty">
                      <label htmlFor={`item-qty-${index}`}>{t('invoice.quantity', 'כמות')}</label>
                      <input
                        id={`item-qty-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      />
                    </div>
                    <div className="new-invoice-modal__field new-invoice-modal__field--price">
                      <label htmlFor={`item-price-${index}`}>{t('invoice.itemPrice')} (₪)</label>
                      <input
                        id={`item-price-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      />
                    </div>
                    <div className="new-invoice-modal__field new-invoice-modal__field--total">
                      <label>{t('invoice.itemTotal')}</label>
                      <span className="new-invoice-modal__item-total">
                        ₪{(item.quantity * item.price).toLocaleString()}
                      </span>
                    </div>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        className="new-invoice-modal__remove-item"
                        onClick={() => removeItem(index)}
                        aria-label={t('invoice.removeItem')}
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
              className="new-invoice-modal__add-item"
              onClick={addItem}
            >
              <Plus size={16} />
              {t('invoice.addItem')}
            </button>
          </div>

          {/* VAT and Remarks */}
          <div className="new-invoice-modal__section">
            <div className="new-invoice-modal__row">
              <div className="new-invoice-modal__field">
                <label htmlFor="vatType">{t('invoice.vatType')}</label>
                <select
                  id="vatType"
                  value={formData.vatType}
                  onChange={(e) => handleInputChange('vatType', e.target.value)}
                >
                  <option value="INCLUDED">{t('invoice.vatIncluded')}</option>
                  <option value="EXCLUDED">{t('invoice.vatExcluded')}</option>
                  <option value="NONE">{t('invoice.vatExempt')}</option>
                </select>
              </div>
            </div>
            <div className="new-invoice-modal__field">
              <label htmlFor="remarks">{t('invoice.notes')}</label>
              <textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                placeholder={t('invoice.notesPlaceholder')}
                rows={3}
              />
            </div>
          </div>

          {/* Total */}
          <div className="new-invoice-modal__total-section">
            <div className="new-invoice-modal__total">
              <span>{t('invoice.totalToPay')}</span>
              <span className="new-invoice-modal__total-amount">₪{calculateTotal().toLocaleString()}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="new-invoice-modal__error">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="new-invoice-modal__actions">
            <button
              type="button"
              className="new-invoice-modal__btn new-invoice-modal__btn--secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t('invoice.cancel', 'ביטול')}
            </button>
            <button
              type="submit"
              className="new-invoice-modal__btn new-invoice-modal__btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('invoice.submitting') : t('invoice.submit')}
            </button>
          </div>
        </form>
      </div>
    </GenericModal>
  );
};

export default NewInvoiceModal;
