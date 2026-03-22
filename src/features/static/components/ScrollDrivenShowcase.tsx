/**
 * ScrollDrivenShowcase Component
 * Feature showcase carousel using Swiper (fade effect, autoplay, pagination).
 * Touch/swipe and animations are handled by Swiper for reliable behavior on all devices.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Calendar, CreditCard, BarChart3, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import './_scroll-driven-showcase.scss';

const AUTOPLAY_DELAY = 6000;

interface Feature {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  image: string;
  srcSet?: string;
  sizes?: string;
}

const FEATURES: Feature[] = [
  {
    id: 'calendar',
    titleKey: 'showcase.calendar.title',
    descriptionKey: 'showcase.calendar.description',
    icon: Calendar,
    color: '#f7c041',
    image: '/images/optimized/Studioz-Dashboard-Calendar-400w.webp',
    srcSet: '/images/optimized/Studioz-Dashboard-Calendar-400w.webp 400w, /images/optimized/Studioz-Dashboard-Calendar-800w.webp 800w',
    sizes: '(max-width: 768px) 200px, 400px'
  },
  {
    id: 'stats',
    titleKey: 'showcase.stats.title',
    descriptionKey: 'showcase.stats.description',
    icon: BarChart3,
    color: '#0ea5e9',
    image: '/images/optimized/Dashboard-Overview-Mobile-315w.webp',
    srcSet: '/images/optimized/Dashboard-Overview-Mobile-315w.webp 315w, /images/optimized/Dashboard-Overview-Mobile-630w.webp 630w',
    sizes: '(max-width: 768px) 200px, 400px'
  },
  {
    id: 'service',
    titleKey: 'showcase.service.title',
    descriptionKey: 'showcase.service.description',
    icon: Sparkles,
    color: '#10b981',
    image: '/images/optimized/Studioz-Studio-Details-Order-1-Light-400w.webp',
    srcSet: '/images/optimized/Studioz-Studio-Details-Order-1-Light-400w.webp 400w, /images/optimized/Studioz-Studio-Details-Order-1-Light-800w.webp 800w',
    sizes: '(max-width: 768px) 200px, 400px'
  },
  {
    id: 'payments',
    titleKey: 'showcase.payments.title',
    descriptionKey: 'showcase.payments.description',
    icon: CreditCard,
    color: '#6366f1',
    image: 'https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/3a367b33-67cb-40f8-95ff-6e999870beae/1769012592283-95784a84/Studioz-Service-Detail-PaymentStep-Saved-Cards.PNG'
  }
];

const PROGRESS_TICK_MS = 50;

export const ScrollDrivenShowcase: React.FC = () => {
  const { t, i18n } = useTranslation('forOwners');
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(false);
  const [textHover, setTextHover] = useState(false);
  const [phoneHover, setPhoneHover] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const slideStartTimeRef = useRef(Date.now());

  const contentHover = textHover || phoneHover;

  const activeFeature = FEATURES[activeIndex];
  const Icon = activeFeature.icon;
  const isRTL = i18n.dir() === 'rtl';

  // Resume autoplay when mouse leaves both pause zones (and section is in view)
  useEffect(() => {
    if (!contentHover && inView) {
      slideStartTimeRef.current = Date.now();
      setProgress(0);
      swiperRef.current?.autoplay?.start();
    }
  }, [contentHover, inView]);

  // Start autoplay when section is in view, stop when out of view; reset progress when entering view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const now = Date.now();
        if (entry.isIntersecting) {
          setInView(true);
          slideStartTimeRef.current = now;
          setProgress(0);
        } else {
          setInView(false);
          swiperRef.current?.autoplay?.stop();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Progress tick: fill the active pill over AUTOPLAY_DELAY when in view (paused when hovering content)
  useEffect(() => {
    if (!inView || contentHover) return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - slideStartTimeRef.current;
      const value = Math.min(1, elapsed / AUTOPLAY_DELAY);
      setProgress(value);
    }, PROGRESS_TICK_MS);
    return () => clearInterval(interval);
  }, [inView, activeIndex, contentHover]);

  return (
    <section ref={sectionRef} className="feature-showcase">
      <div className="feature-showcase__container">
        {/* Text Side - synced via onSlideChange + CSS transition; separate pause zone */}
        <div
          className="feature-showcase__text-side feature-showcase__pause-zone"
          onMouseEnter={() => {
            setTextHover(true);
            swiperRef.current?.autoplay?.stop();
          }}
          onMouseLeave={() => setTextHover(false)}
        >
          <div className="feature-showcase__text-content">
            <div key={activeIndex} className="feature-showcase__feature feature-showcase__feature--animate">
              <div className="feature-showcase__feature-header">
                <div
                  className="feature-showcase__feature-icon-wrapper"
                  style={{ borderColor: activeFeature.color }}
                >
                  <Icon
                    className="feature-showcase__feature-icon"
                    style={{ color: activeFeature.color }}
                  />
                </div>
                <span className="feature-showcase__feature-index">
                  0{activeIndex + 1}
                </span>
              </div>
              <h2 className="feature-showcase__feature-title">
                {t(activeFeature.titleKey)}
              </h2>
              <p className="feature-showcase__feature-description">
                {t(activeFeature.descriptionKey)}
              </p>
            </div>

            {/* Custom pill navigation - click calls swiper.slideTo */}
            <div className="feature-showcase__progress-bars">
              {FEATURES.map((feature, idx) => (
                <button
                  key={feature.id}
                  type="button"
                  className={`feature-showcase__progress-bar ${idx === activeIndex ? 'feature-showcase__progress-bar--active' : ''} ${idx < activeIndex ? 'feature-showcase__progress-bar--completed' : ''}`}
                  onClick={() => swiperRef.current?.slideToLoop(idx)}
                  aria-label={t(feature.titleKey)}
                  aria-current={idx === activeIndex ? 'true' : undefined}
                >
                  <div
                    className="feature-showcase__progress-fill"
                    style={{
                      width: idx === activeIndex ? `${progress * 100}%` : idx < activeIndex ? '100%' : '0%',
                      backgroundColor: feature.color
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Phone Side - single Swiper with fade effect; separate pause zone */}
        <div className="feature-showcase__phone-side">
          <div
            className="feature-showcase__phone-container feature-showcase__pause-zone"
            onMouseEnter={() => {
              setPhoneHover(true);
              swiperRef.current?.autoplay?.stop();
            }}
            onMouseLeave={() => setPhoneHover(false)}
          >
            <div className="feature-showcase__phone-frame">
              <div className="feature-showcase__phone-notch" />
              <div className="feature-showcase__phone-screen feature-showcase-swiper__container">
                <Swiper
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  onSlideChange={(swiper) => {
                    slideStartTimeRef.current = Date.now();
                    setProgress(0);
                    setActiveIndex(swiper.realIndex);
                  }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className="feature-showcase-swiper feature-showcase-swiper--phone"
                  modules={[Autoplay, EffectFade, Pagination]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  speed={300}
                  allowTouchMove={true}
                  slidesPerView={1}
                  spaceBetween={0}
                  loop={true}
                  autoplay={{
                    delay: AUTOPLAY_DELAY,
                    disableOnInteraction: false
                  }}
                  pagination={false}
                >
                  {FEATURES.map((feature) => (
                    <SwiperSlide key={feature.id}>
                      <img
                        src={feature.image}
                        srcSet={feature.srcSet}
                        sizes={feature.sizes}
                        alt={t(feature.titleKey)}
                        className="feature-showcase__phone-image"
                        loading="lazy"
                        decoding="async"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            <div
              className="feature-showcase__deco-glow"
              style={{
                background: `radial-gradient(ellipse at center, ${activeFeature.color}20 0%, transparent 70%)`
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollDrivenShowcase;
