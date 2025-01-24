import { useState } from 'react';

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
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const optimizedSrc = (width: number) => src.replace('/upload/', `/upload/w_${width},f_auto,q_auto:best/`);

  return (
    <div className={`image-container ${className}`}>
      {isLoading && <div className="skeleton-loader" />}

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
        className={`generic-image ${className} ${isLoading ? 'loading' : 'loaded'}`}
        onClick={onClick}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};
