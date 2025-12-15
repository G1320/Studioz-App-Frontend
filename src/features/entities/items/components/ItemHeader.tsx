import { GenericImage } from '@shared/components';
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

  return <>{studio && <GenericImage className="cover-image" src={studio.coverImage} onClick={onImageClick} />}</>;
});

ItemHeader.displayName = 'ItemHeader';
