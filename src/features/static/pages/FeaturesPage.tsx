/**
 * Features List Page – All product features with links to each feature page.
 * Path: /:lang/features
 * Consumable by Holo via JSON-LD and semantic HTML.
 */
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Clock3,
  CreditCard,
  Headphones,
  SlidersHorizontal,
  Sparkles,
  Store
} from 'lucide-react';
import { BASE_URL, FEATURE_IMAGES, toAbsoluteImageUrl } from '../featuresConfig';
import type { FeatureId } from '../featuresConfig';
import '../styles/_features-page.scss';
import '../styles/_features-page-showcase.scss';

const FEATURE_ICONS = {
  calendar: CalendarDays,
  insights: BarChart3,
  services: SlidersHorizontal,
  payments: CreditCard,
  studio_pages: Store,
  availability: Clock3,
  remote: Headphones
} satisfies Record<FeatureId, typeof Sparkles>;

export default function FeaturesPage() {
  const { t, i18n } = useTranslation('features');
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = (lang || i18n.language) === 'en' ? 'en' : 'he';

  const list = t('list', { returnObjects: true }) as Array<{
    id: string;
    title: string;
    description: string;
  }>;
  const features = useMemo(() => {
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({
      ...item,
      images: FEATURE_IMAGES[item.id as FeatureId] ?? []
    }));
  }, [list]);

  const jsonLd = useMemo(() => {
    const itemListElement = features.map((f, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        '@id': `${BASE_URL}/${currentLang}/features/${f.id}`,
        name: f.title,
        description: f.description,
        image: f.images.map(toAbsoluteImageUrl)
      }
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: t('meta.title'),
      description: t('meta.description'),
      numberOfItems: features.length,
      itemListElement
    };
  }, [features, currentLang, t]);

  const heroFeature = features[0];

  return (
    <>
      <Helmet>
        <title>{t('meta.title')} | Studioz.co.il</title>
        <meta name="description" content={t('meta.description')} />
        <link rel="canonical" href={`${BASE_URL}/${currentLang}/features`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main className="features-page" dir={currentLang === 'he' ? 'rtl' : 'ltr'}>
        <section className="features-page__hero">
          <div className="features-page__ambient features-page__ambient--one" />
          <div className="features-page__ambient features-page__ambient--two" />
          <div className="features-page__container">
            <div className="features-page__hero-copy">
              <span className="features-page__eyebrow">
                <Sparkles aria-hidden="true" />
                {t('hero.eyebrow')}
              </span>
              <h1 className="features-page__title">
                {t('hero.title')} <span>{t('hero.titleAccent')}</span>
              </h1>
              <p className="features-page__lead">{t('hero.description')}</p>
              <div className="features-page__hero-actions">
                <a className="features-page__primary-action" href="#feature-grid">
                  {t('hero.primaryCta')}
                  <ArrowDown aria-hidden="true" />
                </a>
                <Link className="features-page__secondary-action" to={`/${currentLang}/owner-faq`}>
                  {t('hero.secondaryCta')}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
            </div>

            {heroFeature?.images[0] && (
              <div className="features-page__product-stage">
                <div className="features-page__browser">
                  <div className="features-page__browser-bar" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <div />
                  </div>
                  <img src={heroFeature.images[0]} alt={heroFeature.title} decoding="async" fetchPriority="high" />
                </div>
                <div className="features-page__floating-note">
                  <CalendarDays aria-hidden="true" />
                  <span>{t('hero.floatingNote')}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="feature-grid" className="features-page__showcase">
          <div className="features-page__container">
            <header className="features-page__section-header">
              <span className="features-page__section-kicker">{t('grid.eyebrow')}</span>
              <h2>{t('grid.title')}</h2>
              <p>{t('grid.description')}</p>
            </header>

            <div className="features-page__grid">
              {features.map((feature, index) => {
                const Icon = FEATURE_ICONS[feature.id as FeatureId] ?? Sparkles;
                const image = feature.images[0];

                return (
                  <article
                    key={feature.id}
                    id={feature.id}
                    className={`features-page__card features-page__card--${feature.id}`}
                  >
                    <Link to={`/${currentLang}/features/${feature.id}`} className="features-page__card-link">
                      <div className="features-page__card-content">
                        <span className="features-page__card-icon">
                          <Icon aria-hidden="true" />
                        </span>
                        <div>
                          <h3 className="features-page__card-title">{feature.title}</h3>
                          <p className="features-page__card-description">{feature.description}</p>
                        </div>
                        <span className="features-page__card-cta">
                          {t('grid.details')}
                          <ArrowUpRight aria-hidden="true" />
                        </span>
                      </div>
                      {image && (
                        <div className="features-page__card-visual">
                          <div className="features-page__card-screen">
                            <span className="features-page__card-screen-glow" />
                            <img src={image} alt="" loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
                          </div>
                        </div>
                      )}
                    </Link>
                  </article>
                );
              })}
            </div>

            <aside className="features-page__closing">
              <div>
                <span className="features-page__section-kicker">{t('closing.eyebrow')}</span>
                <h2>{t('closing.title')}</h2>
                <p>{t('closing.description')}</p>
              </div>
              <Link to={`/${currentLang}/studio/create`} className="features-page__primary-action">
                {t('closing.cta')}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
