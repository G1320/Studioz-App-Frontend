import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '@core/contexts';
import './styles/_cookie-consent-banner.scss';

export const CookieConsentBanner: React.FC = () => {
  const { t, i18n } = useTranslation('cookieConsent');
  const { showBanner, acceptAll, rejectNonEssential, openPreferences } = useCookieConsent();
  const [visible, setVisible] = useState(false);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showBanner) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [showBanner]);

  // Move focus into the banner when it becomes visible so screen readers announce it
  useEffect(() => {
    if (visible) {
      firstButtonRef.current?.focus();
    }
  }, [visible]);

  if (!showBanner) return null;

  return (
    <div
      className={`cookie-banner ${visible ? 'cookie-banner--visible' : ''}`}
      role="region"
      aria-label={t('banner.ariaLabel')}
      aria-describedby="cookie-banner-desc"
    >
      <div className="cookie-banner__content">
        <div className="cookie-banner__text">
          <p id="cookie-banner-desc" className="cookie-banner__description">
            {t('banner.description')}
          </p>
          <Link to={`/${i18n.language}/privacy`} className="cookie-banner__privacy-link">
            {t('banner.privacyLink')}
          </Link>
        </div>
        <div className="cookie-banner__actions">
          <button
            ref={firstButtonRef}
            className="cookie-banner__btn cookie-banner__btn--accept"
            onClick={acceptAll}
          >
            {t('banner.acceptAll')}
          </button>
          <button
            className="cookie-banner__btn cookie-banner__btn--reject"
            onClick={rejectNonEssential}
          >
            {t('banner.necessaryOnly')}
          </button>
          <button
            className="cookie-banner__btn cookie-banner__btn--manage"
            onClick={openPreferences}
          >
            {t('banner.managePreferences')}
          </button>
        </div>
      </div>
    </div>
  );
};
