import { useState, useEffect } from 'react';
import { PropagateLoader } from 'react-spinners';

import { GenericList } from '@/components';
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
  onSetPreviewImage,
}) => {
  const [currCoverImage, setCurrCoverImage] = useState<string | undefined>(coverImage);
  const location = useLocation();

  const isStudioPath = /^\/studio($|\/)/.test(location.pathname);

  const handleImageChange = (image: string) => {
    setCurrCoverImage(image);
    if (onSetPreviewImage) onSetPreviewImage(image);
  };

  useEffect(() => {
    setCurrCoverImage(coverImage);
  }, [coverImage]);

  const renderItem = (image: string, index: number) =>  {
    if (!coverImage && isStudioPath  ) {
      return <PropagateLoader
      className="loader"
      speedMultiplier={1.25}
      color="#fcfcfc"
      size={24}
    />
    } return (
    <img
      onClick={() => handleImageChange(image)}
      className="preview gallery-image"
      key={index}
      src={image}
      alt={entity?.name}
    />
  )};

  if (!coverImage && isStudioPath) {
    return <PropagateLoader
    className="loader"
    speedMultiplier={1.25}
    color="#fcfcfc"
    size={24}
  />
  }

  return (
    <div className="file-gallery-container image-gallery-container">
      {isCoverShown && currCoverImage && (
        <img src={currCoverImage} alt="Cover" className="cover-image" />
      )}
      {isGalleryImagesShown && galleryImages && galleryImages.length > 0 && (
        <GenericList
          data={galleryImages}
          renderItem={renderItem}
          className="files-list gallery-images-list"
        />
      )}
    </div>
  );
};

