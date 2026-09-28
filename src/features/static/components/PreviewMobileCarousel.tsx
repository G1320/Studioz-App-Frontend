/**
 * Preview landing mobile product carousel.
 * Fade-swipes published features-generated mobile captures with synced copy.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { IphoneStatusChrome } from './IphoneStatusChrome';
import 'swiper/css';
import 'swiper/css/effect-fade';
import './_preview-mobile-carousel.scss';

const AUTOPLAY_DELAY = 5200;
const PROGRESS_TICK_MS = 50;

export const PREVIEW_MOBILE_SLIDES = [
  { id: 'calendar', capture: 'mobile-calendar' },
  { id: 'booking', capture: 'mobile-booking-flow' },
  { id: 'studio', capture: 'mobile-studio-portfolio' },
  { id: 'workspace', capture: 'mobile-project-workspace' },
  { id: 'documents', capture: 'mobile-documents' }
] as const;

export type PreviewMobileSlideId = (typeof PREVIEW_MOBILE_SLIDES)[number]['id'];

interface PreviewMobileCarouselProps {
  captureUrl: (capture: string) => string;
}

export function PreviewMobileCarousel({ captureUrl }: PreviewMobileCarouselProps) {
  const { t, i18n } = useTranslation('landingPreview');
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const slideStartRef = useRef(Date.now());
  const isRTL = i18n.dir() === 'rtl';

  const slides = useMemo(
    () =>
      PREVIEW_MOBILE_SLIDES.map((slide) => ({
        ...slide,
        src: captureUrl(slide.capture),
        title: t(`mobileCarousel.slides.${slide.id}.title`),
        description: t(`mobileCarousel.slides.${slide.id}.description`),
        imageAlt: t(`mobileCarousel.slides.${slide.id}.imageAlt`)
      })),
    [captureUrl, t]
  );

  const active = slides[activeIndex] ?? slides[0];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          slideStartRef.current = Date.now();
          setProgress(0);
        } else {
          setInView(false);
          swiperRef.current?.autoplay?.stop();
        }
      },
      { threshold: 0.28 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!paused && inView) {
      slideStartRef.current = Date.now();
      setProgress(0);
      swiperRef.current?.autoplay?.start();
    } else {
      swiperRef.current?.autoplay?.stop();
    }
  }, [paused, inView]);

  useEffect(() => {
    if (!inView || paused) return;
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - slideStartRef.current;
      setProgress(Math.min(1, elapsed / AUTOPLAY_DELAY));
    }, PROGRESS_TICK_MS);
    return () => window.clearInterval(interval);
  }, [inView, activeIndex, paused]);

  const dots = (
    <div className="preview-mobile-carousel__dots" role="tablist" aria-label={t('mobileCarousel.title')}>
      {slides.map((slide, idx) => (
        <button
          key={slide.id}
          type="button"
          role="tab"
          aria-selected={idx === activeIndex}
          aria-label={slide.title}
          className={[
            'preview-mobile-carousel__dot',
            idx === activeIndex ? 'is-active' : '',
            idx < activeIndex ? 'is-done' : ''
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => swiperRef.current?.slideToLoop(idx)}
        >
          <span
            className="preview-mobile-carousel__dot-fill"
            style={{
              transform: `scaleX(${idx === activeIndex ? progress : idx < activeIndex ? 1 : 0})`
            }}
          />
        </button>
      ))}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="preview-mobile-carousel"
      aria-labelledby="preview-mobile-carousel-title"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="preview-mobile-carousel__container">
        <div className="preview-mobile-carousel__copy">
          <header className="preview-mobile-carousel__header">
            <h2 id="preview-mobile-carousel-title">{t('mobileCarousel.title')}</h2>
          </header>

          <div
            className="preview-mobile-carousel__active"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <span className="preview-mobile-carousel__index">
              {String(activeIndex + 1).padStart(2, '0')}
              <span aria-hidden="true"> / {String(slides.length).padStart(2, '0')}</span>
            </span>
            <h3 key={active.id}>{active.title}</h3>
            <p key={`${active.id}-desc`}>{active.description}</p>
          </div>
        </div>

        <div
          className="preview-mobile-carousel__phone"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="preview-mobile-carousel__frame">
            <div className="preview-mobile-carousel__screen">
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
                  slideStartRef.current = Date.now();
                  setProgress(0);
                  setActiveIndex(swiper.realIndex);
                }}
                dir={isRTL ? 'rtl' : 'ltr'}
                className="preview-mobile-carousel__swiper"
                modules={[Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={320}
                allowTouchMove
                slidesPerView={1}
                loop
                autoplay={false}
              >
                {slides.map((slide) => (
                  <SwiperSlide key={slide.id}>
                    <div className="preview-mobile-carousel__shot">
                      <IphoneStatusChrome />
                      <img src={slide.src} alt={slide.imageAlt} loading="lazy" decoding="async" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          {dots}
        </div>
      </div>
    </section>
  );
}

export default PreviewMobileCarousel;
