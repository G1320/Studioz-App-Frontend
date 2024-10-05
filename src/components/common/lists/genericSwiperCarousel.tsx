import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

type RenderItemFunction<T> = (item: T) => React.ReactNode;

interface GenericCarouselProps<T> {
  data: T[];
  className?: string;
  renderItem: RenderItemFunction<T>;
  title?: string;
}

export const GenericCarousel = <T,>({ data, className, renderItem, title }: GenericCarouselProps<T>) => {
  const swiperRef = useRef<SwiperType>();

  return (
    <section className="generic-carousel">
      {title && <h1>{title}</h1>}
      
      <div className="swiper_wrap">
        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          className={`swiper ${className}`}
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={0}
          slidesPerView={'auto'}
          initialSlide={1}
          speed={550}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={false}
          breakpoints={{
            420: { slidesPerView: 1 },
            620: { slidesPerView: 2 },
            1030: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {data?.map((item, index) => (
            <SwiperSlide key={(item as any)._id || index}>
              {renderItem(item)}
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-navigation">
          <button className="swiper-button-prev custom-nav-btn" onClick={() => swiperRef.current?.slidePrev()}>
          </button>
          <button className="swiper-button-next custom-nav-btn" onClick={() => swiperRef.current?.slideNext()}>
          </button>
        </div>
      </div>
    </section>
  );
};