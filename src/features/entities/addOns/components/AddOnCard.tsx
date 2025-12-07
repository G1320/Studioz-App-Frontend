import { AddOn } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import './styles/_addon-card.scss';

interface AddOnCardProps {
  addOn: AddOn;
  onEdit?: (addOn: AddOn) => void;
  onDelete?: (addOnId: string) => void;
}

export const AddOnCard = ({ addOn, onEdit, onDelete }: AddOnCardProps) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const name = addOn.name?.[currentLanguage as 'en' | 'he'] || addOn.name?.en || 'Unnamed Add-On';
  const description = addOn.description?.[currentLanguage as 'en' | 'he'] || addOn.description?.en;
  const pricePerLabel = addOn.pricePer 
    ? t(`common.items.price_per.${addOn.pricePer}`)
    : '';

  return (
    <div className={`addon-card ${!addOn.isActive ? 'inactive' : ''}`}>
      <div className="addon-card-content">
        {addOn.imageUrl && (
          <div className="addon-card-image">
            <img src={addOn.imageUrl} alt={name} />
          </div>
        )}
        <div className="addon-card-info">
          <h3 className="addon-card-name">{name}</h3>
          {description && <p className="addon-card-description">{description}</p>}
          <div className="addon-card-price">
            <span className="price-amount">{addOn.price}</span>
            {pricePerLabel && <span className="price-per"> / {pricePerLabel}</span>}
          </div>
          {!addOn.isActive && (
            <span className="addon-card-status inactive-badge">Inactive</span>
          )}
        </div>
        {(onEdit || onDelete) && (
          <div className="addon-card-actions">
            {onEdit && (
              <button className="btn-edit" onClick={() => onEdit(addOn)}>
                {t('common.edit')}
              </button>
            )}
            {onDelete && (
              <button className="btn-delete" onClick={() => onDelete(addOn._id)}>
                {t('common.delete')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

