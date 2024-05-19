import React from 'react';

const Button = ({
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  style = {},
  icon,
  children,
}) => {
  const buttonStyle = { ...style, ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}) };

  return (
    <button
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

export default Button;
