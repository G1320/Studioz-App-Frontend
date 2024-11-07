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

  const getOptimizedImageUrl = (src: string): string => {
    return src.replace('/upload/', '/upload/f_auto,q_auto,w_auto/');
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
        src={getOptimizedImageUrl(image)}
        alt={entity?.name}
      />
    );
  };

  if (!coverImage && isStudioPath) {
    return <PropagateLoader className="loader" speedMultiplier={1.25} color="#fcfcfc" size={24} />;
  }

  return (
    <div className="file-gallery-container image-gallery-container">
      {isCoverShown && currCoverImage && (
        <img src={getOptimizedImageUrl(currCoverImage)} alt="Cover" className="cover-image" />
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
