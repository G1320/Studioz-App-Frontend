import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';
import { Button } from '@shared/components';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VideocamIcon from '@mui/icons-material/Videocam';
import MovieIcon from '@mui/icons-material/Movie';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentIcon from '@mui/icons-material/Payment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import '../styles/_for-owners-page.scss';

const ForOwnersPage: React.FC = () => {
  const { t } = useTranslation('forOwners');
  const navigate = useLanguageNavigate();

  const handleListStudio = () => {
    navigate(`/create-studio`);
    scrollToTop();
  };

  return (
    <main className="for-owners-page" id="main-content">
      {/* Hero Section */}
      <section className="for-owners-hero">
        <div className="for-owners-hero__content">
          <h1 className="for-owners-hero__title">{t('hero.title')}</h1>
          <p className="for-owners-hero__subtitle">{t('hero.subtitle')}</p>
          <div className="for-owners-hero__cta">
            <Button
              onClick={handleListStudio}
              className="for-owners-hero__button"
              type="button"
              icon={<AddBusinessIcon className="for-owners-hero__button-icon" />}
            >
              {t('hero.cta')}
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Testimonial */}
      <section className="for-owners-testimonial">
        <div className="for-owners-testimonial__content">
          <div className="for-owners-testimonial__quote">
            <p className="for-owners-testimonial__text">"{t('testimonial.quote')}"</p>
            <div className="for-owners-testimonial__author">
              <span className="for-owners-testimonial__name">{t('testimonial.name')}</span>
              <span className="for-owners-testimonial__location">{t('testimonial.location')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* What Types of Shoots Section */}
      <section className="for-owners-shoot-types">
        <div className="for-owners-shoot-types__container">
          <h2 className="for-owners-shoot-types__title">{t('shootTypes.title')}</h2>
          <div className="for-owners-shoot-types__grid">
            <div className="for-owners-shoot-type-card">
              <PhotoCameraIcon className="for-owners-shoot-type-card__icon" />
              <h3 className="for-owners-shoot-type-card__title">{t('shootTypes.photoshoots.title')}</h3>
              <p className="for-owners-shoot-type-card__description">{t('shootTypes.photoshoots.description')}</p>
            </div>
            <div className="for-owners-shoot-type-card">
              <VideocamIcon className="for-owners-shoot-type-card__icon" />
              <h3 className="for-owners-shoot-type-card__title">{t('shootTypes.commercials.title')}</h3>
              <p className="for-owners-shoot-type-card__description">{t('shootTypes.commercials.description')}</p>
            </div>
            <div className="for-owners-shoot-type-card">
              <MovieIcon className="for-owners-shoot-type-card__icon" />
              <h3 className="for-owners-shoot-type-card__title">{t('shootTypes.filmShoots.title')}</h3>
              <p className="for-owners-shoot-type-card__description">{t('shootTypes.filmShoots.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="for-owners-how-it-works">
        <div className="for-owners-how-it-works__container">
          <h2 className="for-owners-how-it-works__title">{t('howItWorks.title')}</h2>
          <div className="for-owners-how-it-works__steps">
            <div className="for-owners-step">
              <div className="for-owners-step__number">1</div>
              <div className="for-owners-step__content">
                <h3 className="for-owners-step__title">{t('howItWorks.step1.title')}</h3>
                <p className="for-owners-step__description">{t('howItWorks.step1.description')}</p>
                <div className="for-owners-step__details">
                  <div className="for-owners-step__detail">
                    <CheckCircleIcon className="for-owners-step__detail-icon" />
                    <span>{t('howItWorks.step1.detail1')}</span>
                  </div>
                  <div className="for-owners-step__detail">
                    <CheckCircleIcon className="for-owners-step__detail-icon" />
                    <span>{t('howItWorks.step1.detail2')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="for-owners-step">
              <div className="for-owners-step__number">2</div>
              <div className="for-owners-step__content">
                <h3 className="for-owners-step__title">{t('howItWorks.step2.title')}</h3>
                <p className="for-owners-step__description">{t('howItWorks.step2.description')}</p>
                <div className="for-owners-step__details">
                  <div className="for-owners-step__detail">
                    <CheckCircleIcon className="for-owners-step__detail-icon" />
                    <span>{t('howItWorks.step2.detail1')}</span>
                  </div>
                  <div className="for-owners-step__detail">
                    <CheckCircleIcon className="for-owners-step__detail-icon" />
                    <span>{t('howItWorks.step2.detail2')}</span>
                  </div>
                  <div className="for-owners-step__detail">
                    <CheckCircleIcon className="for-owners-step__detail-icon" />
                    <span>{t('howItWorks.step2.detail3')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="for-owners-step">
              <div className="for-owners-step__number">3</div>
              <div className="for-owners-step__content">
                <h3 className="for-owners-step__title">{t('howItWorks.step3.title')}</h3>
                <p className="for-owners-step__description">{t('howItWorks.step3.description')}</p>
                <div className="for-owners-step__details">
                  <div className="for-owners-step__detail">
                    <CheckCircleIcon className="for-owners-step__detail-icon" />
                    <span>{t('howItWorks.step3.detail1')}</span>
                  </div>
                  <div className="for-owners-step__detail">
                    <CheckCircleIcon className="for-owners-step__detail-icon" />
                    <span>{t('howItWorks.step3.detail2')}</span>
                  </div>
                  <div className="for-owners-step__detail">
                    <CheckCircleIcon className="for-owners-step__detail-icon" />
                    <span>{t('howItWorks.step3.detail3')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="for-owners-benefits">
        <div className="for-owners-benefits__container">
          <h2 className="for-owners-benefits__title">{t('benefits.title')}</h2>
          <div className="for-owners-benefits__grid">
            <div className="for-owners-benefit-card">
              <SecurityIcon className="for-owners-benefit-card__icon" />
              <h3 className="for-owners-benefit-card__title">{t('benefits.security.title')}</h3>
              <p className="for-owners-benefit-card__description">{t('benefits.security.description')}</p>
            </div>
            <div className="for-owners-benefit-card">
              <PaymentIcon className="for-owners-benefit-card__icon" />
              <h3 className="for-owners-benefit-card__title">{t('benefits.payment.title')}</h3>
              <p className="for-owners-benefit-card__description">{t('benefits.payment.description')}</p>
            </div>
            <div className="for-owners-benefit-card">
              <SupportAgentIcon className="for-owners-benefit-card__icon" />
              <h3 className="for-owners-benefit-card__title">{t('benefits.support.title')}</h3>
              <p className="for-owners-benefit-card__description">{t('benefits.support.description')}</p>
            </div>
            <div className="for-owners-benefit-card">
              <TrendingUpIcon className="for-owners-benefit-card__icon" />
              <h3 className="for-owners-benefit-card__title">{t('benefits.earnings.title')}</h3>
              <p className="for-owners-benefit-card__description">{t('benefits.earnings.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="for-owners-final-cta">
        <div className="for-owners-final-cta__content">
          <h2 className="for-owners-final-cta__title">{t('finalCta.title')}</h2>
          <p className="for-owners-final-cta__subtitle">{t('finalCta.subtitle')}</p>
          <Button
            onClick={handleListStudio}
            className="for-owners-final-cta__button"
            type="button"
            icon={<AddBusinessIcon className="for-owners-final-cta__button-icon" />}
          >
            {t('finalCta.button')}
          </Button>
        </div>
      </section>
    </main>
  );
};

export default ForOwnersPage;
