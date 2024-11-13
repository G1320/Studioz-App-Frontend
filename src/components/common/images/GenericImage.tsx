// import React, { useEffect, useState } from 'react';
// import { Blurhash } from 'react-blurhash';

interface GenericImageProps {
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
  width?: number;
  loading?: 'lazy' | 'eager';
  blurHash?: string;
}

export const GenericImage: React.FC<GenericImageProps> = ({
  src,
  alt,
  className,
  onClick,
  width = 800,
  loading = 'lazy'
  // blurHash
}) => {
  // const [isLoaded, setIsLoaded] = useState(false);

  // useEffect(() => {
  //   const img = new Image();
  //   img.onload = () => setIsLoaded(true);
  //   img.src = src;

  //   return () => {
  //     img.onload = null;
  //   };
  // }, [src]);

  const optimizedSrc = (width: number) => src.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
  // const containerClass = loading === 'eager' ? 'cover-image-container' : 'gallery-image-container';

  return (
    <>
      {/* {blurHash && !isLoaded && (
        <Blurhash
          hash={blurHash}
          width="100%"
          height="min-content"
          resolutionX={32}
          resolutionY={32}
          punch={1}
          className={className}
        />
      )} */}
      <img
        src={optimizedSrc(width)}
        srcSet={`
          ${optimizedSrc(400)} 400w,
          ${optimizedSrc(800)} 800w,
          ${optimizedSrc(1000)} 1000w,
          ${optimizedSrc(1200)} 1200w
        `}
        sizes="(max-width: 599px) 600px,
               (max-width: 899px) 900px,
               (max-width: 1199px) 1200px,
               1200px"
        alt={alt}
        loading={loading}
        // onLoad={() => setIsLoaded(true)}
        className={className}
        onClick={onClick}
        // style={{ display: isLoaded ? 'block' : 'none' }}
      />
    </>
  );
};
