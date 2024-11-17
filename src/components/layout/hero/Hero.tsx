import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  return (
    <section onClick={() => navigate('/studios/music')} className="hero">
      <div className="hero">
        <div className="hero-text-wrapper">
          <h1 className="hero-header">{t('hero.title')} </h1>
          <p>{t('hero.content')}</p>
        </div>
        {/* <img src="https://i.imgur.com/XAYOgy4.png" alt="" /> */}
        {/* <img src="https://i.imgur.com/0juIIZe.png" alt="" /> */}
      </div>
    </section>
  );
};
