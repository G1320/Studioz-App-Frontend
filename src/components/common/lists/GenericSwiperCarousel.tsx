import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useTranslation } from 'react-i18next';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Item, Studio } from 'src/types/index';
import { Link } from 'react-router-dom';

type RenderItemFunction<T> = (item: T) => React.ReactNode;

interface GenericCarouselProps<T> {
  data: T[];
  className?: string;
  renderItem: RenderItemFunction<T>;
  title?: string;
  autoplay?: boolean;
  seeAllPath?: string;
}

export const GenericCarousel = <T,>({
  data,
  className,
  renderItem,
  title,
  autoplay = false,
  seeAllPath
}: GenericCarouselProps<T>) => {
  const swiperRef = useRef<SwiperType>();
  const { i18n, t } = useTranslation('common');
  const isRTL = i18n.dir() === 'rtl';

  const navigationButtons = [
    <button
      key="prev"
      className="next-slide-button swiper-button-prev button-prev custom-nav-btn"
      onClick={() => (isRTL ? swiperRef.current?.slideNext() : swiperRef.current?.slidePrev())}
      aria-label={isRTL ? 'Go to next slide' : 'Go to previous slide'}
    />,
    <button
      key="next"
      className="previous-slide-button swiper-button-next button-prev custom-nav-btn"
      onClick={() => (isRTL ? swiperRef.current?.slidePrev() : swiperRef.current?.slideNext())}
      aria-label={isRTL ? 'Go to previous slide' : 'Go to next slide'}
    />
  ];

  return (
    <section
      key={i18n.language}
      className="generic-carousel"
      tabIndex={0}
      aria-live="polite"
      onKeyDown={(e) => {
        autoplay && swiperRef.current?.autoplay?.stop();
        if (e.key === 'ArrowRight') {
          isRTL ? swiperRef.current?.slidePrev() : swiperRef.current?.slideNext();
        }
        if (e.key === 'ArrowLeft') {
          isRTL ? swiperRef.current?.slideNext() : swiperRef.current?.slidePrev();
        }
      }}
    >
      <div className="swiper-navigation-title-container">
        {title && <h2 className="generic-carousel-title">{title}</h2>}
        {seeAllPath && (
          <div className="see-all-container">
            <Link to={`/${i18n.language}${seeAllPath}`} className="see-all-link">
              {t('buttons.see_all')}
            </Link>
          </div>
        )}
        <div className="swiper-navigation">{isRTL ? navigationButtons.reverse() : navigationButtons}</div>
      </div>

      <div className="swiper_wrap">
        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          dir={isRTL ? 'rtl' : 'ltr'}
          className={`swiper ${className}`}
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={15}
          slidesPerView={'auto'}
          initialSlide={0}
          cssMode={true}
          touchStartPreventDefault={false}
          allowTouchMove={true}
          autoplay={autoplay ? { delay: 5000, disableOnInteraction: false } : false}
          pagination={{
            clickable: true
          }}
          navigation={false}
          breakpoints={{
            340: { slidesPerView: 1.4 },
            520: { slidesPerView: 2.2 },
            800: { slidesPerView: 2.4 },
            1000: { slidesPerView: 3.2 },
            1200: { slidesPerView: 4.2 },
            1550: { slidesPerView: 5.2 }
          }}
          a11y={{
            enabled: true,
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            firstSlideMessage: 'This is the first slide',
            lastSlideMessage: 'This is the last slide'
          }}
          onSlideChange={(swiper) => {
            const currentIndex = swiper.activeIndex;
            const slidesPerView = Math.floor(swiper.params.slidesPerView as number);

            swiper.slides.forEach((slide, index) => {
              const isVisible = index >= currentIndex && index < currentIndex + slidesPerView;
              slide.setAttribute('aria-hidden', (!isVisible).toString());

              const focusableElements = slide.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
              );
              focusableElements.forEach((element) => {
                (element as HTMLElement).tabIndex = isVisible ? 0 : -1;
              });
            });
          }}
        >
          {data?.map((item, index) => (
            <SwiperSlide key={(item as Studio | Item)._id || index} tabIndex={-1}>
              {renderItem(item)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
