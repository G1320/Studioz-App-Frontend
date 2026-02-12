import './styles/_index.scss';
import { CSSProperties, ReactNode } from 'react';

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties;
  icon?: ReactNode;
  children: ReactNode;
  'aria-label'?: string;
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  onMouseEnter,
  disabled = false,
  className = '',
  type = 'button',
  style = {},
  icon,
  children,
  'aria-label': ariaLabelProp,
  ariaLabel
}) => {
  const buttonStyle: CSSProperties = {
    ...style,
    ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {})
  };

  const ariaLabelValue = ariaLabel || ariaLabelProp;

  return (
    <button
      onMouseEnter={onMouseEnter}
      className={`button ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={buttonStyle}
      aria-label={ariaLabelValue}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
};
