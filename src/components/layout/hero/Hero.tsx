import { useTranslation } from 'react-i18next';

export const Hero = () => {
  const { t } = useTranslation('common');

  return (
    <section className="hero">
      <div className="hero">
        <div className="hero-text-wrapper">
          <h1 className="hero-header">{t('hero.title')} </h1>
          <p>{t('hero.content')}</p>
        </div>
      </div>
    </section>
  );
};
