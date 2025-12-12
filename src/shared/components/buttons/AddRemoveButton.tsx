import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import './styles/_add-remove-button.scss';

interface AddRemoveButtonProps {
  variant?: 'add' | 'remove' | 'check';
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

  const getDefaultTitle = () => {
    if (variant === 'add') return t('common.add', 'Add');
    if (variant === 'remove') return t('common.remove', 'Remove');
    return t('common.selected', 'Selected');
  };

  const getDefaultAriaLabel = () => {
    if (variant === 'add') return t('common.add', 'Add');
    if (variant === 'remove') return t('common.remove', 'Remove');
    return t('common.selected', 'Selected');
  };

  const renderIcon = () => {
    if (variant === 'add') return <AddIcon />;
    if (variant === 'remove') return <RemoveIcon />;
    return <CheckIcon />;
  };

  return (
    <button
      className={`add-remove-button add-remove-button--${variant} ${className}`}
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={title || getDefaultTitle()}
      aria-label={ariaLabel || getDefaultAriaLabel()}
    >
      {renderIcon()}
    </button>
  );
};

