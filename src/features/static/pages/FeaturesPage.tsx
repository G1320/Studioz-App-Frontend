import { useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  Clock3,
  CreditCard,
  Headphones,
  SlidersHorizontal,
  Sparkles,
  Store
} from 'lucide-react';
import { useTheme } from '@shared/contexts/ThemeContext';
import {
  BASE_URL,
  FEATURE_SHOTS,
  featureCaptureUrl,
  toAbsoluteImageUrl,
  type CaptureLocale,
  type FeatureId
} from '../featuresConfig';
import { IphoneStatusChrome } from '../components/IphoneStatusChrome';
import '../components/_iphone-status-chrome.scss';
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

/**
 * Showcase rows for /features — intentionally different assets from PreviewLandingPage:
 * landing owns ops/calendar/projects/analytics/presence plus studios + invoices at the bottom.
 */
const SHOWCASES = [
  { key: 'calendar', desktop: 'desktop-calendar', mobile: 'mobile-calendar' },
  { key: 'insights', desktop: 'desktop-stats', mobile: 'mobile-analytics-revenue' },
  { key: 'delivery', desktop: 'desktop-project-workspace', mobile: 'mobile-project-workspace' }
] as const;

interface ProductVisualProps {
  desktopSrc: string;
  mobileSrc?: string;
  alt: string;
  eager?: boolean;
  hero?: boolean;
}

function ProductVisual({ desktopSrc, mobileSrc, alt, eager = false, hero = false }: ProductVisualProps) {
  return (
    <div
      className={`features-page__product-visual ${mobileSrc ? 'features-page__product-visual--dual' : ''} ${
        hero ? 'features-page__product-visual--hero' : ''
      }`}
    >
      <div className="features-page__desktop-frame">
        <div className="features-page__desktop-chrome" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <img src={desktopSrc} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      </div>
      {mobileSrc && (
        <div className="features-page__phone-frame">
          <div className="features-page__phone-screen">
            <IphoneStatusChrome />
            <img src={mobileSrc} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function FeaturesPage() {
  const { t, i18n } = useTranslation('features');
  const { resolvedTheme } = useTheme();
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = (lang || i18n.language) === 'en' ? 'en' : 'he';
  const assetLocale: CaptureLocale = currentLang === 'he' ? 'he' : 'en-US';
  const captureUrl = useCallback(
    (capture: string) => featureCaptureUrl(capture, assetLocale, resolvedTheme),
    [assetLocale, resolvedTheme]
  );

  const list = t('list', { returnObjects: true }) as Array<{
    id: string;
    title: string;
    description: string;
  }>;
  const features = useMemo(() => {
    if (!Array.isArray(list)) return [];
    return list.map((item) => {
      const shots = FEATURE_SHOTS[item.id as FeatureId] ?? [];
      return {
        ...item,
        images: shots.slice(0, 1).map((shot) => captureUrl(shot))
      };
    });
  }, [list, captureUrl]);

  const jsonLd = useMemo(() => {
    const itemListElement = features.map((feature, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        '@id': `${BASE_URL}/${currentLang}/features/${feature.id}`,
        name: feature.title,
        description: feature.description,
        image: feature.images.map(toAbsoluteImageUrl)
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

  return (
    <>
      <Helmet>
        <title>{t('meta.title')} | Studioz.co.il</title>
        <meta name="description" content={t('meta.description')} />
        <link rel="canonical" href={`${BASE_URL}/${currentLang}/features`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="features-page" dir={currentLang === 'he' ? 'rtl' : 'ltr'}>
        <section className="features-page__hero">
          <div className="features-page__container">
            <div className="features-page__hero-copy">
              <h1 className="features-page__title">
                {t('hero.title')}
                <span>{t('hero.titleAccent')}</span>
              </h1>
              <p className="features-page__lead">{t('hero.description')}</p>
              <div className="features-page__hero-actions">
                <a className="features-page__primary-action" href="#platform">
                  {t('hero.primaryCta')}
                  <ArrowRight aria-hidden="true" />
                </a>
                <Link className="features-page__secondary-action" to={`/${currentLang}/preview/landing#studio-faq`}>
                  {t('hero.secondaryCta')}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="features-page__hero-visual">
              <div className="features-page__hero-glow" />
              <ProductVisual
                desktopSrc={captureUrl('desktop-calendar')}
                mobileSrc={captureUrl('mobile-calendar')}
                alt={t('showcase.calendar.imageAlt')}
                eager
                hero
              />
            </div>

            <div className="features-page__trust-row" aria-label={t('proof.label')}>
              {(t('proof.items', { returnObjects: true }) as string[]).map((item) => (
                <span key={item}>
                  <Check aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="platform" className="features-page__platform">
          <div className="features-page__container">
            <header className="features-page__section-header features-page__section-header--center">
              <h2>{t('showcase.title')}</h2>
              <p>{t('showcase.description')}</p>
            </header>

            <div className="features-page__showcase-list">
              {SHOWCASES.map(({ key, desktop, mobile }, index) => (
                <article
                  className={`features-page__showcase-row ${index % 2 ? 'features-page__showcase-row--reverse' : ''}`}
                  key={key}
                >
                  <div className="features-page__showcase-copy">
                    <h3>{t(`showcase.${key}.title`)}</h3>
                    <p>{t(`showcase.${key}.description`)}</p>
                  </div>
                  <div className="features-page__showcase-visual">
                    <ProductVisual
                      desktopSrc={captureUrl(desktop)}
                      mobileSrc={captureUrl(mobile)}
                      alt={t(`showcase.${key}.imageAlt`)}
                      eager={index === 0}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="feature-grid" className="features-page__capabilities">
          <div className="features-page__container">
            <header className="features-page__section-header features-page__section-header--center">
              <h2>{t('grid.title')}</h2>
              <p>{t('grid.description')}</p>
            </header>

            <div className="features-page__capability-grid">
              {features.map((feature) => {
                const Icon = FEATURE_ICONS[feature.id as FeatureId] ?? Sparkles;
                return (
                  <Link
                    key={feature.id}
                    to={`/${currentLang}/features/${feature.id}`}
                    className="features-page__capability"
                  >
                    <span className="features-page__capability-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    <span className="features-page__capability-link">
                      {t('grid.details')}
                      <ArrowRight aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>

            <aside className="features-page__closing">
              <div>
                <h2>{t('closing.title')}</h2>
                <p>{t('closing.description')}</p>
              </div>
              <Link to={`/${currentLang}/studio/create`} className="features-page__primary-action">
                {t('closing.cta')}
                <ArrowRight aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </section>
      </div>
    </>
  );
}
