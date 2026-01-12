import React from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

export interface SavedCard {
  id: string;
  last4: string;
  brand: 'visa' | 'mastercard' | 'amex';
  expiryMonth: string;
  expiryYear: string;
}

export interface SavedCardsProps {
  cards: SavedCard[];
  selectedCardId: string;
  onSelectCard: (cardId: string) => void;
  onRemoveCard?: (cardId: string) => void;
  paymentMethod: 'saved' | 'new';
  onPaymentMethodChange: (method: 'saved' | 'new') => void;
  children?: React.ReactNode; // For the new card form
}

export const SavedCards: React.FC<SavedCardsProps> = ({
  cards,
  selectedCardId,
  onSelectCard,
  onRemoveCard,
  paymentMethod,
  onPaymentMethodChange,
  children
}) => {
  const { t } = useTranslation('orders');

  // If adding new card, show the form (children)
  if (paymentMethod === 'new') {
    return <div className="saved-cards__new-card">{children}</div>;
  }

  return (
    <div className="saved-cards">
      {cards.length > 0 ? (
        <div className="saved-cards__list">
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              className={`saved-cards__card ${selectedCardId === card.id ? 'saved-cards__card--selected' : ''}`}
              onClick={() => onSelectCard(card.id)}
            >
              <div className="saved-cards__card-content">
                <div className="saved-cards__brand">
                  {card.brand === 'mastercard' && (
                    <div className="mastercard-circles">
                      <div className="circle red" />
                      <div className="circle yellow" />
                    </div>
                  )}
                  {card.brand === 'visa' && <span className="visa-text">VISA</span>}
                  {!['visa', 'mastercard'].includes(card.brand) && <CreditCardIcon />}
                </div>
                <div className="saved-cards__details">
                  <span className="saved-cards__number">•••• {card.last4}</span>
                  <span className="saved-cards__expiry">
                    {t('expires', 'תוקף')} {card.expiryMonth}/{card.expiryYear}
                  </span>
                </div>
              </div>

              <div className={`saved-cards__checkbox ${selectedCardId === card.id ? 'selected' : ''}`}>
                {selectedCardId === card.id && <CheckIcon />}
              </div>
              
              {/* Optional: Remove button functionality if needed in the list item */}
            </button>
          ))}

          <button
            type="button"
            className="saved-cards__add-btn-outline"
            onClick={() => onPaymentMethodChange('new')}
          >
            <AddIcon />
            {t('addNewCard', 'הוסף כרטיס חדש')}
          </button>
        </div>
      ) : (
        /* Empty State */
        <div className="saved-cards__empty">
          <CreditCardIcon className="saved-cards__empty-icon" />
          <p className="saved-cards__empty-title">{t('noSavedCards', 'אין כרטיסים שמורים')}</p>
          <span className="saved-cards__empty-subtitle">
            {t('noSavedCardsHint', 'הוסף את אמצעי התשלום הראשון שלך כדי להתחיל')}
          </span>
          <button
            type="button"
            className="saved-cards__add-btn-primary"
            onClick={() => onPaymentMethodChange('new')}
          >
            {t('addCard', 'הוסף כרטיס')} <AddIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedCards;
