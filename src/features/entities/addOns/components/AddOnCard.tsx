import { AddOn } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import './styles/_addon-card.scss';

interface AddOnCardProps {
  addOn: AddOn;
  onEdit?: (addOn: AddOn) => void;
  onDelete?: (addOnId: string) => void;
  onAdd?: (addOn: AddOn) => void;
  showAddButton?: boolean;
}

export const AddOnCard = ({ addOn, onEdit, onDelete, onAdd, showAddButton }: AddOnCardProps) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const name = addOn.name?.[currentLanguage as 'en' | 'he'] || addOn.name?.en || 'Unnamed Add-On';
  const description = addOn.description?.[currentLanguage as 'en' | 'he'] || addOn.description?.en;
  const pricePerLabel = addOn.pricePer ? t(`common.items.price_per.${addOn.pricePer}`) : '';

  return (
    <div className={`addon-card ${!addOn.isActive ? 'inactive' : ''}`}>
      <div className="addon-card-content">
        {addOn.imageUrl && (
          <div className="addon-card-image">
            <img src={addOn.imageUrl} alt={name} />
          </div>
        )}
        <div className="addon-card-left">
          <h3 className="addon-card-name">{name}</h3>
          {description && <p className="addon-card-description">{description}</p>}
          {!addOn.isActive && <span className="addon-card-status inactive-badge">Inactive</span>}
        </div>
        <div className="addon-card-right">
          <div className="addon-card-price-container">
            <div className="addon-card-price">
              <span className="price-amount">{addOn.price}</span>
            </div>
            {pricePerLabel && (
              <div className="addon-card-price-per">
                <span className="price-per">{pricePerLabel}</span>
              </div>
            )}
          </div>
          {showAddButton && (
            <button
              className="btn-add"
              type="button"
              disabled={!onAdd}
              onClick={() => onAdd?.(addOn)}
              title={t('common.add', 'Add')}
              aria-label={t('common.add', 'Add')}
            >
              <AddIcon />
            </button>
          )}
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
    </div>
  );
};
