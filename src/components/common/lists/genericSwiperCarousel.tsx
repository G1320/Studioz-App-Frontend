import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Item, Studio } from '@/types/index';

type RenderItemFunction<T> = (item: T) => React.ReactNode;

interface GenericCarouselProps<T> {
  data: T[];
  className?: string;
  renderItem: RenderItemFunction<T>;
  title?: string;
  autoplay?: boolean;
}

export const GenericCarousel = <T,>({
  data,
  className,
  renderItem,
  title,
  autoplay = false
}: GenericCarouselProps<T>) => {
  const swiperRef = useRef<SwiperType>();

  return (
    <section className="generic-carousel">
      <div className="swiper-navigation-title-container">
        {title && <h1 className="generic-carousel-title">{title}</h1>}
        <div className="swiper-navigation">
          <button className="swiper-button-prev custom-nav-btn" onClick={() => swiperRef.current?.slidePrev()}></button>
          <button className="swiper-button-next custom-nav-btn" onClick={() => swiperRef.current?.slideNext()}></button>
        </div>
      </div>

      <div className="swiper_wrap">
        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          className={`swiper ${className}`}
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={15}
          slidesPerView={'auto'}
          initialSlide={0}
          cssMode={false}
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
        >
          {data?.map((item, index) => (
            <SwiperSlide key={(item as Studio | Item)._id || index}>{renderItem(item)}</SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
