import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCookieConsent } from '@core/contexts';
import './styles/_cookie-consent-banner.scss';

export const CookieConsentBanner: React.FC = () => {
  const { t } = useTranslation('cookieConsent');
  const { showBanner, acceptCookies, rejectCookies } = useCookieConsent();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (showBanner) {
      // Small delay to ensure smooth animation trigger
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [showBanner]);

  const handleAccept = () => {
    setIsExiting(true);
    setTimeout(() => {
      acceptCookies();
      setIsExiting(false);
    }, 300);
  };

  const handleReject = () => {
    setIsExiting(true);
    setTimeout(() => {
      rejectCookies();
      setIsExiting(false);
    }, 300);
  };

  if (!showBanner) return null;

  return (
    <div 
      className={`cookie-consent-banner ${isVisible && !isExiting ? 'cookie-consent-banner--visible' : ''} ${isExiting ? 'cookie-consent-banner--exiting' : ''}`}
    >
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
            onClick={handleAccept}
          >
            {t('banner.acceptAll')}
          </button>
          <button
            className="cookie-consent-banner__button cookie-consent-banner__button--reject"
            onClick={handleReject}
          >
            {t('banner.necessaryOnly')}
          </button>
        </div>
      </div>
    </div>
  );
};

