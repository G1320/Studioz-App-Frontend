/**
 * Features Page – Product features with explanations and images.
 * Consumable by Holo and other tools via JSON-LD and semantic HTML.
 */
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import '../styles/_features-page.scss';

const BASE_URL = 'https://www.studioz.co.il';

// Feature id → image paths (relative). Same for all locales.
const FEATURE_IMAGES: Record<string, string[]> = {
  calendar: ['/images/optimized/Studioz-Dashboard-Calendar.webp'],
  insights: [
    'https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/3a367b33-67cb-40f8-95ff-6e999870beae/1769012593593-19b82447/Studioz-stats.PNG'
  ],
  services: ['/images/optimized/Studioz-Studio-Details-Order-1-Light.webp'],
  payments: [
    'https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/3a367b33-67cb-40f8-95ff-6e999870beae/1769012592283-95784a84/Studioz-Service-Detail-PaymentStep-Saved-Cards.PNG'
  ],
  studio_pages: [
    '/images/optimized/Studioz-Studio-Details-1-Dark-315w.webp',
    '/images/optimized/Studioz-Studio-Details-1-Light-315w.webp'
  ],
  availability: ['/images/optimized/Studio-Availability-Controls-desktop-1-V3-634w.webp'],
  remote: ['/images/optimized/Studioz-Dashboard-Calendar.webp']
};

function toAbsolute(url: string): string {
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default function FeaturesPage() {
  const { t, i18n } = useTranslation('features');
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = (lang || i18n.language) === 'en' ? 'en' : 'he';

  const list = t('list', { returnObjects: true }) as Array<{ id: string; title: string; description: string }>;
  const features = useMemo(() => {
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({
      ...item,
      images: FEATURE_IMAGES[item.id] || []
    }));
  }, [list]);

  const jsonLd = useMemo(() => {
    const itemListElement = features.map((f, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        '@id': `${BASE_URL}/${currentLang}/features#${f.id}`,
        name: f.title,
        description: f.description,
        image: f.images.map(toAbsolute)
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
                  <h2 className="features-page__card-title">{feature.title}</h2>
                  <p className="features-page__card-description">{feature.description}</p>
                </div>
                {feature.images.length > 0 && (
                  <div className="features-page__card-images">
                    {feature.images.map((src, i) => (
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
                  </div>
                )}
              </motion.article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
