/**
 * Feature Detail Page – Single product feature with all assets and text.
 * Path: /:lang/features/:featureId
 * Consumable by Holo via JSON-LD and semantic HTML.
 */
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  BASE_URL,
  FEATURE_IMAGES,
  toAbsoluteImageUrl,
  isFeatureId,
  type FeatureId
} from '../featuresConfig';
import '../styles/_features-page.scss';

export default function FeatureDetailPage() {
  const { t, i18n } = useTranslation('features');
  const { lang, featureId } = useParams<{ lang?: string; featureId?: string }>();

  const currentLang = (lang || i18n.language) === 'en' ? 'en' : 'he';
  const list = t('list', { returnObjects: true }) as Array<{
    id: string;
    title: string;
    description: string;
  }>;

  const feature = useMemo(() => {
    if (!featureId || !isFeatureId(featureId)) return null;
    if (!Array.isArray(list)) return null;
    const item = list.find((x) => x.id === featureId);
    if (!item) return null;
    const images = FEATURE_IMAGES[featureId as FeatureId] ?? [];
    return { ...item, images };
  }, [featureId, list]);

  const jsonLd = useMemo(() => {
    if (!feature) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Thing',
      '@id': `${BASE_URL}/${currentLang}/features/${feature.id}`,
      name: feature.title,
      description: feature.description,
      image: feature.images.map(toAbsoluteImageUrl)
    };
  }, [feature, currentLang]);

  if (!featureId || !isFeatureId(featureId)) {
    return <Navigate to={`/${currentLang}/features`} replace />;
  }

  if (!feature) {
    return <Navigate to={`/${currentLang}/features`} replace />;
  }

  const backHref = `/${currentLang}/features`;
  const backLabel = currentLang === 'he' ? 'חזרה לכל התכונות' : 'Back to all features';

  return (
    <>
      <Helmet>
        <title>{feature.title} | Studioz.co.il</title>
        <meta name="description" content={feature.description} />
        <link rel="canonical" href={`${BASE_URL}/${currentLang}/features/${feature.id}`} />
        {jsonLd && (
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        )}
      </Helmet>

      <main
        className="features-page features-page--detail"
        dir={currentLang === 'he' ? 'rtl' : 'ltr'}
      >
        <div className="features-page__container">
          <nav className="features-page__breadcrumb" aria-label="Breadcrumb">
            <Link to={backHref} className="features-page__breadcrumb-link">
              {backLabel}
            </Link>
          </nav>

          <article
            id={feature.id}
            className="features-page__detail-card"
            aria-labelledby="feature-title"
          >
            <header className="features-page__detail-header">
              <h1 id="feature-title" className="features-page__detail-title">
                {feature.title}
              </h1>
              <p className="features-page__detail-description">{feature.description}</p>
            </header>

            {feature.images.length > 0 && (
              <section
                className="features-page__detail-gallery"
                aria-label="Feature images"
              >
                {feature.images.map((src, i) => (
                  <motion.div
                    key={i}
                    className="features-page__detail-image-wrap"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.08 }}
                  >
                    <img
                      src={src}
                      alt={i === 0 ? feature.title : `${feature.title} (${i + 1})`}
                      className="features-page__detail-image"
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </motion.div>
                ))}
              </section>
            )}
          </article>
        </div>
      </main>
    </>
  );
}
