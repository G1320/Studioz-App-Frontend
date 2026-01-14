import React from 'react';
// import { useTranslation } from 'react-i18next';
import { FlashIcon } from '@shared/components/icons';
import './styles/_instant-book-badge.scss';

interface InstantBookBadgeProps {
  instantBook?: boolean;
  className?: string;
}

export const InstantBookBadge: React.FC<InstantBookBadgeProps> = ({ instantBook, className = '' }) => {
  //   const { t } = useTranslation('forms');

  if (!instantBook) {
    return null;
  }

  return (
    <div className={`instant-book-badge ${className}`}>
      <FlashIcon className="instant-book-badge__icon" aria-hidden="true" />
      {/* <span className="instant-book-badge__label">{t('form.instantBook.label', 'Instant Book')}</span> */}
    </div>
  );
};
