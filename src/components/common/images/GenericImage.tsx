interface GenericImageProps {
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
  width?: number;
  loading?: 'lazy' | 'eager';
}

export const GenericImage: React.FC<GenericImageProps> = ({
  src,
  alt,
  className,
  onClick,
  width = 800,
  loading = 'lazy'
}) => {
  const optimizedSrc = (width: number) => src.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);

  return (
    <img
      src={optimizedSrc(width)}
      srcSet={`
        ${optimizedSrc(400)} 400w,
        ${optimizedSrc(800)} 800w,
        ${optimizedSrc(1000)} 1000w,
        ${optimizedSrc(1200)} 1200w
      `}
      sizes="(max-width: 599px) 400px,
             (max-width: 899px) 600px,
             (max-width: 1199px) 1000px,
             1200px"
      alt={alt}
      loading={loading}
      className={className}
      onClick={onClick}
    />
  );
};
