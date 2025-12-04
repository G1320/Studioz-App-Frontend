import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import HomeIcon from '@mui/icons-material/Home';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const AUTO_REDIRECT_DELAY = 10; // seconds

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation('common');
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
    <div className="not-found-page">
      <div className="not-found-page__container">
        <div className="not-found-page__icon-wrapper">
          <SearchOffIcon className="not-found-page__icon" />
          <span className="not-found-page__code">404</span>
        </div>
        <h1 className="not-found-page__title">{t('errors.not_found.title')}</h1>
        <p className="not-found-page__message">{t('errors.not_found.message')}</p>
        <div className="not-found-page__actions">
          <button onClick={handleReturnHome} className="not-found-page__button">
            <HomeIcon className="not-found-page__button-icon" />
            <span>{t('errors.not_found.return_home')}</span>
          </button>
          {countdown !== null && (
            <p className="not-found-page__countdown" onClick={handleCancelAutoRedirect}>
              {t('errors.not_found.auto_redirect', { seconds: countdown })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
