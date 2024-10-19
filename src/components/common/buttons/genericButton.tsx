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
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  onMouseEnter,
  disabled = false,
  className = '',
  type = 'button',
  style = {},
  icon,
  children
}) => {
  const buttonStyle: CSSProperties = {
    ...style,
    ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {})
  };

  return (
    <button
      onMouseEnter={onMouseEnter}
      className={`button ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={buttonStyle}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
};
