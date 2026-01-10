import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DeleteIcon from '@mui/icons-material/Delete';

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

  return (
    <div className="saved-cards">
      {/* Payment Method Toggle - Always show */}
      <div className="saved-cards__toggle">
        <button
          type="button"
          className={`saved-cards__toggle-btn ${paymentMethod === 'saved' ? 'saved-cards__toggle-btn--active' : ''}`}
          onClick={() => onPaymentMethodChange('saved')}
        >
          <AccountBalanceWalletIcon />
          {t('savedCards', 'כרטיסים שמורים')}
        </button>
        <button
          type="button"
          className={`saved-cards__toggle-btn ${paymentMethod === 'new' ? 'saved-cards__toggle-btn--active' : ''}`}
          onClick={() => onPaymentMethodChange('new')}
        >
          <AddIcon />
          {t('newCard', 'כרטיס חדש')}
        </button>
      </div>

      {/* Content based on selected method */}
      {paymentMethod === 'saved' ? (
        cards.length > 0 ? (
          <>
            {/* Card List */}
            <div className="saved-cards__list">
              {cards.map((card) => (
                <label
                  key={card.id}
                  className={`saved-cards__card ${selectedCardId === card.id ? 'saved-cards__card--selected' : ''}`}
                >
                  {/* Brand Badge */}
                  <div className="saved-cards__brand">
                    <span>{card.brand.toUpperCase()}</span>
                  </div>

                  {/* Card Details */}
                  <div className="saved-cards__details">
                    <span className="saved-cards__number">{card.last4} •••• •••• ••••</span>
                    <span className="saved-cards__expiry">
                      {t('expires', 'תוקף')} {card.expiryMonth}/{card.expiryYear}
                    </span>
                  </div>

                  {/* Radio Button */}
                  <input
                    type="radio"
                    name="saved_card"
                    className="saved-cards__radio"
                    checked={selectedCardId === card.id}
                    onChange={() => onSelectCard(card.id)}
                  />
                </label>
              ))}
            </div>

            {/* Remove Card Button */}
            {onRemoveCard && selectedCardId && (
              <button
                type="button"
                className="saved-cards__remove-btn"
                onClick={() => onRemoveCard(selectedCardId)}
              >
                <DeleteIcon />
                {t('removeSelectedCard', 'הסר כרטיס נבחר')}
              </button>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="saved-cards__empty">
            <AccountBalanceWalletIcon />
            <p>{t('noSavedCards', 'אין כרטיסים שמורים')}</p>
            <span>{t('noSavedCardsHint', 'הוסף כרטיס חדש כדי לשלם')}</span>
            <button
              type="button"
              className="saved-cards__add-btn"
              onClick={() => onPaymentMethodChange('new')}
            >
              <AddIcon />
              {t('addNewCard', 'הוסף כרטיס')}
            </button>
          </div>
        )
      ) : (
        /* New Card Form (passed as children) */
        <div className="saved-cards__new-card">{children}</div>
      )}
    </div>
  );
};

export default SavedCards;
