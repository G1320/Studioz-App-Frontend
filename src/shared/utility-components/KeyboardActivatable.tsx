import { KeyboardEvent, ReactNode } from 'react';

interface KeyboardActivatableProps {
  onActivate: () => void;
  children: ReactNode;
  className?: string;
  ariaLabel: string;
  disabled?: boolean;
}

/**
 * Makes a non-button element keyboard-accessible (Enter / Space).
 * Use for card wrappers and other clickable containers.
 */
export const KeyboardActivatable = ({
  onActivate,
  children,
  className,
  ariaLabel,
  disabled = false
}: KeyboardActivatableProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      className={className}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onActivate}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};
