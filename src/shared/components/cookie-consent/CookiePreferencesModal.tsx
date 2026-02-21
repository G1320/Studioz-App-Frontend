import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '@core/contexts';
import type { CookieConsentCategories } from '@shared/services/cookie-consent-service';
import './styles/_cookie-preferences-modal.scss';

const CATEGORY_KEYS = ['essential', 'functional', 'analytics', 'marketing'] as const;

export const CookiePreferencesModal: React.FC = () => {
  const { t, i18n } = useTranslation('cookieConsent');
  const { showPreferences, closePreferences, acceptAll, savePreferences, consent } = useCookieConsent();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const [categories, setCategories] = useState<CookieConsentCategories>({
    essential: true,
    functional: consent?.categories.functional ?? false,
    analytics: consent?.categories.analytics ?? false,
    marketing: consent?.categories.marketing ?? false
  });

  // Reset categories when modal opens
  useEffect(() => {
    if (showPreferences) {
      previousFocus.current = document.activeElement as HTMLElement;
      setCategories({
        essential: true,
        functional: consent?.categories.functional ?? false,
        analytics: consent?.categories.analytics ?? false,
        marketing: consent?.categories.marketing ?? false
      });
    }
  }, [showPreferences, consent]);

  // Focus trap
  useEffect(() => {
    if (!showPreferences || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePreferences();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = modal.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Focus first focusable element
    const focusable = modal.querySelectorAll<HTMLElement>(focusableSelector);
    if (focusable.length > 0) {
      setTimeout(() => focusable[0].focus(), 50);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousFocus.current?.focus();
    };
  }, [showPreferences, closePreferences]);

  const toggleCategory = useCallback((key: keyof CookieConsentCategories) => {
    if (key === 'essential') return;
    setCategories(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSave = useCallback(() => {
    savePreferences(categories);
  }, [categories, savePreferences]);

  if (!showPreferences) return null;

  return (
    <div className="cookie-prefs-overlay" onClick={closePreferences}>
      <div
        ref={modalRef}
        className="cookie-prefs"
        role="dialog"
        aria-modal="true"
        aria-label={t('preferences.title')}
        onClick={e => e.stopPropagation()}
      >
        <div className="cookie-prefs__header">
          <h2 className="cookie-prefs__title">{t('preferences.title')}</h2>
          <button
            className="cookie-prefs__close"
            onClick={closePreferences}
            aria-label={t('preferences.close')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="cookie-prefs__description">{t('preferences.description')}</p>

        <div className="cookie-prefs__categories">
          {CATEGORY_KEYS.map(key => {
            const isEssential = key === 'essential';
            const isActive = categories[key];

            return (
              <div key={key} className="cookie-prefs__category">
                <div className="cookie-prefs__category-header">
                  <div className="cookie-prefs__category-info">
                    <h3 className="cookie-prefs__category-title">
                      {t(`preferences.categories.${key}.title`)}
                    </h3>
                    <span className="cookie-prefs__category-services">
                      {t(`preferences.categories.${key}.services`)}
                    </span>
                  </div>
                  {isEssential ? (
                    <span className="cookie-prefs__always-on" aria-label={t('preferences.categories.essential.alwaysOn')}>
                      {t('preferences.categories.essential.alwaysOn')}
                    </span>
                  ) : (
                    <button
                      className={`cookie-prefs__toggle ${isActive ? 'cookie-prefs__toggle--active' : ''}`}
                      role="switch"
                      aria-checked={isActive}
                      aria-label={t(`preferences.categories.${key}.title`)}
                      onClick={() => toggleCategory(key)}
                    >
                      <span className="cookie-prefs__toggle-knob" />
                    </button>
                  )}
                </div>
                <p className="cookie-prefs__category-desc">
                  {t(`preferences.categories.${key}.description`)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="cookie-prefs__footer">
          <Link to={`/${i18n.language}/privacy`} className="cookie-prefs__privacy-link" onClick={closePreferences}>
            {t('banner.privacyLink')}
          </Link>
          <div className="cookie-prefs__footer-actions">
            <button className="cookie-prefs__btn cookie-prefs__btn--save" onClick={handleSave}>
              {t('preferences.savePreferences')}
            </button>
            <button className="cookie-prefs__btn cookie-prefs__btn--accept" onClick={acceptAll}>
              {t('preferences.acceptAll')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
