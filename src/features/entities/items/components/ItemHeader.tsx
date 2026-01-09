import { GenericImage, SkeletonLoader } from '@shared/components';
import React from 'react';
import { Item, Studio, User } from 'src/types/index';
interface ItemHeaderProps {
  studio?: Studio;
  item?: Item;
  user?: User;
  onEdit: (itemId: string) => void;
  onImageClick: () => void;
}

export const ItemHeader = React.memo(({ item, studio, onImageClick }: ItemHeaderProps) => {
  if (!item) return null;

  // Use galleryImages[0] as cover image
  const coverImage = studio?.galleryImages?.[0];

  // Always render the image container to reserve space, even if studio data hasn't loaded yet
  return (
    <div className="image-container cover-image">
      {!coverImage && <SkeletonLoader />}
      {coverImage && (
        <GenericImage
          className="cover-image"
          src={coverImage}
          alt={studio?.name?.en ? `${studio.name.en} cover image` : 'Studio cover image'}
          onClick={onImageClick}
          loading="eager"
        />
      )}
    </div>
  );
});

ItemHeader.displayName = 'ItemHeader';
