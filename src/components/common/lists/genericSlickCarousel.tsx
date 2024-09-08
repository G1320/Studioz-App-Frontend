import React from 'react';
import Slider from 'react-slick';

type RenderItemFunction<T> = (item: T) => React.ReactNode;

interface GenericCarouselProps<T> {
  data: T[];
  className?: string;
  renderItem: RenderItemFunction<T>;
  title?: string;
}

const GenericCarousel = <T,>({ data, className, renderItem, title }: GenericCarouselProps<T>) => {
  
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 550,
    slidesToShow: 4, 
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1030,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 620,
        settings: {
          centerMode: true,
          centerPadding: '40px',
          slidesToScroll: 1,
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 420,
        settings: {
          centerMode: false,
          slidesToShow: 1,
          
          },
      },
    ],
  };
  
  return (
    <section className="generic-carousel">
      {title && <h1>{title}</h1>}

      <Slider className={`slider ${className}`} {...settings}>
        {data?.map((item) => (
          <div key={(item as any)._id}>{renderItem(item)}</div>
        ))}
      </Slider>
    </section>
  );
};

export default GenericCarousel;
