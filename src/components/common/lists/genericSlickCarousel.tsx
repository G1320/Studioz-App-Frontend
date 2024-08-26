
// import React from 'react';
// import Slider from 'react-slick';

// interface CarouselItem {
//   _id: string;
// }

// type RenderItemFunction = (item: CarouselItem) => React.ReactNode;

// interface GenericCarouselProps {
//   data: CarouselItem[];
//   className?: string;
//   renderItem: RenderItemFunction;
//   title?: string;
// }

// const GenericCarousel: React.FC<GenericCarouselProps> = ({ data, className, renderItem, title }) => {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 550,
//     slidesToShow: 4,
//     slidesToScroll: 2,
//     autoplay: true,
//     autoplaySpeed: 5000,
//     pauseOnHover: true,
//     responsive: [
//       {
//         breakpoint: 1030,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 2,
//         },
//       },
//       {
//         breakpoint: 800,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 2,
//           initialSlide: 2,
//         },
//       },
//       {
//         breakpoint: 630,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//         },
//       },
//     ],
//   };

//   return (
//     <section className="generic-carousel">
//       {title && <h1>{title}</h1>}

//       <Slider className={`slider ${className}`} {...settings}>
//         {data?.map((item) => (
//           <div key={item._id}>{renderItem(item)}</div>
//         ))}
//       </Slider>
//     </section>
//   );
// };

// export default GenericCarousel;
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
          <div key={(item as any)._id}>{renderItem(item)}</div>
        ))}
      </Slider>
    </section>
  );
};

export default GenericCarousel;
