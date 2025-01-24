import React from 'react';
import { GenericImage } from '@shared/components';
import ItemOptions from './ItemOptions';
import { Item, Studio, User } from 'src/types/index';
import { useTranslation } from 'react-i18next';

interface ItemHeaderProps {
  studio?: Studio;
  item?: Item;
  user?: User;
  onEdit: (itemId: string) => void;
  onImageClick: () => void;
}

const getTranslatedPricePer = (pricePer: string) => {
  const { t } = useTranslation('forms');
  const pricePerMap: Record<string, string> = {
    hour: t('forms:form.pricePer.hour'),
    session: t('forms:form.pricePer.session'),
    unit: t('forms:form.pricePer.unit'),
    song: t('forms:form.pricePer.song')
  };

  return pricePerMap[pricePer] || pricePer;
};

export const ItemHeader = React.memo(({ studio, item, user, onEdit, onImageClick }: ItemHeaderProps) => {
  if (!item) return null;

  return (
    <>
      {studio && <GenericImage className="cover-image" src={studio.coverImage} onClick={onImageClick} />}
      <div>
        <h3>{item.studioName.en}</h3>
        <ItemOptions item={item} user={user as User} onEdit={onEdit} />
      </div>
      <div className="item-info-container">
        <h3>{item.name.en}</h3>
        <small className="item-price">
          ₪{item.price}/{getTranslatedPricePer(item.pricePer || '')}
        </small>
      </div>
      <p>{item.description.en}</p>
    </>
  );
});
