import React, { useState, useEffect } from 'react';
import GenericList from '../lists/genericList';

interface GenericImageGalleryProps {
  isGalleryImagesShown?: boolean;
  className?: string;
  isCoverShown?: boolean;
  entity?: { name?: string } | null;
  coverImage?: string;
  galleryImages?: string[];
  onSetPreviewImage?: (image: string) => void;
}

const GenericImageGallery: React.FC<GenericImageGalleryProps> = ({
  isGalleryImagesShown = false,
  isCoverShown = true,
  entity,
  coverImage,
  galleryImages,
  onSetPreviewImage,
}) => {
  const [currCoverImage, setCurrCoverImage] = useState<string | undefined>(coverImage);

  const handleImageChange = (image: string) => {
    setCurrCoverImage(image);
    if (onSetPreviewImage) onSetPreviewImage(image);
  };

  useEffect(() => {
    setCurrCoverImage(coverImage);
  }, [coverImage]);

  const renderItem = (image: string, index: number) => (
    <img
      onClick={() => handleImageChange(image)}
      className="preview gallery-image"
      key={index}
      src={image}
      alt={entity?.name}
    />
  );

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

export default GenericImageGallery;
