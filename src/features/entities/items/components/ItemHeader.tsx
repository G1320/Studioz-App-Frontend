import { GenericImage, SkeletonLoader } from '@shared/components';
import React from 'react';
import { Item, Studio, User } from 'src/types/index';
import { CloseIcon, ArrowBackIcon } from '@shared/components/icons';

interface ItemHeaderProps {
  studio?: Studio;
  item?: Item;
  user?: User;
  onEdit: (itemId: string) => void;
  onImageClick: () => void;
  onClose: () => void;
  showBackButton?: boolean;
}

export const ItemHeader = React.memo(({ item, studio, onImageClick, onClose, showBackButton = false }: ItemHeaderProps) => {
  if (!item) return null;

  // Use galleryImages[0] as cover image
  const coverImage = studio?.galleryImages?.[0];

  // Always render the image container to reserve space, even if studio data hasn't loaded yet
  return (
    <div className="image-container cover-image">
      {/* Close/Back button inside image */}
      <button className="close-button" onClick={onClose} aria-label={showBackButton ? 'Go back' : 'Close'}>
        {showBackButton ? <ArrowBackIcon /> : <CloseIcon />}
      </button>
      
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
