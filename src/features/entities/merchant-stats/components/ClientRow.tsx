import React from 'react';
import { useTranslation } from 'react-i18next';
import { PersonOutlineIcon } from '@shared/components/icons';

interface ClientRowProps {
  name: string;
  role: string;
  totalSpent: number;
  lastVisit: string;
  avatarUrl?: string;
  onClick?: () => void;
}

export const ClientRow: React.FC<ClientRowProps> = ({ name, totalSpent, lastVisit, avatarUrl, onClick }) => {
  const { t } = useTranslation('merchantStats');

  return (
    <div className="client-row" onClick={onClick}>
      <div className="client-row__avatar">{avatarUrl ? <img src={avatarUrl} alt={name} /> : <PersonOutlineIcon />}</div>
      <div className="client-row__content">
        <div className="client-row__header">
          <h4 className="client-row__name">{name}</h4>
          <p className="client-row__spent">₪{totalSpent.toLocaleString()}</p>
        </div>
        <p className="client-row__visit" dir="rtl">
          {t('clients.lastVisit', 'ביקור אחרון')}: {lastVisit}
        </p>
      </div>
    </div>
  );
};
