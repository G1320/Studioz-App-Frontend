import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ConsentCheckbox } from '@shared/components/forms/ConsentCheckbox';
import { logFormDataConsent } from '@shared/services/cookie-consent-service';
import './styles/_phone-access-form.scss';

interface PhoneAccessFormProps {
  onPhoneSubmit: (phone: string) => void;
  isLoading?: boolean;
}

export const PhoneAccessForm: React.FC<PhoneAccessFormProps> = ({ onPhoneSubmit, isLoading }) => {
  const { t } = useTranslation('reservations');
  const [phone, setPhone] = useState('');
  const [dataConsent, setDataConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | undefined>();
  const [isRTL, setIsRTL] = useState(false);
  const { t: tForms } = useTranslation('forms');

  React.useEffect(() => {
    setIsRTL(document.documentElement.lang === 'he');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length === 0) {
      toast.error(t('phoneRequired'));
      return;
    }
    // Basic phone validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) {
      toast.error(t('phoneInvalid'));
      return;
    }
    if (!dataConsent) {
      setConsentError(tForms('consent.required'));
      return;
    }
    logFormDataConsent('phone-access');
    setConsentError(undefined);
    onPhoneSubmit(phone.trim());
  };

  return (
    <div className="phone-access-form">
      <div className="phone-access-form__container">
        <h2 className="phone-access-form__title">{t('accessYourReservations')}</h2>
        <p className="phone-access-form__subtitle">{t('enterPhoneToView')}</p>
        <form onSubmit={handleSubmit} className="phone-access-form__form">
          <div className="phone-access-form__input-container">
            <label htmlFor="phone-input" className="phone-access-form__label">
              {t('phoneLabel', 'Phone Number')}
            </label>
            <input
              id="phone-input"
              type="tel"
              className="phone-access-form__input"
              placeholder={t('phonePlaceholder')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir={isRTL ? 'rtl' : 'ltr'}
              disabled={isLoading}
              pattern="[0-9]*"
              aria-required="true"
            />
          </div>
          <ConsentCheckbox
            name="phone-access-data-consent"
            checked={dataConsent}
            onChange={(checked) => {
              setDataConsent(checked);
              if (checked) setConsentError(undefined);
            }}
            error={consentError}
          />
          <button
            type="submit"
            className="phone-access-form__submit-button"
            disabled={isLoading || !phone.trim() || !dataConsent}
          >
            {isLoading ? t('loading') : t('viewReservations')}
          </button>
        </form>
      </div>
    </div>
  );
};
