import '../styles/_not-found-page.scss';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { HomeIcon } from '@shared/components/icons';

const AUTO_REDIRECT_DELAY = 10; // seconds

const NotFoundPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const langNavigate = useLanguageNavigate();
  const [countdown, setCountdown] = useState<number | null>(AUTO_REDIRECT_DELAY);

  const handleReturnHome = () => {
    langNavigate('/');
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      langNavigate('/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, langNavigate]);

  const handleCancelAutoRedirect = () => {
    setCountdown(null);
  };

  return (
    <div className="not-found-page" dir={i18n.dir()}>
      {/* Background Ambience */}
      <div className="not-found-page__ambience" />

      <div className="not-found-page__card">
        {/* Icon Container */}
        <div className="not-found-page__icon-container">
          <span className="not-found-page__icon-symbol">!</span>
        </div>

        {/* Text Content */}
        <h1 className="not-found-page__title">{t('errors.not_found.title')}</h1>
        <p className="not-found-page__description">{t('errors.not_found.message')}</p>

        {/* Action Button */}
        <button onClick={handleReturnHome} className="not-found-page__button">
          <HomeIcon className="not-found-page__button-icon" />
          <span>{t('errors.not_found.return_home')}</span>
        </button>

        {/* Countdown */}
        {countdown !== null && (
          <p className="not-found-page__countdown" onClick={handleCancelAutoRedirect}>
            {t('errors.not_found.auto_redirect', { seconds: countdown })}
          </p>
        )}
      </div>
    </div>
  );
};

export default NotFoundPage;
