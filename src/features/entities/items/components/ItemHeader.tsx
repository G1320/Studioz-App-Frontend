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

  // Always render the image container to reserve space, even if studio data hasn't loaded yet
  return (
    <div className="image-container cover-image">
      {!studio?.coverImage && <SkeletonLoader />}
      {studio?.coverImage && (
        <GenericImage
          className="cover-image"
          src={studio.coverImage}
          alt={studio?.name?.en ? `${studio.name.en} cover image` : 'Studio cover image'}
          onClick={onImageClick}
          loading="eager"
        />
      )}
    </div>
  );
});

ItemHeader.displayName = 'ItemHeader';
