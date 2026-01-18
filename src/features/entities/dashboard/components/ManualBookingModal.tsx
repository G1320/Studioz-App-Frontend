/**
 * ManualBookingModal Component
 * Modal for studio owners to create reservations manually (הזמנה חדשה)
 * 
 * Features:
 * - Select existing service OR create custom service
 * - Availability-aware date/time selection for existing services
 * - Customer details (no phone verification required)
 * - Optional payment integration (Book Only vs Book & Charge)
 * - Creates reservation and blocks time slot
 */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Calendar, ChevronLeft, ChevronRight, CheckCircle, Clock, User, CreditCard } from 'lucide-react';
import dayjs from 'dayjs';
import { GenericModal } from '@shared/components/modal';
import { MuiDateTimePicker } from '@shared/components';
import { HourSelector } from '@features/entities/items/components/HourSelector';
import { SumitPaymentForm } from '@shared/components';
import { prepareFormData } from '@features/entities/payments/sumit/utils';
import { sumitService } from '@shared/services';
import { reserveTimeSlots } from '@shared/services/booking-service';
import { useItems } from '@shared/hooks';
import { useUserContext } from '@core/contexts';
import { Studio, CartItem } from 'src/types/index';
import { toast } from 'sonner';
import { getMinimumHours } from '@shared/utils/availabilityUtils';
import '../styles/_manual-booking-modal.scss';

interface ManualBookingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studios: Studio[];
  preselectedStudioId?: string;
}

type ModalStep = 'service' | 'schedule' | 'customer' | 'payment' | 'success';
type ServiceType = 'existing' | 'custom';
type PaymentOption = 'book-only' | 'book-and-charge';

interface CustomService {
  description: string;
  price: number;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const INITIAL_CUSTOM_SERVICE: CustomService = {
  description: '',
  price: 0
};

const INITIAL_CUSTOMER_DATA: CustomerData = {
  name: '',
  email: '',
  phone: '',
  notes: ''
};

export const ManualBookingModal: React.FC<ManualBookingModalProps> = ({
  open,
  onClose,
  onSuccess,
  studios,
  preselectedStudioId
}) => {
  const { t, i18n } = useTranslation(['dashboard', 'common', 'merchantDocs']);
  const { user } = useUserContext();
  const { data: allItems = [] } = useItems();
  const isRTL = i18n.language === 'he';

  // Step state
  const [step, setStep] = useState<ModalStep>('service');
  
  // Service selection state
  const [selectedStudioId, setSelectedStudioId] = useState<string>(preselectedStudioId || '');
  const [serviceType, setServiceType] = useState<ServiceType>('existing');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [customService, setCustomService] = useState<CustomService>(INITIAL_CUSTOM_SERVICE);
  
  // Scheduling state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHours, setSelectedHours] = useState<number>(1);
  
  // Customer state
  const [customerData, setCustomerData] = useState<CustomerData>(INITIAL_CUSTOMER_DATA);
  
  // Payment state
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('book-only');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Success state
  const [successData, setSuccessData] = useState<{
    reservationId?: string;
    amount?: number;
    documentUrl?: string;
  } | null>(null);

  // Reset when modal opens/closes
  useEffect(() => {
    if (open) {
      setStep('service');
      setSelectedStudioId(preselectedStudioId || (studios.length === 1 ? studios[0]._id : ''));
      setServiceType('existing');
      setSelectedItemId('');
      setCustomService(INITIAL_CUSTOM_SERVICE);
      setSelectedDate(null);
      setSelectedHours(1);
      setCustomerData(INITIAL_CUSTOMER_DATA);
      setPaymentOption('book-only');
      setError(null);
      setSuccessData(null);
    }
  }, [open, preselectedStudioId, studios]);

  // Get selected studio
  const selectedStudio = useMemo(() => {
    return studios.find(s => s._id === selectedStudioId) || null;
  }, [studios, selectedStudioId]);

  // Get items for selected studio
  const studioItems = useMemo(() => {
    if (!selectedStudioId) return [];
    return allItems.filter(item => item.studioId === selectedStudioId && item.active !== false);
  }, [allItems, selectedStudioId]);

  // Get selected item
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return studioItems.find(item => item._id === selectedItemId) || null;
  }, [studioItems, selectedItemId]);

  // Get min/max hours for selected item
  const minHours = useMemo(() => {
    if (serviceType === 'custom' || !selectedItem) return 1;
    return getMinimumHours(selectedItem);
  }, [serviceType, selectedItem]);

  // Max hours - use a reasonable default. The date picker will enforce actual availability
  const maxHours = useMemo(() => {
    // For custom services or when no item selected, allow up to 12 hours
    if (serviceType === 'custom' || !selectedItem) return 12;
    // For existing items, allow reasonable max (studio hours will enforce actual limit)
    return 12;
  }, [serviceType, selectedItem]);

  // Ensure hours are within bounds
  useEffect(() => {
    if (selectedHours < minHours) setSelectedHours(minHours);
    if (selectedHours > maxHours) setSelectedHours(maxHours);
  }, [minHours, maxHours, selectedHours]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (serviceType === 'custom') {
      return customService.price;
    }
    if (selectedItem) {
      return (selectedItem.price || 0) * selectedHours;
    }
    return 0;
  }, [serviceType, customService.price, selectedItem, selectedHours]);

  // Helper to get localized name
  const getLocalizedName = useCallback((name: string | { en?: string; he?: string } | undefined): string => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    return name[i18n.language as 'en' | 'he'] || name.he || name.en || '';
  }, [i18n.language]);

  // Handlers
  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose();
    }
  }, [isSubmitting, onClose]);

  const handleStudioChange = useCallback((studioId: string) => {
    setSelectedStudioId(studioId);
    setSelectedItemId('');
    setSelectedDate(null);
  }, []);

  const handleServiceTypeChange = useCallback((type: ServiceType) => {
    setServiceType(type);
    if (type === 'custom') {
      setSelectedItemId('');
    }
    setSelectedDate(null);
  }, []);

  const handleItemChange = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
    setSelectedDate(null);
    // Reset hours to minimum for this item
    const item = studioItems.find(i => i._id === itemId);
    if (item) {
      const min = getMinimumHours(item);
      setSelectedHours(min);
    }
  }, [studioItems]);

  const handleCustomServiceChange = useCallback((field: keyof CustomService, value: string | number) => {
    setCustomService(prev => ({
      ...prev,
      [field]: field === 'price' ? Number(value) : value
    }));
  }, []);

  const handleDateChange = useCallback((date: Date | null) => {
    setSelectedDate(date);
  }, []);

  const handleHoursIncrement = useCallback(() => {
    setSelectedHours(prev => Math.min(prev + 1, maxHours));
  }, [maxHours]);

  const handleHoursDecrement = useCallback(() => {
    setSelectedHours(prev => Math.max(prev - 1, minHours));
  }, [minHours]);

  const handleCustomerChange = useCallback((field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Validation
  const canProceedFromService = useMemo(() => {
    if (!selectedStudioId) return false;
    if (serviceType === 'existing') {
      return !!selectedItemId;
    } else {
      return customService.description.trim().length > 0 && customService.price >= 0;
    }
  }, [selectedStudioId, serviceType, selectedItemId, customService]);

  const canProceedFromSchedule = useMemo(() => {
    return !!selectedDate;
  }, [selectedDate]);

  const canProceedFromCustomer = useMemo(() => {
    return customerData.name.trim().length > 0 && customerData.email.trim().length > 0;
  }, [customerData]);

  // Navigation
  const goToStep = useCallback((newStep: ModalStep) => {
    setError(null);
    setStep(newStep);
  }, []);

  const handleNext = useCallback(() => {
    switch (step) {
      case 'service':
        if (canProceedFromService) goToStep('schedule');
        break;
      case 'schedule':
        if (canProceedFromSchedule) goToStep('customer');
        break;
      case 'customer':
        if (canProceedFromCustomer) goToStep('payment');
        break;
    }
  }, [step, canProceedFromService, canProceedFromSchedule, canProceedFromCustomer, goToStep]);

  const handleBack = useCallback(() => {
    switch (step) {
      case 'schedule':
        goToStep('service');
        break;
      case 'customer':
        goToStep('schedule');
        break;
      case 'payment':
        goToStep('customer');
        break;
    }
  }, [step, goToStep]);

  // Create booking
  const createBooking = useCallback(async (): Promise<string> => {
    if (!selectedDate || !selectedStudio) {
      throw new Error('Missing required booking data');
    }

    const bookingDate = dayjs(selectedDate).format('DD/MM/YYYY');
    const startTime = dayjs(selectedDate).format('HH:mm');

    // Build name object for CartItem
    const itemNameValue = serviceType === 'custom' 
      ? customService.description 
      : getLocalizedName(selectedItem?.name);
    
    const bookingItem: CartItem = {
      itemId: selectedItemId || 'custom',
      studioId: selectedStudioId,
      name: { 
        en: itemNameValue,
        he: itemNameValue
      },
      studioName: {
        en: typeof selectedStudio.name === 'string' ? selectedStudio.name : selectedStudio.name?.en,
        he: typeof selectedStudio.name === 'string' ? selectedStudio.name : selectedStudio.name?.he
      },
      bookingDate,
      startTime,
      hours: selectedHours,
      price: serviceType === 'custom' ? customService.price : (selectedItem?.price || 0),
      total: totalPrice,
      customerName: customerData.name,
      customerPhone: customerData.phone,
      comment: customerData.notes,
      // Mark as manual booking by studio owner
      customerId: user?._id
    };

    // Reserve the time slots
    const reservationId = await reserveTimeSlots(bookingItem);
    return reservationId;
  }, [
    selectedDate, selectedStudio, selectedItemId, selectedStudioId,
    serviceType, customService, selectedItem, selectedHours, totalPrice,
    customerData, user, getLocalizedName
  ]);

  // Handle book only (no payment)
  const handleBookOnly = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const reservationId = await createBooking();
      
      setSuccessData({
        reservationId,
        amount: totalPrice
      });
      goToStep('success');
      onSuccess();
      toast.success(t('dashboard:manualBooking.success.booked', 'Reservation created successfully'));
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message || t('dashboard:manualBooking.errors.bookingFailed', 'Failed to create reservation'));
    } finally {
      setIsSubmitting(false);
    }
  }, [createBooking, totalPrice, goToStep, onSuccess, t]);

  // Handle book and charge
  const handlePaymentSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // First create the booking
      const reservationId = await createBooking();

      // Then process payment
      const form = e.target as HTMLFormElement;
      const tokenFormData = prepareFormData(form);
      const singleUseToken = await sumitService.getSumitToken(tokenFormData);

      const response = await sumitService.quickCharge({
        singleUseToken,
        customerInfo: {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone || undefined
        },
        items: [{
          description: serviceType === 'custom' 
            ? customService.description 
            : getLocalizedName(selectedItem?.name) || 'Service',
          quantity: selectedHours,
          price: serviceType === 'custom' ? customService.price : (selectedItem?.price || 0)
        }],
        description: serviceType === 'custom' 
          ? customService.description 
          : getLocalizedName(selectedItem?.name) || 'Service',
        remarks: customerData.notes || undefined,
        vendorId: user?._id || ''
      });

      if (!response.success) {
        throw new Error(response.error || t('merchantDocs:quickCharge.errors.paymentFailed', 'Payment failed'));
      }

      setSuccessData({
        reservationId,
        amount: response.data?.amount || totalPrice,
        documentUrl: response.data?.documentUrl
      });
      goToStep('success');
      onSuccess();
      toast.success(t('dashboard:manualBooking.success.bookedAndCharged', 'Reservation created and payment processed'));
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || t('merchantDocs:quickCharge.errors.paymentFailed', 'Payment failed'));
    } finally {
      setIsSubmitting(false);
    }
  }, [
    createBooking, customerData, serviceType, customService, selectedItem,
    selectedHours, totalPrice, user, goToStep, onSuccess, t, getLocalizedName
  ]);

  // Step indicators
  const steps = [
    { key: 'service', label: t('dashboard:manualBooking.steps.service', 'שירות') },
    { key: 'schedule', label: t('dashboard:manualBooking.steps.schedule', 'תאריך') },
    { key: 'customer', label: t('dashboard:manualBooking.steps.customer', 'לקוח') },
    { key: 'payment', label: t('dashboard:manualBooking.steps.payment', 'סיום') }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  return (
    <GenericModal open={open} onClose={handleClose} className="manual-booking-modal">
      <div className="manual-booking-modal__content">
        {/* Header */}
        <div className="manual-booking-modal__header">
          <div className="manual-booking-modal__header-icon">
            <Calendar size={24} />
          </div>
          <h2>{t('dashboard:manualBooking.title', 'הזמנה חדשה')}</h2>
          <button
            type="button"
            className="manual-booking-modal__close"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label={t('common:close', 'Close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        {step !== 'success' && (
          <div className="manual-booking-modal__steps">
            {steps.map((s, idx) => (
              <React.Fragment key={s.key}>
                <div className={`manual-booking-modal__step ${
                  idx < currentStepIndex ? 'completed' : 
                  idx === currentStepIndex ? 'active' : ''
                }`}>
                  <span className="manual-booking-modal__step-number">{idx + 1}</span>
                  <span className="manual-booking-modal__step-label">{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="manual-booking-modal__step-divider" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="manual-booking-modal__error">
            {error}
          </div>
        )}

        {/* Step 1: Service Selection */}
        {step === 'service' && (
          <div className="manual-booking-modal__step-content">
            {/* Studio Selection */}
            {studios.length > 1 && (
              <div className="manual-booking-modal__section">
                <h3>{t('dashboard:manualBooking.selectStudio', 'בחר אולפן')}</h3>
                <div className="manual-booking-modal__studio-grid">
                  {studios.map(studio => (
                    <button
                      key={studio._id}
                      type="button"
                      className={`manual-booking-modal__studio-card ${selectedStudioId === studio._id ? 'selected' : ''}`}
                      onClick={() => handleStudioChange(studio._id)}
                    >
                      {studio.coverImage && (
                        <img src={studio.coverImage} alt="" className="manual-booking-modal__studio-image" />
                      )}
                      <span className="manual-booking-modal__studio-name">
                        {getLocalizedName(studio.name)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Service Type Toggle */}
            {selectedStudioId && (
              <div className="manual-booking-modal__section">
                <h3>{t('dashboard:manualBooking.serviceType', 'סוג שירות')}</h3>
                <div className="manual-booking-modal__toggle-group">
                  <button
                    type="button"
                    className={`manual-booking-modal__toggle ${serviceType === 'existing' ? 'active' : ''}`}
                    onClick={() => handleServiceTypeChange('existing')}
                  >
                    {t('dashboard:manualBooking.existingService', 'שירות קיים')}
                  </button>
                  <button
                    type="button"
                    className={`manual-booking-modal__toggle ${serviceType === 'custom' ? 'active' : ''}`}
                    onClick={() => handleServiceTypeChange('custom')}
                  >
                    {t('dashboard:manualBooking.customService', 'שירות מותאם')}
                  </button>
                </div>
              </div>
            )}

            {/* Existing Service Selection */}
            {selectedStudioId && serviceType === 'existing' && (
              <div className="manual-booking-modal__section">
                <h3>{t('dashboard:manualBooking.selectService', 'בחר שירות')}</h3>
                {studioItems.length === 0 ? (
                  <p className="manual-booking-modal__empty">
                    {t('dashboard:manualBooking.noServices', 'אין שירותים זמינים')}
                  </p>
                ) : (
                  <div className="manual-booking-modal__items-list">
                    {studioItems.map(item => (
                      <button
                        key={item._id}
                        type="button"
                        className={`manual-booking-modal__item-card ${selectedItemId === item._id ? 'selected' : ''}`}
                        onClick={() => handleItemChange(item._id)}
                      >
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt="" className="manual-booking-modal__item-image" />
                        )}
                        <div className="manual-booking-modal__item-info">
                          <span className="manual-booking-modal__item-name">
                            {getLocalizedName(item.name)}
                          </span>
                          <span className="manual-booking-modal__item-price">
                            ₪{item.price}/שעה
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Custom Service Form */}
            {selectedStudioId && serviceType === 'custom' && (
              <div className="manual-booking-modal__section">
                <h3>{t('dashboard:manualBooking.customServiceDetails', 'פרטי השירות')}</h3>
                <div className="manual-booking-modal__field">
                  <label>{t('dashboard:manualBooking.serviceDescription', 'תיאור השירות')} *</label>
                  <input
                    type="text"
                    value={customService.description}
                    onChange={(e) => handleCustomServiceChange('description', e.target.value)}
                    placeholder={t('dashboard:manualBooking.serviceDescriptionPlaceholder', 'הכנס תיאור')}
                  />
                </div>
                <div className="manual-booking-modal__field">
                  <label>{t('dashboard:manualBooking.servicePrice', 'מחיר כולל')} (₪)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={customService.price}
                    onChange={(e) => handleCustomServiceChange('price', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="manual-booking-modal__actions">
              <button
                type="button"
                className="manual-booking-modal__btn manual-booking-modal__btn--secondary"
                onClick={handleClose}
              >
                {t('common:cancel', 'ביטול')}
              </button>
              <button
                type="button"
                className="manual-booking-modal__btn manual-booking-modal__btn--primary"
                onClick={handleNext}
                disabled={!canProceedFromService}
              >
                {t('common:next', 'הבא')}
                {!isRTL && <ChevronRight size={16} />}
                {isRTL && <ChevronLeft size={16} />}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Scheduling */}
        {step === 'schedule' && (
          <div className="manual-booking-modal__step-content">
            <div className="manual-booking-modal__section">
              <h3>{t('dashboard:manualBooking.selectDateTime', 'בחר תאריך ושעה')}</h3>
              
              <div className="manual-booking-modal__datetime-picker">
                <MuiDateTimePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  studioAvailability={selectedStudio?.studioAvailability}
                  itemAvailability={selectedItem?.availability}
                  item={selectedItem || undefined}
                  studio={selectedStudio || undefined}
                  label={t('dashboard:manualBooking.dateTimeLabel', 'תאריך ושעה')}
                />
              </div>
            </div>

            <div className="manual-booking-modal__section">
              <h3>{t('dashboard:manualBooking.duration', 'משך הזמן')}</h3>
              <HourSelector
                value={selectedHours}
                onIncrement={handleHoursIncrement}
                onDecrement={handleHoursDecrement}
                min={minHours}
                max={maxHours}
              />
              {serviceType === 'existing' && selectedItem?.price && (
                <p className="manual-booking-modal__price-hint">
                  ₪{selectedItem.price} × {selectedHours} = <strong>₪{totalPrice}</strong>
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="manual-booking-modal__actions">
              <button
                type="button"
                className="manual-booking-modal__btn manual-booking-modal__btn--secondary"
                onClick={handleBack}
              >
                {isRTL && <ChevronRight size={16} />}
                {!isRTL && <ChevronLeft size={16} />}
                {t('common:back', 'חזור')}
              </button>
              <button
                type="button"
                className="manual-booking-modal__btn manual-booking-modal__btn--primary"
                onClick={handleNext}
                disabled={!canProceedFromSchedule}
              >
                {t('common:next', 'הבא')}
                {!isRTL && <ChevronRight size={16} />}
                {isRTL && <ChevronLeft size={16} />}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Customer Details */}
        {step === 'customer' && (
          <div className="manual-booking-modal__step-content">
            <div className="manual-booking-modal__section">
              <h3>
                <User size={18} />
                {t('dashboard:manualBooking.customerDetails', 'פרטי לקוח')}
              </h3>
              
              <div className="manual-booking-modal__field">
                <label>{t('dashboard:manualBooking.customerName', 'שם לקוח')} *</label>
                <input
                  type="text"
                  value={customerData.name}
                  onChange={(e) => handleCustomerChange('name', e.target.value)}
                  placeholder={t('dashboard:manualBooking.customerNamePlaceholder', 'הזן שם')}
                />
              </div>

              <div className="manual-booking-modal__field">
                <label>{t('dashboard:manualBooking.customerEmail', 'אימייל')} *</label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => handleCustomerChange('email', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div className="manual-booking-modal__field">
                <label>{t('dashboard:manualBooking.customerPhone', 'טלפון')}</label>
                <input
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => handleCustomerChange('phone', e.target.value)}
                  placeholder="050-0000000"
                />
              </div>

              <div className="manual-booking-modal__field">
                <label>{t('dashboard:manualBooking.notes', 'הערות')}</label>
                <textarea
                  value={customerData.notes}
                  onChange={(e) => handleCustomerChange('notes', e.target.value)}
                  placeholder={t('dashboard:manualBooking.notesPlaceholder', 'הערות נוספות (אופציונלי)')}
                  rows={2}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="manual-booking-modal__actions">
              <button
                type="button"
                className="manual-booking-modal__btn manual-booking-modal__btn--secondary"
                onClick={handleBack}
              >
                {isRTL && <ChevronRight size={16} />}
                {!isRTL && <ChevronLeft size={16} />}
                {t('common:back', 'חזור')}
              </button>
              <button
                type="button"
                className="manual-booking-modal__btn manual-booking-modal__btn--primary"
                onClick={handleNext}
                disabled={!canProceedFromCustomer}
              >
                {t('common:next', 'הבא')}
                {!isRTL && <ChevronRight size={16} />}
                {isRTL && <ChevronLeft size={16} />}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Payment Option */}
        {step === 'payment' && (
          <div className="manual-booking-modal__step-content">
            {/* Booking Summary */}
            <div className="manual-booking-modal__summary">
              <h3>{t('dashboard:manualBooking.summary', 'סיכום הזמנה')}</h3>
              <div className="manual-booking-modal__summary-row">
                <span>{t('dashboard:manualBooking.service', 'שירות')}:</span>
                <span>
                  {serviceType === 'custom' 
                    ? customService.description 
                    : getLocalizedName(selectedItem?.name)}
                </span>
              </div>
              <div className="manual-booking-modal__summary-row">
                <span>{t('dashboard:manualBooking.dateTime', 'תאריך ושעה')}:</span>
                <span>
                  {selectedDate && dayjs(selectedDate).format('DD/MM/YYYY HH:mm')}
                </span>
              </div>
              <div className="manual-booking-modal__summary-row">
                <span>{t('dashboard:manualBooking.duration', 'משך')}:</span>
                <span>{selectedHours} {t('common:hours', 'שעות')}</span>
              </div>
              <div className="manual-booking-modal__summary-row">
                <span>{t('dashboard:manualBooking.customer', 'לקוח')}:</span>
                <span>{customerData.name}</span>
              </div>
              <div className="manual-booking-modal__summary-row manual-booking-modal__summary-row--total">
                <span>{t('dashboard:manualBooking.total', 'סה"כ')}:</span>
                <span>₪{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Option */}
            <div className="manual-booking-modal__section">
              <h3>{t('dashboard:manualBooking.paymentOption', 'אפשרות תשלום')}</h3>
              <div className="manual-booking-modal__payment-options">
                <button
                  type="button"
                  className={`manual-booking-modal__payment-option ${paymentOption === 'book-only' ? 'selected' : ''}`}
                  onClick={() => setPaymentOption('book-only')}
                >
                  <Clock size={20} />
                  <span className="manual-booking-modal__payment-option-title">
                    {t('dashboard:manualBooking.bookOnly', 'הזמנה בלבד')}
                  </span>
                  <span className="manual-booking-modal__payment-option-desc">
                    {t('dashboard:manualBooking.bookOnlyDesc', 'יצור הזמנה ללא תשלום')}
                  </span>
                </button>
                
                {totalPrice > 0 && (
                  <button
                    type="button"
                    className={`manual-booking-modal__payment-option ${paymentOption === 'book-and-charge' ? 'selected' : ''}`}
                    onClick={() => setPaymentOption('book-and-charge')}
                  >
                    <CreditCard size={20} />
                    <span className="manual-booking-modal__payment-option-title">
                      {t('dashboard:manualBooking.bookAndCharge', 'הזמנה + תשלום')}
                    </span>
                    <span className="manual-booking-modal__payment-option-desc">
                      {t('dashboard:manualBooking.bookAndChargeDesc', 'יצור הזמנה וחייב את הלקוח')}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Payment Form (if book-and-charge) */}
            {paymentOption === 'book-and-charge' && totalPrice > 0 && (
              <div className="manual-booking-modal__payment-form">
                <SumitPaymentForm
                  onSubmit={handlePaymentSubmit}
                  error={error || undefined}
                  totalAmount={totalPrice}
                  isProcessing={isSubmitting}
                  variant="order"
                  submitButtonText={t('dashboard:manualBooking.confirmAndCharge', 'אשר וחייב ₪' + totalPrice)}
                  showHeader={false}
                  showCouponInput={false}
                />
              </div>
            )}

            {/* Actions (only for book-only) */}
            {paymentOption === 'book-only' && (
              <div className="manual-booking-modal__actions">
                <button
                  type="button"
                  className="manual-booking-modal__btn manual-booking-modal__btn--secondary"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  {isRTL && <ChevronRight size={16} />}
                  {!isRTL && <ChevronLeft size={16} />}
                  {t('common:back', 'חזור')}
                </button>
                <button
                  type="button"
                  className="manual-booking-modal__btn manual-booking-modal__btn--primary"
                  onClick={handleBookOnly}
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? t('dashboard:manualBooking.creating', 'יוצר הזמנה...')
                    : t('dashboard:manualBooking.confirmBooking', 'אשר הזמנה')}
                </button>
              </div>
            )}

            {/* Back button for payment mode */}
            {paymentOption === 'book-and-charge' && (
              <button
                type="button"
                className="manual-booking-modal__back-link"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                {isRTL && <ChevronRight size={16} />}
                {!isRTL && <ChevronLeft size={16} />}
                {t('common:back', 'חזור')}
              </button>
            )}
          </div>
        )}

        {/* Step 5: Success */}
        {step === 'success' && successData && (
          <div className="manual-booking-modal__success">
            <div className="manual-booking-modal__success-icon">
              <CheckCircle size={48} />
            </div>
            <h3>{t('dashboard:manualBooking.success.title', 'ההזמנה נוצרה בהצלחה!')}</h3>
            
            {successData.amount !== undefined && successData.amount > 0 && (
              <p className="manual-booking-modal__success-amount">
                ₪{successData.amount.toLocaleString()}
              </p>
            )}
            
            <p className="manual-booking-modal__success-message">
              {successData.documentUrl 
                ? t('dashboard:manualBooking.success.chargedMessage', 'הלקוח חויב וקבלה נשלחה באימייל')
                : t('dashboard:manualBooking.success.bookedMessage', 'ההזמנה נוספה ליומן')}
            </p>

            {successData.documentUrl && (
              <a
                href={successData.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="manual-booking-modal__success-link"
              >
                {t('dashboard:manualBooking.success.viewReceipt', 'צפה בקבלה')}
              </a>
            )}

            <button
              type="button"
              className="manual-booking-modal__btn manual-booking-modal__btn--primary"
              onClick={handleClose}
            >
              {t('dashboard:manualBooking.success.done', 'סיום')}
            </button>
          </div>
        )}
      </div>
    </GenericModal>
  );
};

export default ManualBookingModal;
