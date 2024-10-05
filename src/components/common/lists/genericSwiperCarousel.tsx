import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

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
  return (
    <section className="generic-carousel">
      {title && <h1>{title}</h1>}

      <Swiper
        className={`swiper ${className}` }
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={4}
        initialSlide={1}
        speed={550}
        // loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        breakpoints={{
          320: {
            slidesPerView: 1,
            // spaceBetween: 10,
          },
          420: {
            slidesPerView: 1,
            // spaceBetween: 20,
          },
          620: {
            slidesPerView: 1,
            // spaceBetween: 20,
            centeredSlides: true,
          },
          850: {
            slidesPerView: 2,
            // spaceBetween: 30,
          },
          1030: {
            slidesPerView: 3,
            // spaceBetween: 30,
          },
          1200: {
            slidesPerView: 4,
            // spaceBetween: 40,
          },
        }}
      >
        {data?.map((item, index) => (
          <SwiperSlide key={(item as any)._id || index}>
            {renderItem(item)}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};