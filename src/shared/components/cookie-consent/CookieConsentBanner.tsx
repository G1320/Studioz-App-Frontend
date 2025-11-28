import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCookieConsent } from '@core/contexts';
import './styles/_cookie-consent-banner.scss';

export const CookieConsentBanner: React.FC = () => {
  const { t } = useTranslation('cookieConsent');
  const { showBanner, acceptCookies, rejectCookies } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-consent-banner__content">
        <div className="cookie-consent-banner__text-wrapper">
          <p className="cookie-consent-banner__text">
            {t('banner.description')}
          </p>
          <p className="cookie-consent-banner__note">
            {t('banner.note')}
          </p>
        </div>
        <div className="cookie-consent-banner__actions">
          <button
            className="cookie-consent-banner__button cookie-consent-banner__button--accept"
            onClick={acceptCookies}
          >
            {t('banner.acceptAll')}
          </button>
          <button
            className="cookie-consent-banner__button cookie-consent-banner__button--reject"
            onClick={rejectCookies}
          >
            {t('banner.necessaryOnly')}
          </button>
        </div>
      </div>
    </div>
  );
};

