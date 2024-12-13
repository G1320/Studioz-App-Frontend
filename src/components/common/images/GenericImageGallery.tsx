import { useState, useEffect } from 'react';
import { PropagateLoader } from 'react-spinners';
import { GenericImage } from './GenericImage';
import { GenericList } from '@components/index';

interface GenericImageGalleryProps {
  isGalleryImagesShown?: boolean;
  className?: string;
  isCoverShown?: boolean;
  entity?: { name?: string } | null;
  coverImage?: string;
  title?: string;
  subTitle?: string;
  galleryImages?: string[];
  onSetPreviewImage?: (image: string) => void;
}

export const GenericImageGallery: React.FC<GenericImageGalleryProps> = ({
  className = '',
  isGalleryImagesShown = false,
  isCoverShown = true,
  entity,
  coverImage,
  galleryImages,
  onSetPreviewImage,
  title,
  subTitle
}) => {
  const combinedGalleryImages =
    coverImage && !galleryImages?.includes(coverImage) ? [coverImage, ...(galleryImages || [])] : galleryImages || [];

  const [currCoverImage, setCurrCoverImage] = useState<string | undefined>(coverImage);

  const handleImageChange = (image: string) => {
    setCurrCoverImage(image);
    if (onSetPreviewImage) onSetPreviewImage(image);
  };

  useEffect(() => {
    setCurrCoverImage(coverImage);
  }, [coverImage, galleryImages]);

  const renderItem = (image: string, index: number) => {
    // const blurHash = 'LEHV6nWB2yk8pyo0adR*.7kCMdnj';

    return (
      <GenericImage
        key={index}
        src={image}
        // blurHash={blurHash}
        alt={entity?.name || `Gallery Image ${index + 1}`}
        className="preview gallery-image"
        onClick={() => handleImageChange(image)}
        width={800}
      />
    );
  };

  if (!coverImage) {
    return <PropagateLoader className="loader" speedMultiplier={1.25} color="#fcfcfc" size={24} />;
  }

  return (
    <div className={`file-gallery-container image-gallery-container ${className}`}>
      {isCoverShown && currCoverImage && (
        <GenericImage
          src={currCoverImage}
          blurHash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
          alt={`${entity?.name} cover image` || `Cover Image `}
          className="cover-image"
          width={800}
          loading="lazy"
          onClick={() => onSetPreviewImage?.(currCoverImage)}
        />
      )}
      <span className="title-container">
        {title && <h1 className="gallery-title">{title}</h1>}
        {subTitle && <h3 className="gallery-title">{subTitle}</h3>}
      </span>
      {isGalleryImagesShown && galleryImages && (
        <GenericList data={combinedGalleryImages} renderItem={renderItem} className="files-list gallery-images-list" />
      )}
    </div>
  );
};
