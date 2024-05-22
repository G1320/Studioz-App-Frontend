import React, { useState, useEffect } from 'react';
import GenericList from '../lists/genericList';

const GenericImageGallery = ({
  isGalleryImagesShown = false,
  isCoverShown = true,
  entity,
  coverImage,
  galleryImages,
  onSetPreviewImage,
}) => {
  const [currCoverImage, setCurrCoverImage] = useState(coverImage);

  const handleImageChange = (image) => {
    setCurrCoverImage(image);
    if (onSetPreviewImage) onSetPreviewImage(image);
  };

  useEffect(() => {
    setCurrCoverImage(coverImage);
  }, [coverImage]);

  const renderItem = (image, index) => (
    <img
      onClick={() => handleImageChange(image)}
      className="preview gallery-image "
      key={index}
      src={image}
      alt={entity?.name}
    />
  );

  return (
    <div className="image-gallery-container">
      {isCoverShown && currCoverImage && (
        <img src={currCoverImage} alt="Cover" className="cover-image " />
      )}
      {isGalleryImagesShown && galleryImages && galleryImages.length > 0 && (
        <GenericList data={galleryImages} renderItem={renderItem} className="gallery-images-list " />
      )}
    </div>
  );
};

export default GenericImageGallery;
