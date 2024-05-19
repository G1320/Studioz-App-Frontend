// StudiosCarousel.js
import React from 'react';
import Slider from 'react-slick';

const GenericCarousel = ({ data, className, renderItem, title }) => {
  const settings = {
    dots: true,
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
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 630,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="generic-carousel">
      {title && <h1>{title}</h1>}

      <Slider className={`slider ${className}`} {...settings}>
        {data?.map((item) => (
          <div key={item._id}>{renderItem(item)}</div>
        ))}
      </Slider>
    </section>
  );
};

export default GenericCarousel;
