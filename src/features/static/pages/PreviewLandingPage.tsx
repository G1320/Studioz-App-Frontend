import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Headphones,
  Store
} from 'lucide-react';
import { useTheme } from '@shared/contexts/ThemeContext';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { trackCustomEvent, trackEvent } from '@shared/utils/analytics';
import '../styles/_preview-landing-page.scss';

const PILLAR_ICONS = {
  bookings: CalendarDays,
  remote: Headphones,
  insights: BarChart3,
  presence: Store
} as const;

type PillarId = keyof typeof PILLAR_ICONS;

const OPS_ROTATE_MS = 6000;

const SHOWCASES = [
  {
    key: 'operations',
    desktops: ['desktop-reservations', 'desktop-projects'] as const
  },
  {
    key: 'calendar',
    desktops: ['desktop-calendar', 'desktop-calendar-list'] as const
  },
  {
    key: 'projects',
    desktop: undefined,
    mobile: 'cross-device-project-review-mobile'
  },
  {
    key: 'analytics',
    desktop: 'cross-device-analytics-desktop',
    mobile: 'cross-device-analytics-mobile'
  },
  {
    key: 'presence',
    desktop: 'desktop-studio-portfolio',
    mobile: 'mobile-studio-portfolio'
  }
] as const;

/** First two ops surfaces share a row — same visual weight, both desktop rotations. */
const PAIRED_SHOWCASE_COUNT = 2;

interface ProductVisualProps {
  desktopSrc?: string;
  desktopSrcs?: string[];
  mobileSrc?: string;
  alt: string;
  eager?: boolean;
  hero?: boolean;
}

function ProductVisual({
  desktopSrc,
  desktopSrcs,
  mobileSrc,
  alt,
  eager = false,
  hero = false
}: ProductVisualProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const desktopSources = desktopSrcs?.length ? desktopSrcs : desktopSrc ? [desktopSrc] : [];
  const rotating = desktopSources.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullyInView, setFullyInView] = useState(false);
  const mobileOnly = Boolean(mobileSrc && desktopSources.length === 0);

  useEffect(() => {
    if (!rotating || reduceMotion) return;
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFullyInView(Boolean(entry?.isIntersecting && entry.intersectionRatio >= 1));
      },
      { threshold: 1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rotating, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !rotating || !fullyInView) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % desktopSources.length);
    }, OPS_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, rotating, fullyInView, desktopSources.length]);

  return (
    <div
      ref={rootRef}
      className={[
        'preview-landing__product-visual',
        desktopSrc && mobileSrc && !rotating ? 'preview-landing__product-visual--dual' : '',
        mobileOnly ? 'preview-landing__product-visual--mobile-only' : '',
        hero ? 'preview-landing__product-visual--hero' : ''
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {desktopSources.length > 0 ? (
        <div
          className={[
            'preview-landing__shot',
            'preview-landing__shot--desktop',
            rotating ? 'preview-landing__shot--rotating' : ''
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {desktopSources.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={index === activeIndex ? alt : ''}
              aria-hidden={index === activeIndex ? undefined : true}
              loading={eager || index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className={index === activeIndex ? 'is-active' : undefined}
            />
          ))}
        </div>
      ) : null}
      {mobileSrc ? (
        <div className="preview-landing__shot preview-landing__shot--mobile">
          <img
            src={mobileSrc}
            alt={desktopSources.length > 0 ? '' : alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
      ) : null}
    </div>
  );
}

export default function PreviewLandingPage() {
  const { t, i18n } = useTranslation('landingPreview');
  const { resolvedTheme } = useTheme();
  const navigate = useLanguageNavigate();
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = (lang || i18n.language) === 'en' ? 'en' : 'he';
  const assetLocale = currentLang === 'he' ? 'he' : 'en-US';
  const reduceMotion = useReducedMotion();
  const hasTrackedView = useRef(false);

  const captureUrl = useCallback(
    (capture: string) => `/images/features-generated/${assetLocale}/${resolvedTheme}/${capture}.webp`,
    [assetLocale, resolvedTheme]
  );

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    trackCustomEvent('ViewLandingPage', {
      content_name: 'Preview Landing',
      content_category: 'Landing Page'
    });
  }, []);

  const handleGetStarted = () => {
    trackEvent('Lead', {
      content_name: 'Preview Landing CTA',
      content_category: 'Conversion'
    });
    navigate('/studio/create');
  };

  const pillars = t('pillars.items', { returnObjects: true }) as Array<{
    id: string;
    title: string;
    description: string;
  }>;

  const proofItems = t('proof.items', { returnObjects: true }) as Array<{
    quote: string;
    role: string;
  }>;

  const fadeUp = reduceMotion
    ? { initial: false, animate: false }
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-10% 0px' },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }
      };

  return (
    <>
      <Helmet>
        <title>{t('meta.title')} | Studioz</title>
        <meta name="description" content={t('meta.description')} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="preview-landing" dir={currentLang === 'he' ? 'rtl' : 'ltr'}>
        <section className="preview-landing__hero">
          <div className="preview-landing__container">
            <motion.div
              className="preview-landing__hero-copy"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="preview-landing__title">
                {t('hero.title')}
                <span>{t('hero.titleAccent')}</span>
              </h1>
              <p className="preview-landing__lead">{t('hero.description')}</p>
              <div className="preview-landing__hero-actions">
                <button type="button" className="preview-landing__cta" onClick={handleGetStarted}>
                  {t('hero.primaryCta')}
                  <ArrowRight aria-hidden="true" />
                </button>
                <a className="preview-landing__text-link" href="#platform">
                  {t('hero.secondaryCta')}
                </a>
              </div>
            </motion.div>

            <motion.div
              className="preview-landing__hero-visual"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductVisual
                desktopSrc={captureUrl('desktop-project-workspace')}
                alt={t('showcase.projects.imageAlt')}
                eager
                hero
              />
            </motion.div>
          </div>
        </section>

        <section className="preview-landing__pillars" aria-labelledby="preview-pillars-title">
          <div className="preview-landing__container">
            <motion.header className="preview-landing__section-header" {...fadeUp}>
              <h2 id="preview-pillars-title">{t('pillars.title')}</h2>
            </motion.header>

            <div className="preview-landing__pillar-grid">
              {(Array.isArray(pillars) ? pillars : []).map((pillar) => {
                const Icon = PILLAR_ICONS[pillar.id as PillarId] ?? CalendarDays;
                return (
                  <motion.article key={pillar.id} className="preview-landing__pillar" {...fadeUp}>
                    <span className="preview-landing__pillar-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.description}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="platform" className="preview-landing__platform">
          <div className="preview-landing__container">
            <motion.header className="preview-landing__section-header" {...fadeUp}>
              <h2>{t('platform.title')}</h2>
              <p className="preview-landing__section-lead">{t('platform.description')}</p>
            </motion.header>

            <div className="preview-landing__showcase-list">
              <div className="preview-landing__showcase-pair">
                {SHOWCASES.slice(0, PAIRED_SHOWCASE_COUNT).map((showcase, index) => {
                  const desktops =
                    'desktops' in showcase
                      ? showcase.desktops.map((id) => captureUrl(id))
                      : undefined;
                  const desktop =
                    'desktop' in showcase && showcase.desktop ? captureUrl(showcase.desktop) : undefined;

                  return (
                    <motion.article
                      key={showcase.key}
                      className="preview-landing__showcase preview-landing__showcase--paired"
                      {...fadeUp}
                    >
                      <div className="preview-landing__showcase-copy">
                        <h3>{t(`showcase.${showcase.key}.title`)}</h3>
                        <p>{t(`showcase.${showcase.key}.description`)}</p>
                      </div>
                      <div className="preview-landing__showcase-visual">
                        <ProductVisual
                          desktopSrc={desktop}
                          desktopSrcs={desktops}
                          alt={t(`showcase.${showcase.key}.imageAlt`)}
                          eager={index === 0}
                        />
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {SHOWCASES.slice(PAIRED_SHOWCASE_COUNT).map((showcase, index) => {
                const desktop =
                  'desktop' in showcase && showcase.desktop ? captureUrl(showcase.desktop) : undefined;
                const desktops =
                  'desktops' in showcase
                    ? showcase.desktops.map((id) => captureUrl(id))
                    : undefined;
                const mobile =
                  'mobile' in showcase && showcase.mobile ? captureUrl(showcase.mobile) : undefined;

                return (
                  <motion.article
                    key={showcase.key}
                    className={`preview-landing__showcase ${index % 2 ? 'preview-landing__showcase--reverse' : ''}`}
                    {...fadeUp}
                  >
                    <div className="preview-landing__showcase-copy">
                      <h3>{t(`showcase.${showcase.key}.title`)}</h3>
                      <p>{t(`showcase.${showcase.key}.description`)}</p>
                    </div>
                    <div className="preview-landing__showcase-visual">
                      <ProductVisual
                        desktopSrc={desktop}
                        desktopSrcs={desktops}
                        mobileSrc={mobile}
                        alt={t(`showcase.${showcase.key}.imageAlt`)}
                      />
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="preview-landing__proof">
          <div className="preview-landing__container">
            <div className="preview-landing__proof-grid">
              {(Array.isArray(proofItems) ? proofItems : []).map((item) => (
                <motion.blockquote key={item.role} className="preview-landing__proof-item" {...fadeUp}>
                  <p>{item.quote}</p>
                  <footer>{item.role}</footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="preview-landing__closing">
          <div className="preview-landing__container">
            <motion.div className="preview-landing__closing-inner" {...fadeUp}>
              <h2>{t('closing.title')}</h2>
              <p>{t('closing.description')}</p>
              <div className="preview-landing__hero-actions">
                <button type="button" className="preview-landing__cta" onClick={handleGetStarted}>
                  {t('closing.primaryCta')}
                  <ArrowRight aria-hidden="true" />
                </button>
                <Link className="preview-landing__text-link" to={`/${currentLang}/features`}>
                  {t('closing.secondaryCta')}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
