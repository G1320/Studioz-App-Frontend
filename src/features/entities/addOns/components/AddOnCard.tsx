import { AddOn } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import { AddRemoveButton } from '@shared/components';
import './styles/_addon-card.scss';

interface AddOnCardProps {
  addOn: AddOn;
  onEdit?: (addOn: AddOn) => void;
  onDelete?: (addOnId: string) => void;
  onAdd?: (addOn: AddOn) => void;
  showAddButton?: boolean;
  isSelected?: boolean;
}

export const AddOnCard = ({ addOn, onEdit, onDelete, onAdd, showAddButton, isSelected = false }: AddOnCardProps) => {
  const { t, i18n } = useTranslation();
  const { t: tForms } = useTranslation('forms');
  const currentLanguage = i18n.language;
  const name = addOn.name?.[currentLanguage as 'en' | 'he'] || addOn.name?.en || 'Unnamed Add-On';
  const description = addOn.description?.[currentLanguage as 'en' | 'he'] || addOn.description?.en;

  const getTranslatedPricePer = (pricePer: string) => {
    const pricePerMap: Record<string, string> = {
      flat: tForms('forms:form.addOn.pricePer.flat'),
      hour: tForms('forms:form.addOn.pricePer.hour'),
      day: tForms('forms:form.addOn.pricePer.day')
    };

    return pricePerMap[pricePer] || pricePer;
  };

  const pricePerLabel = addOn.pricePer ? getTranslatedPricePer(addOn.pricePer) : '';

  return (
    <div className={`addon-card ${!addOn.isActive ? 'inactive' : ''} ${isSelected ? 'selected' : ''}`}>
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
          <div className="addon-card-price-button-row">
            <div className="addon-card-price">
              ₪{addOn.price}
              {pricePerLabel && `/${pricePerLabel}`}
            </div>
            {showAddButton && (
              <AddRemoveButton
                variant={isSelected ? 'check' : 'add'}
                disabled={!onAdd}
                onClick={() => onAdd?.(addOn)}
              />
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
    </div>
  );
};
