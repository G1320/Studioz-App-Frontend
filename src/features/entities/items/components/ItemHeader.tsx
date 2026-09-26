import { GenericImage, SkeletonLoader } from '@shared/components';
import React from 'react';
import { useTranslation } from 'react-i18next';
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

export const ItemHeader = React.memo(
  ({ item, studio, onImageClick, onClose, showBackButton = false }: ItemHeaderProps) => {
    const { t, i18n } = useTranslation('common');
    if (!item) return null;

    const coverImage = studio?.galleryImages?.[0];
    const lang = i18n.language === 'he' ? 'he' : 'en';
    const studioName = studio?.name?.[lang] || studio?.name?.en || studio?.name?.he || '';

    return (
      <div className="image-container cover-image">
        <button
          className="close-button"
          onClick={onClose}
          aria-label={showBackButton ? t('a11y.goBack') : t('a11y.close')}
        >
          {showBackButton ? <ArrowBackIcon /> : <CloseIcon />}
        </button>

        {!coverImage && <SkeletonLoader />}
        {coverImage && (
          <GenericImage
            className="cover-image"
            src={coverImage}
            alt={studioName}
            onClick={onImageClick}
            loading="eager"
          />
        )}
      </div>
    );
  }
);

ItemHeader.displayName = 'ItemHeader';
