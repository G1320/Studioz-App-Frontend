import { useState, useMemo, useRef } from 'react';
import { CompanyDetails, createVendor, saveVendorCard } from '@shared/services';
import { useUserContext } from '@core/contexts';
import { useCreateVendorMutation } from '@shared/hooks/mutations';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckIcon,
  ChevronRightIcon,
  BusinessIcon,
  PersonIcon,
  BankIcon,
  CreditCardIcon,
  ArrowBackIcon,
  AutoAwesomeIcon,
  InfoOutlinedIcon,
  ErrorIcon
} from '@shared/components/icons';
import { sumitService } from '@shared/services/sumit-service';
import { prepareFormData } from '@features/entities/payments/sumit/utils';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth0LoginHandler } from '@shared/hooks';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { ConsentCheckbox } from '@shared/components/forms/ConsentCheckbox';
import { logFormDataConsent } from '@shared/services/cookie-consent-service';
import { useTranslation } from 'react-i18next';
import './styles/_vendor-onboarding-form.scss';

const STEP_IDS = [
  { id: 1, titleKey: 'business' as const, defaultTitle: 'Business details', icon: BusinessIcon },
  { id: 2, titleKey: 'contact' as const, defaultTitle: 'Contact person', icon: PersonIcon },
  { id: 3, titleKey: 'bank' as const, defaultTitle: 'Bank account', icon: BankIcon },
  { id: 4, titleKey: 'card' as const, defaultTitle: 'Credit card', icon: CreditCardIcon }
];

const ENTITY_TYPES = [
  { id: 'exempt_dealer', defaultLabel: 'Exempt dealer' },
  { id: 'authorized_dealer', defaultLabel: 'Authorized dealer' },
  { id: 'company', defaultLabel: 'Ltd. company' },
  { id: 'npo', defaultLabel: 'NPO / Non-profit' }
] as const;

const BANKS = [
  { id: '12', defaultLabel: 'Bank Hapoalim (12)' },
  { id: '10', defaultLabel: 'Bank Leumi (10)' },
  { id: '11', defaultLabel: 'Bank Discount (11)' },
  { id: '31', defaultLabel: 'First International Bank (31)' },
  { id: '20', defaultLabel: 'Bank Mizrahi-Tefahot (20)' },
  { id: '09', defaultLabel: 'Postal Bank (09)' },
  { id: '46', defaultLabel: 'Bank Massad (46)' },
  { id: '04', defaultLabel: 'Bank Yahav (04)' }
] as const;

interface FormData {
  // Step 1 - Business
  entityType: string;
  businessName: string;
  businessId: string;
  businessCity: string;
  businessAddress: string;
  website: string;

  // Step 2 - Contact
  contactName: string;
  contactPhone: string;
  contactEmail: string;

  // Step 3 - Bank
  bankCode: string;
  branchNumber: string;
  accountNumber: string;
}

export const VendorOnboardingForm = () => {
  const { user } = useUserContext();
  const { loginWithPopup } = useAuth0LoginHandler();
  const langNavigate = useLanguageNavigate();
  const { t, i18n } = useTranslation('forms');
  const createVendorMutation = useCreateVendorMutation(user?._id || '');
  const dir = i18n.language === 'he' ? 'rtl' : 'ltr';

  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingCard, setIsSubmittingCard] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [dataConsent, setDataConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | undefined>();

  const [formData, setFormData] = useState<FormData>({
    entityType: 'exempt_dealer',
    businessName: '',
    businessId: '',
    businessCity: '',
    businessAddress: '',
    website: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    bankCode: '',
    branchNumber: '',
    accountNumber: ''
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Clear general error
    if (error) setError(null);
  };

  // Validation functions
  const validateStep1 = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.businessName.trim()) {
      errors.businessName = t('form.vendorOnboarding.validation.businessNameRequired', 'Business name is required');
    }
    if (!formData.businessId.trim()) {
      errors.businessId = t('form.vendorOnboarding.validation.businessIdRequired', 'Business ID is required');
    } else if (!/^\d{9}$/.test(formData.businessId.trim())) {
      errors.businessId = t('form.vendorOnboarding.validation.businessIdInvalid', 'Business ID must be 9 digits');
    }
    if (!formData.businessAddress.trim()) {
      errors.businessAddress = t('form.vendorOnboarding.validation.addressRequired', 'Address is required');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.contactName.trim()) {
      errors.contactName = t('form.vendorOnboarding.validation.contactNameRequired', 'Full name is required');
    }
    if (!formData.contactPhone.trim()) {
      errors.contactPhone = t('form.vendorOnboarding.validation.phoneRequired', 'Phone is required');
    } else if (!/^0\d{8,9}$/.test(formData.contactPhone.replace(/-/g, ''))) {
      errors.contactPhone = t('form.vendorOnboarding.validation.phoneInvalid', 'Invalid phone number');
    }
    if (!formData.contactEmail.trim()) {
      errors.contactEmail = t('form.vendorOnboarding.validation.emailRequired', 'Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      errors.contactEmail = t('form.vendorOnboarding.validation.emailInvalid', 'Invalid email address');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.bankCode) {
      errors.bankCode = t('form.vendorOnboarding.validation.bankRequired', 'Please select a bank');
    }
    if (!formData.branchNumber.trim()) {
      errors.branchNumber = t('form.vendorOnboarding.validation.branchRequired', 'Branch number is required');
    } else if (!/^\d{1,3}$/.test(formData.branchNumber)) {
      errors.branchNumber = t('form.vendorOnboarding.validation.branchInvalid', 'Invalid branch number');
    }
    if (!formData.accountNumber.trim()) {
      errors.accountNumber = t('form.vendorOnboarding.validation.accountRequired', 'Account number is required');
    } else if (!/^\d{4,12}$/.test(formData.accountNumber)) {
      errors.accountNumber = t('form.vendorOnboarding.validation.accountInvalid', 'Invalid account number');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      case 4:
        return true;
      default:
        return true;
    }
  };

  // Check if user is logged in
  const canSubmit = useMemo(() => {
    return Boolean(user?._id);
  }, [user]);

  const cardFormRef = useRef<HTMLFormElement | null>(null);

  const handleNext = async () => {
    if (!user?._id) {
      setError(t('form.vendorOnboarding.errors.loginRequired', 'Please sign in to continue'));
      loginWithPopup();
      return;
    }

    if (currentStep === 4) {
      await handleSubmitWithCard();
      return;
    }

    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < STEP_IDS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmitWithCard = async () => {
    if (!canSubmit || !user?._id) {
      setError(t('form.vendorOnboarding.errors.loginRequired', 'Please sign in to continue'));
      return;
    }

    if (!dataConsent) {
      setConsentError(t('consent.required'));
      return;
    }

    logFormDataConsent('vendor-onboarding');
    setConsentError(undefined);

    const form = cardFormRef.current || (document.getElementById('vendor-onboarding-card-form') as HTMLFormElement);
    if (!form) {
      setError(t('form.vendorOnboarding.errors.cardRequired', 'Please fill in your credit card details'));
      return;
    }

    setError(null);
    setIsSubmittingCard(true);

    try {
      const tokenFormData = prepareFormData(form);
      const singleUseToken = await sumitService.getSumitToken(tokenFormData);

      const companyDetails: CompanyDetails = {
        Name: formData.businessName.trim(),
        EmailAddress: formData.contactEmail.trim(),
        Phone: formData.contactPhone.replace(/-/g, ''),
        Address: formData.businessCity
          ? `${formData.businessAddress.trim()}, ${formData.businessCity.trim()}`
          : formData.businessAddress.trim(),
        CorporateNumber: formData.businessId.trim(),
        Country: 'Israel',
        Title: 'Vendor at Studioz',
        Website: formData.website?.trim() || undefined,
        bankCode: parseInt(formData.bankCode, 10),
        branchCode: parseInt(formData.branchNumber, 10),
        accountNumber: formData.accountNumber.trim()
      };

      await createVendor(companyDetails, user._id);

      const saveCardResponse = await saveVendorCard(singleUseToken);
      if (!saveCardResponse.success) {
        setError(
          t(
            'form.vendorOnboarding.errors.cardSaveFailed',
            'Account created successfully but saving the credit card failed. You can add a card from your profile.'
          )
        );
      }
      setIsCompleted(true);
    } catch (err: unknown) {
      const errWithResponse = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        errWithResponse?.response?.data?.message ||
        errWithResponse?.message ||
        t('form.vendorOnboarding.errors.generic', 'Something went wrong. Please try again.');
      setError(errorMessage);
      console.error('Vendor onboarding error:', err);
    } finally {
      setIsSubmittingCard(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setValidationErrors({});
      setError(null);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-content__header">
              <h2>{t('form.vendorOnboarding.business.title', 'Business details')}</h2>
              <p>
                {t(
                  'form.vendorOnboarding.business.subtitle',
                  'Enter your business details as they appear with the tax authorities'
                )}
              </p>
            </div>

            <div className="step-content__fields">
              <div className="field">
                <label>{t('form.vendorOnboarding.business.entityType', 'Entity type')}</label>
                <div className="entity-type-grid">
                  {ENTITY_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => updateField('entityType', type.id)}
                      className={`entity-type-btn ${formData.entityType === type.id ? 'active' : ''}`}
                    >
                      {t(`form.vendorOnboarding.entityTypes.${type.id}`, type.defaultLabel)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`field ${validationErrors.businessName ? 'field--error' : ''}`}>
                <label>
                  {t('form.vendorOnboarding.business.businessName.label', 'Business name (official) *')}
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  placeholder={t(
                    'form.vendorOnboarding.business.businessName.placeholder',
                    'Full name as it appears on the dealer certificate'
                  )}
                />
                {validationErrors.businessName && <span className="field__error">{validationErrors.businessName}</span>}
              </div>

              <div className={`field ${validationErrors.businessId ? 'field--error' : ''}`}>
                <label>
                  {t('form.vendorOnboarding.business.businessId.label', 'Business ID (Corp. / ID) *')}
                </label>
                <input
                  type="text"
                  value={formData.businessId}
                  onChange={(e) => updateField('businessId', e.target.value)}
                  placeholder={t('form.vendorOnboarding.business.businessId.placeholder', '9 digits')}
                  maxLength={9}
                />
                {validationErrors.businessId && <span className="field__error">{validationErrors.businessId}</span>}
              </div>

              <div className="field-row">
                <div className="field">
                  <label>{t('form.vendorOnboarding.business.city.label', 'City')}</label>
                  <input
                    type="text"
                    value={formData.businessCity}
                    onChange={(e) => updateField('businessCity', e.target.value)}
                  />
                </div>
                <div className={`field ${validationErrors.businessAddress ? 'field--error' : ''}`}>
                  <label>{t('form.vendorOnboarding.business.address.label', 'Address *')}</label>
                  <input
                    type="text"
                    value={formData.businessAddress}
                    onChange={(e) => updateField('businessAddress', e.target.value)}
                    placeholder={t('form.vendorOnboarding.business.address.placeholder', 'Street and number')}
                  />
                  {validationErrors.businessAddress && (
                    <span className="field__error">{validationErrors.businessAddress}</span>
                  )}
                </div>
              </div>

              <div className="field">
                <label>{t('form.vendorOnboarding.business.website.label', 'Website (optional)')}</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder={t('form.vendorOnboarding.business.website.placeholder', 'https://example.com')}
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="step-content__header">
              <h2>
                {t('form.vendorOnboarding.contact.title', 'Authorized signatory / Contact person')}
              </h2>
              <p>
                {t(
                  'form.vendorOnboarding.contact.subtitle',
                  'Details of the person authorized to sign on behalf of the business'
                )}
              </p>
            </div>

            <div className="step-content__fields">
              <div className={`field ${validationErrors.contactName ? 'field--error' : ''}`}>
                <label htmlFor="vendor-contact-name">
                  {t('form.vendorOnboarding.contact.fullName.label', 'Full name *')}
                </label>
                <input
                  id="vendor-contact-name"
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => updateField('contactName', e.target.value)}
                  aria-invalid={validationErrors.contactName ? true : undefined}
                  aria-describedby={validationErrors.contactName ? 'vendor-contact-name-error' : undefined}
                />
                {validationErrors.contactName && (
                  <span id="vendor-contact-name-error" className="field__error" role="alert">
                    {validationErrors.contactName}
                  </span>
                )}
              </div>

              <div className={`field ${validationErrors.contactPhone ? 'field--error' : ''}`}>
                <label htmlFor="vendor-contact-phone">
                  {t('form.vendorOnboarding.contact.phone.label', 'Mobile phone *')}
                </label>
                <input
                  id="vendor-contact-phone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => updateField('contactPhone', e.target.value)}
                  dir="ltr"
                  placeholder={t('form.vendorOnboarding.contact.phone.placeholder', '050-0000000')}
                  aria-invalid={validationErrors.contactPhone ? true : undefined}
                  aria-describedby={validationErrors.contactPhone ? 'vendor-contact-phone-error' : undefined}
                />
                {validationErrors.contactPhone && (
                  <span id="vendor-contact-phone-error" className="field__error" role="alert">
                    {validationErrors.contactPhone}
                  </span>
                )}
              </div>

              <div className={`field ${validationErrors.contactEmail ? 'field--error' : ''}`}>
                <label htmlFor="vendor-contact-email">
                  {t('form.vendorOnboarding.contact.email.label', 'Email address *')}
                </label>
                <input
                  id="vendor-contact-email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                  dir="ltr"
                  aria-invalid={validationErrors.contactEmail ? true : undefined}
                  aria-describedby={validationErrors.contactEmail ? 'vendor-contact-email-error' : undefined}
                />
                {validationErrors.contactEmail && (
                  <span id="vendor-contact-email-error" className="field__error" role="alert">
                    {validationErrors.contactEmail}
                  </span>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="step-content__header">
              <h2>{t('form.vendorOnboarding.bank.title', 'Bank account details')}</h2>
              <p>
                {t(
                  'form.vendorOnboarding.bank.subtitle',
                  'The bank account where settlement funds will be transferred'
                )}
              </p>
            </div>

            <div className="step-content__notice">
              <InfoOutlinedIcon className="notice-icon" />
              <p>
                {t(
                  'form.vendorOnboarding.bank.notice',
                  'Note: The bank account must be in the name of the business or business owner as entered in the first step.'
                )}
              </p>
            </div>

            <div className="step-content__fields">
              <div className={`field ${validationErrors.bankCode ? 'field--error' : ''}`}>
                <label>{t('form.vendorOnboarding.bank.bankName.label', 'Bank name *')}</label>
                <select value={formData.bankCode} onChange={(e) => updateField('bankCode', e.target.value)}>
                  <option value="">
                    {t('form.vendorOnboarding.bank.bankName.placeholder', 'Select a bank...')}
                  </option>
                  {BANKS.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {t(`form.vendorOnboarding.banks.${bank.id}`, bank.defaultLabel)}
                    </option>
                  ))}
                </select>
                {validationErrors.bankCode && <span className="field__error">{validationErrors.bankCode}</span>}
              </div>

              <div className="field-row field-row--bank">
                <div className={`field ${validationErrors.branchNumber ? 'field--error' : ''}`}>
                  <label>{t('form.vendorOnboarding.bank.branchNumber.label', 'Branch number *')}</label>
                  <input
                    type="text"
                    value={formData.branchNumber}
                    onChange={(e) => updateField('branchNumber', e.target.value)}
                    maxLength={3}
                  />
                  {validationErrors.branchNumber && (
                    <span className="field__error">{validationErrors.branchNumber}</span>
                  )}
                </div>
                <div className={`field field--wide ${validationErrors.accountNumber ? 'field--error' : ''}`}>
                  <label>{t('form.vendorOnboarding.bank.accountNumber.label', 'Account number *')}</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => updateField('accountNumber', e.target.value)}
                  />
                  {validationErrors.accountNumber && (
                    <span className="field__error">{validationErrors.accountNumber}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <div className="step-content__header">
              <h2>{t('form.vendorOnboarding.card.title', 'Credit card for platform fee')}</h2>
              <p className="step-content__narrative">
                {t('form.vendorOnboarding.card.narrative', 'We only earn when you earn.')}
              </p>
              <p>
                {t(
                  'form.vendorOnboarding.card.description',
                  'Studioz is free forever. We charge a small fee (9%) only when you earn from approved sessions. The card will be used for monthly billing of the platform fee.'
                )}
              </p>
            </div>
            <div className="step-content__notice">
              <InfoOutlinedIcon className="notice-icon" />
              <p>
                {t(
                  'form.vendorOnboarding.card.notice',
                  'Card details are stored securely and will not be charged now.'
                )}
              </p>
            </div>
            <ConsentCheckbox
              name="vendor-onboarding-data-consent"
              checked={dataConsent}
              onChange={(checked) => {
                setDataConsent(checked);
                if (checked) setConsentError(undefined);
              }}
              error={consentError}
            />
            <form
              id="vendor-onboarding-card-form"
              ref={cardFormRef}
              className="step-content__fields step-content__fields--card"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="field">
                <label>{t('form.vendorOnboarding.card.cardNumber.label', 'Credit card number *')}</label>
                <input
                  type="text"
                  name="CreditCardNumber"
                  data-og="cardnumber"
                  required
                  placeholder={t('form.vendorOnboarding.card.cardNumber.placeholder', 'XXXX XXXX XXXX XXXX')}
                  dir="ltr"
                />
              </div>
              <div className="field-row field-row--card">
                <div className="field">
                  <label>{t('form.vendorOnboarding.card.expMonth.label', 'Month *')}</label>
                  <select name="ExpMonth" data-og="expirationmonth" required>
                    <option value="">{t('form.vendorOnboarding.card.expMonth.placeholder', 'Select')}</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                        {(i + 1).toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>{t('form.vendorOnboarding.card.expYear.label', 'Year *')}</label>
                  <select name="ExpYear" data-og="expirationyear" required>
                    <option value="">{t('form.vendorOnboarding.card.expYear.placeholder', 'Select')}</option>
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
                <div className="field">
                  <label>{t('form.vendorOnboarding.card.cvv.label', 'CVV *')}</label>
                  <input
                    type="text"
                    name="CVV"
                    data-og="cvv"
                    maxLength={4}
                    required
                    placeholder={t('form.vendorOnboarding.card.cvv.placeholder', 'XXX')}
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="field">
                <label>
                  {t('form.vendorOnboarding.card.citizenId.label', 'ID / Corp. number (9 digits) *')}
                </label>
                <input
                  type="text"
                  name="citizen-id"
                  data-og="citizenid"
                  inputMode="numeric"
                  maxLength={9}
                  required
                  placeholder={t('form.vendorOnboarding.card.citizenId.placeholder', '9 digits')}
                  dir="ltr"
                />
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <div className="vendor-onboarding vendor-onboarding--completed" dir={dir}>
        <div className="completion-card">
          <div className="completion-card__icon">
            <AutoAwesomeIcon />
          </div>
          <h1>{t('form.vendorOnboarding.successScreen.title', 'Details submitted for review!')}</h1>
          <p>
            {t(
              'form.vendorOnboarding.successScreen.body',
              'In the coming days you will be asked to verify your business details with our payment provider, Upay Finance. After the details and account are approved, you will be able to receive payments on the platform. The process usually takes about 2 business days.'
            )}
          </p>
          <button type="button" onClick={() => langNavigate('/profile')} className="completion-card__button">
            {t('form.vendorOnboarding.successScreen.backToProfile', 'Back to profile')}
          </button>
        </div>
      </div>
    );
  }

  if (!user?._id) {
    return (
      <div className="vendor-onboarding" dir={dir}>
        <div className="vendor-onboarding__main">
          <div className="form-card">
            <div className="step-content">
              <div className="step-content__header">
                <h2>{t('form.vendorOnboarding.loginGate.title', 'Please sign in to continue')}</h2>
                <p>
                  {t(
                    'form.vendorOnboarding.loginGate.subtitle',
                    'Sign in to complete payment connection and set up your payouts.'
                  )}
                </p>
              </div>
              <div className="navigation-actions">
                <button type="button" onClick={() => loginWithPopup()} className="nav-btn nav-btn--next">
                  {t('form.vendorOnboarding.loginGate.button', 'Sign in / Sign up')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-onboarding" dir={dir}>
      <div className="vendor-onboarding__main">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-bar__steps">
            {STEP_IDS.map((step) => {
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;
              const Icon = step.icon;

              return (
                <div key={step.id} className="progress-step">
                  <div className={`progress-step__circle ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}>
                    {isPast ? <CheckIcon /> : <Icon />}
                  </div>
                  <span className={`progress-step__label ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}>
                    {t(`form.vendorOnboarding.steps.${step.titleKey}`, step.defaultTitle)}
                  </span>
                </div>
              );
            })}

            {/* Connecting Line */}
            <div className="progress-bar__line">
              <div
                className="progress-bar__line-fill"
                style={{ width: `${((currentStep - 1) / (STEP_IDS.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Form Content */}
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="form-card"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <ErrorIcon />
            <span>{error}</span>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="navigation-actions">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || createVendorMutation.isPending}
            className={`nav-btn nav-btn--back ${currentStep === 1 ? 'disabled' : ''}`}
            aria-label={t('form.vendorOnboarding.nav.backAria', 'Go to previous step')}
          >
            <ArrowBackIcon aria-hidden="true" />
            <span>{t('form.vendorOnboarding.nav.back', 'Back')}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={createVendorMutation.isPending || isSubmittingCard}
            className="nav-btn nav-btn--next"
          >
            {createVendorMutation.isPending || isSubmittingCard ? (
              <>
                <CircularProgress size={20} color="inherit" />
                <span>
                  {currentStep === 4
                    ? t('form.vendorOnboarding.nav.savingCard', 'Saving card...')
                    : t('form.vendorOnboarding.nav.submitting', 'Submitting...')}
                </span>
              </>
            ) : (
              <>
                <span>
                  {currentStep === STEP_IDS.length
                    ? t('form.vendorOnboarding.nav.finish', 'Finish and submit')
                    : t('form.vendorOnboarding.nav.continue', 'Continue to next step')}
                </span>
                {currentStep !== STEP_IDS.length && <ChevronRightIcon />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
