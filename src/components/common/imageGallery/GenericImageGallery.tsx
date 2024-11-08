import { useState, useEffect } from 'react';
import { PropagateLoader } from 'react-spinners';

import { GenericList } from '@components/index';
import { useLocation } from 'react-router-dom';

interface GenericImageGalleryProps {
  isGalleryImagesShown?: boolean;
  className?: string;
  isCoverShown?: boolean;
  entity?: { name?: string } | null;
  coverImage?: string;
  galleryImages?: string[];
  onSetPreviewImage?: (image: string) => void;
}

export const GenericImageGallery: React.FC<GenericImageGalleryProps> = ({
  isGalleryImagesShown = false,
  isCoverShown = true,
  entity,
  coverImage,
  galleryImages,
  onSetPreviewImage
}) => {
  const combinedGalleryImages =
    coverImage && !galleryImages?.includes(coverImage) ? [coverImage, ...(galleryImages as string[])] : galleryImages;

  const [currCoverImage, setCurrCoverImage] = useState<string | undefined>(coverImage);
  const location = useLocation();

  const isStudioPath = /^\/studio($|\/)/.test(location.pathname);

  // const getOptimizedImageUrl = (src: string): string => {
  //   return src.replace('/upload/', '/upload/f_auto,q_auto,w_auto/');
  // };

  const getOptimizedImageUrl = (src: string, width: number): string => {
    return src.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
  };

  const handleImageChange = (image: string) => {
    setCurrCoverImage(image);
    if (onSetPreviewImage) onSetPreviewImage(image);
  };

  useEffect(() => {
    setCurrCoverImage(coverImage);
  }, [coverImage, galleryImages]);

  const renderItem = (image: string, index: number) => {
    if (!coverImage && isStudioPath) {
      return <PropagateLoader className="loader" speedMultiplier={1.25} color="#fcfcfc" size={24} />;
    }
    return (
      <img
        onClick={() => handleImageChange(image)}
        className="preview gallery-image"
        key={index}
        src={getOptimizedImageUrl(image, 800)} // Default width
        srcSet={`
       ${getOptimizedImageUrl(image, 400)} 400w,
       ${getOptimizedImageUrl(image, 800)} 800w,
       ${getOptimizedImageUrl(image, 1000)} 1000w,
       ${getOptimizedImageUrl(image, 1200)} 1200w
       `}
        sizes="(max-width: 599px) 400px, 
         (max-width: 899px) 600px, 
         (max-width: 1199px) 1000px, 
         1200px"
        alt={entity?.name}
        loading="lazy"
      />
    );
  };

  if (!coverImage && isStudioPath) {
    return <PropagateLoader className="loader" speedMultiplier={1.25} color="#fcfcfc" size={24} />;
  }

  return (
    <div className="file-gallery-container image-gallery-container">
      {isCoverShown && currCoverImage && (
        <img
          src={getOptimizedImageUrl(currCoverImage, 800)}
          srcSet={`
    ${getOptimizedImageUrl(currCoverImage, 400)} 400w,
    ${getOptimizedImageUrl(currCoverImage, 600)} 600w,
    ${getOptimizedImageUrl(currCoverImage, 800)} 800w,
    ${getOptimizedImageUrl(currCoverImage, 1000)} 1000w,
    ${getOptimizedImageUrl(currCoverImage, 1200)} 1200w
  `}
          sizes="(max-width: 599px) 600px, 
         (max-width: 899px) 900px, 
         (max-width: 1000px) 1000px, 
         (max-width: 1199px) 1200px, 
         1200px"
          alt="Cover"
          className="cover-image"
          loading="eager"
        />
      )}
      {isGalleryImagesShown && galleryImages && (
        <GenericList
          data={combinedGalleryImages || []}
          renderItem={renderItem}
          className="files-list gallery-images-list"
        />
      )}
    </div>
  );
};
