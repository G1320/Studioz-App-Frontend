/**
 * Features List Page – All product features with links to each feature page.
 * Path: /:lang/features
 * Consumable by Holo via JSON-LD and semantic HTML.
 */
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { BASE_URL, FEATURE_IMAGES, toAbsoluteImageUrl } from '../featuresConfig';
import type { FeatureId } from '../featuresConfig';
import '../styles/_features-page.scss';

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

  return (
    <>
      <Helmet>
        <title>{t('meta.title')} | Studioz.co.il</title>
        <meta name="description" content={t('meta.description')} />
        <link rel="canonical" href={`${BASE_URL}/${currentLang}/features`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main className="features-page" dir={currentLang === 'he' ? 'rtl' : 'ltr'}>
        <div className="features-page__container">
          <header className="features-page__header">
            <h1 className="features-page__title">{t('meta.title')}</h1>
            <p className="features-page__lead">{t('meta.description')}</p>
          </header>

          <section className="features-page__list" aria-label="Product features">
            {features.map((feature, index) => (
              <motion.article
                key={feature.id}
                id={feature.id}
                className="features-page__card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <div className="features-page__card-content">
                  <h2 className="features-page__card-title">
                    <Link
                      to={`/${currentLang}/features/${feature.id}`}
                      className="features-page__card-link"
                    >
                      {feature.title}
                    </Link>
                  </h2>
                  <p className="features-page__card-description">{feature.description}</p>
                  <Link
                    to={`/${currentLang}/features/${feature.id}`}
                    className="features-page__card-cta"
                  >
                    {currentLang === 'he' ? 'לפרטים ולתמונות' : 'View details & images'}
                  </Link>
                </div>
                {feature.images.length > 0 && (
                  <Link
                    to={`/${currentLang}/features/${feature.id}`}
                    className="features-page__card-images"
                    aria-label={feature.title}
                  >
                    {feature.images.slice(0, 2).map((src, i) => (
                      <div key={i} className="features-page__card-image-wrap">
                        <img
                          src={src}
                          alt={i === 0 ? feature.title : ''}
                          className="features-page__card-image"
                          loading={index < 3 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      </div>
                    ))}
                    {feature.images.length > 2 && (
                      <span className="features-page__card-more">
                        +{feature.images.length - 2}
                      </span>
                    )}
                  </Link>
                )}
              </motion.article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
