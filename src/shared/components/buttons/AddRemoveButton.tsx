import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useTranslation } from 'react-i18next';
import './styles/_add-remove-button.scss';

interface AddRemoveButtonProps {
  variant?: 'add' | 'remove';
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  className?: string;
}

export const AddRemoveButton: React.FC<AddRemoveButtonProps> = ({
  variant = 'add',
  onClick,
  disabled = false,
  title,
  ariaLabel,
  className = ''
}) => {
  const { t } = useTranslation();

  const defaultTitle = variant === 'add' ? t('common.add', 'Add') : t('common.remove', 'Remove');
  const defaultAriaLabel = variant === 'add' ? t('common.add', 'Add') : t('common.remove', 'Remove');

  return (
    <button
      className={`add-remove-button add-remove-button--${variant} ${className}`}
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={title || defaultTitle}
      aria-label={ariaLabel || defaultAriaLabel}
    >
      {variant === 'add' ? <AddIcon /> : <RemoveIcon />}
    </button>
  );
};

