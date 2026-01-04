import { useState } from 'react';
import { CompanyDetails } from '@shared/services';
import { useUserContext } from '@core/contexts';
import { useCreateVendorMutation } from '@shared/hooks/mutations';
import { motion, AnimatePresence } from 'framer-motion';
import CheckIcon from '@mui/icons-material/Check';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import './styles/_vendor-onboarding-form.scss';

const STEPS = [
  { id: 1, title: 'פרטי עסק', icon: BusinessIcon },
  { id: 2, title: 'איש קשר', icon: PersonIcon },
  { id: 3, title: 'חשבון בנק', icon: AccountBalanceIcon }
];

const ENTITY_TYPES = [
  { id: 'exempt_dealer', label: 'עוסק פטור' },
  { id: 'authorized_dealer', label: 'עוסק מורשה' },
  { id: 'company', label: 'חברה בע״מ' },
  { id: 'npo', label: 'עמותה / מלכ״ר' }
];

const BANKS = [
  { id: '12', label: 'בנק הפועלים (12)' },
  { id: '10', label: 'בנק לאומי (10)' },
  { id: '11', label: 'בנק דיסקונט (11)' },
  { id: '31', label: 'הבנק הבינלאומי (31)' },
  { id: '20', label: 'בנק מזרחי טפחות (20)' },
  { id: '09', label: 'בנק הדואר (09)' },
  { id: '46', label: 'בנק מסד (46)' },
  { id: '04', label: 'בנק יהב (04)' }
];

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
  const createVendorMutation = useCreateVendorMutation(user?._id || '');

  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

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
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Map form data to CompanyDetails interface
    const companyDetails: CompanyDetails = {
      Name: formData.businessName,
      EmailAddress: formData.contactEmail,
      Phone: formData.contactPhone,
      Address: formData.businessCity
        ? `${formData.businessAddress}, ${formData.businessCity}`
        : formData.businessAddress,
      CorporateNumber: formData.businessId,
      Country: 'Israel',
      Title: 'Vendor at Studioz',
      Website: formData.website || undefined,
      bankCode: parseInt(formData.bankCode, 10) || 0,
      branchCode: parseInt(formData.branchNumber, 10) || 0,
      accountNumber: formData.accountNumber
    };

    createVendorMutation.mutate(companyDetails, {
      onSuccess: () => {
        setIsCompleted(true);
      }
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-content__header">
              <h2>פרטי העסק</h2>
              <p>הזן את הפרטים הרשמיים של העסק כפי שהם מופיעים ברשויות המס</p>
            </div>

            <div className="step-content__fields">
              <div className="field">
                <label>סוג התאגדות</label>
                <div className="entity-type-grid">
                  {ENTITY_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => updateField('entityType', type.id)}
                      className={`entity-type-btn ${formData.entityType === type.id ? 'active' : ''}`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>שם העסק (רשמי)</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  placeholder="השם המלא כפי שמופיע בתעודת העוסק"
                />
              </div>

              <div className="field">
                <label>מספר עוסק (ח.פ / ת.ז)</label>
                <input
                  type="text"
                  value={formData.businessId}
                  onChange={(e) => updateField('businessId', e.target.value)}
                  placeholder="9 ספרות"
                  maxLength={9}
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>עיר</label>
                  <input
                    type="text"
                    value={formData.businessCity}
                    onChange={(e) => updateField('businessCity', e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>כתובת</label>
                  <input
                    type="text"
                    value={formData.businessAddress}
                    onChange={(e) => updateField('businessAddress', e.target.value)}
                    placeholder="רחוב ומספר"
                  />
                </div>
              </div>

              <div className="field">
                <label>אתר אינטרנט (אופציונלי)</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="https://example.com"
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
              <h2>מורשה חתימה / איש קשר</h2>
              <p>פרטי האדם המוסמך לחתום בשם העסק</p>
            </div>

            <div className="step-content__fields">
              <div className="field">
                <label>שם מלא</label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => updateField('contactName', e.target.value)}
                />
              </div>

              <div className="field">
                <label>טלפון נייד</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => updateField('contactPhone', e.target.value)}
                  dir="ltr"
                  placeholder="050-0000000"
                />
              </div>

              <div className="field">
                <label>כתובת אימייל</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="step-content__header">
              <h2>פרטי חשבון בנק</h2>
              <p>חשבון הבנק אליו יועברו כספי הסליקה</p>
            </div>

            <div className="step-content__notice">
              <InfoOutlinedIcon className="notice-icon" />
              <p>שים לב: חשבון הבנק חייב להיות על שם העסק או בעל העסק כפי שהוזן בשלב הראשון.</p>
            </div>

            <div className="step-content__fields">
              <div className="field">
                <label>שם הבנק</label>
                <select value={formData.bankCode} onChange={(e) => updateField('bankCode', e.target.value)}>
                  <option value="">בחר בנק...</option>
                  {BANKS.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-row field-row--bank">
                <div className="field">
                  <label>מספר סניף</label>
                  <input
                    type="text"
                    value={formData.branchNumber}
                    onChange={(e) => updateField('branchNumber', e.target.value)}
                    maxLength={3}
                  />
                </div>
                <div className="field field--wide">
                  <label>מספר חשבון</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => updateField('accountNumber', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <div className="vendor-onboarding vendor-onboarding--completed" dir="rtl">
        <div className="completion-card">
          <div className="completion-card__icon">
            <AutoAwesomeIcon />
          </div>
          <h1>הפרטים נשלחו לבדיקה!</h1>
          <p>תהליך אישור העסק אורך בדרך כלל עד 2 ימי עסקים. נודיע לך ברגע שהחשבון יאושר ותוכל להתחיל לקבל תשלומים.</p>
          <button type="button" onClick={() => (window.location.href = '/')} className="completion-card__button">
            חזור לדף הבית
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-onboarding" dir="rtl">
      {/* Main */}
      <main className="vendor-onboarding__main">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-bar__steps">
            {STEPS.map((step) => {
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;
              const Icon = step.icon;

              return (
                <div key={step.id} className="progress-step">
                  <div className={`progress-step__circle ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}>
                    {isPast ? <CheckIcon /> : <Icon />}
                  </div>
                  <span className={`progress-step__label ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}

            {/* Connecting Line */}
            <div className="progress-bar__line">
              <div
                className="progress-bar__line-fill"
                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Form Content */}
        <AnimatePresence mode="wait">
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

        {/* Navigation Actions */}
        <div className="navigation-actions">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`nav-btn nav-btn--back ${currentStep === 1 ? 'disabled' : ''}`}
          >
            <ArrowBackIcon />
            <span>חזור</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={createVendorMutation.isPending}
            className="nav-btn nav-btn--next"
          >
            <span>{currentStep === STEPS.length ? 'סיים ושלח' : 'המשך לשלב הבא'}</span>
            {currentStep !== STEPS.length && <ChevronRightIcon />}
          </button>
        </div>
      </main>
    </div>
  );
};
