import React, { useRef, useEffect, useState } from 'react';
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
  breakpoints?: Record<number, { slidesPerView: number }>;
  showNavigation?: boolean;
  selectedIndex?: number;
}

export const GenericCarousel = <T,>({
  data,
  className,
  renderItem,
  title,
  autoplay = false,
  seeAllPath,
  breakpoints = {
    340: { slidesPerView: 1.4 },
    520: { slidesPerView: 2.2 },
    800: { slidesPerView: 2.4 },
    1000: { slidesPerView: 3.2 },
    1200: { slidesPerView: 4.2 },
    1550: { slidesPerView: 5.2 }
  },
  showNavigation = true,
  selectedIndex
}: GenericCarouselProps<T>) => {
  const swiperRef = useRef<SwiperType>();
  const { i18n, t } = useTranslation('common');
  const isRTL = i18n.dir() === 'rtl';
  const [shouldShowNavigation, setShouldShowNavigation] = useState(true);

  // Check if carousel needs navigation (if all items fit on screen, hide buttons)
  const checkIfNavigationNeeded = React.useCallback(
    (swiper: SwiperType | undefined) => {
      if (data.length === 0) {
        setShouldShowNavigation(false);
        return;
      }

      if (!swiper || !swiper.wrapperEl || !swiper.slides || swiper.slides.length === 0) {
        // If swiper not ready, calculate based on breakpoints
        const currentWidth = window.innerWidth;
        let slidesPerView = 1.4; // default from breakpoints

        // Find the appropriate breakpoint
        const sortedBreakpoints = Object.keys(breakpoints)
          .map(Number)
          .sort((a, b) => a - b);

        for (let i = sortedBreakpoints.length - 1; i >= 0; i--) {
          if (currentWidth >= sortedBreakpoints[i]) {
            slidesPerView = breakpoints[sortedBreakpoints[i]].slidesPerView;
            break;
          }
        }

        const totalSlides = data.length;
        const needsNavigation = totalSlides > Math.ceil(slidesPerView);
        setShouldShowNavigation(needsNavigation);
        return;
      }

      // Check if scrolling is actually possible by comparing wrapper width to content width
      // Add a small buffer (5px) to account for rounding and spacing
      const wrapperWidth = swiper.width;
      const wrapperScrollWidth = swiper.wrapperEl.scrollWidth;
      const canScroll = wrapperScrollWidth > wrapperWidth + 5;

      setShouldShowNavigation(canScroll);
    },
    [data.length, breakpoints]
  );

  // Check navigation on mount and resize
  useEffect(() => {
    const handleResize = () => {
      checkIfNavigationNeeded(swiperRef.current);
    };

    // Initial check after a small delay to ensure Swiper is initialized
    const timer = setTimeout(() => {
      checkIfNavigationNeeded(swiperRef.current);
    }, 100);

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [data.length, breakpoints]);

  // Re-check when Swiper is initialized
  useEffect(() => {
    if (swiperRef.current) {
      const timer = setTimeout(() => {
        checkIfNavigationNeeded(swiperRef.current);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [swiperRef.current]);

  // Center selected index when carousel is ready (only if not already centered)
  useEffect(() => {
    if (selectedIndex !== undefined && selectedIndex >= 0 && selectedIndex < data.length && swiperRef.current) {
      // Small delay to ensure Swiper is fully initialized and rendered
      const timer = setTimeout(() => {
        if (swiperRef.current && selectedIndex >= 0 && selectedIndex < data.length) {
          const swiper = swiperRef.current;
          const slide = swiper.slides[selectedIndex];

          if (!slide || !swiper.wrapperEl) return;

          const slideLeft = slide.offsetLeft;
          const slideWidth = slide.offsetWidth;
          const slideCenter = slideLeft + slideWidth / 2;
          const containerWidth = swiper.width;
          const currentScrollLeft = swiper.wrapperEl.scrollLeft;

          // Calculate the scroll position needed to center the slide
          const targetScrollLeft = slideCenter - containerWidth / 2;

          // Calculate the difference between current and target scroll position
          const scrollDifference = Math.abs(currentScrollLeft - targetScrollLeft);

          // Threshold: consider it centered if within 20px of center
          const centerThreshold = 20;

          // Only scroll to center if the slide is not already centered
          if (scrollDifference > centerThreshold) {
            // Smooth scroll to center the slide
            swiper.wrapperEl.scrollTo({
              left: targetScrollLeft,
              behavior: 'smooth'
            });
          }
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedIndex, i18n.language, data.length]);

  const navigationButtons = [
    <button
      key="prev"
      className="next-slide-button swiper-button-prev button-prev custom-nav-btn"
      onClick={() => {
        autoplay && swiperRef.current?.autoplay?.stop();
        isRTL ? swiperRef.current?.slideNext() : swiperRef.current?.slidePrev();
      }}
      aria-label={isRTL ? 'Go to next slide' : 'Go to previous slide'}
    />,
    <button
      key="next"
      className="previous-slide-button swiper-button-next button-prev custom-nav-btn"
      onClick={() => {
        autoplay && swiperRef.current?.autoplay?.stop();
        isRTL ? swiperRef.current?.slidePrev() : swiperRef.current?.slideNext();
      }}
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
        {showNavigation && shouldShowNavigation && (
          <div className="swiper-navigation">{isRTL ? navigationButtons.reverse() : navigationButtons}</div>
        )}
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
          initialSlide={selectedIndex !== undefined && selectedIndex >= 0 ? selectedIndex : 0}
          cssMode={true}
          touchStartPreventDefault={false}
          allowTouchMove={true}
          autoplay={
            autoplay
              ? {
                  delay: 5000,
                  disableOnInteraction: true,
                  pauseOnMouseEnter: true
                }
              : false
          }
          pagination={{
            clickable: true
          }}
          navigation={false}
          breakpoints={breakpoints}
          onTouchStart={() => {
            autoplay && swiperRef.current?.autoplay?.stop();
          }}
          a11y={{
            enabled: true,
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            firstSlideMessage: 'This is the first slide',
            lastSlideMessage: 'This is the last slide'
          }}
          onProgress={(swiper) => {
            // Update navigation visibility when swiper updates
            checkIfNavigationNeeded(swiper);

            swiper.slides.forEach((slide, index) => {
              // Check if this is the last slide
              const isLastSlide = index === swiper.slides.length - 1;

              if (!isLastSlide) {
                // Only apply dimming logic if it's not the last slide
                const slideLeft = slide.offsetLeft;
                const slideRight = slideLeft + slide.offsetWidth;
                const containerLeft = swiper.wrapperEl.scrollLeft;
                const containerRight = containerLeft + swiper.width;

                const isPartiallyVisible = isRTL
                  ? slideRight > containerLeft && slideLeft < containerLeft
                  : slideLeft < containerRight && slideRight > containerRight;

                if (isPartiallyVisible) {
                  slide.classList.add('dimmed');
                } else {
                  slide.classList.remove('dimmed');
                }
              } else {
                // Make sure the last slide is never dimmed
                slide.classList.remove('dimmed');
              }
            });
          }}
          onResize={(swiper) => {
            checkIfNavigationNeeded(swiper);
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
