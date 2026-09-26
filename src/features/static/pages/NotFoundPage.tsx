import '../styles/_not-found-page.scss';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { HomeIcon } from '@shared/components/icons';

const NotFoundPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const langNavigate = useLanguageNavigate();

  const handleReturnHome = () => {
    langNavigate('/');
  };

  return (
    <div className="not-found-page" dir={i18n.dir()}>
      <div className="not-found-page__ambience" />

      <div className="not-found-page__card">
        <div className="not-found-page__icon-container">
          <span className="not-found-page__icon-symbol">!</span>
        </div>

        <h1 className="not-found-page__title">{t('errors.not_found.title')}</h1>
        <p className="not-found-page__description">{t('errors.not_found.message')}</p>

        <button onClick={handleReturnHome} className="not-found-page__button">
          <HomeIcon className="not-found-page__button-icon" />
          <span>{t('errors.not_found.return_home')}</span>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
