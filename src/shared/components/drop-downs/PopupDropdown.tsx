import React, { createContext, ReactNode, useContext } from 'react';
import { useDropdown } from '@shared/hooks/utils';
import './styles/popup-dropdown.scss';

// Context so any child can close the dropdown (e.g. NotificationItem on click)
const PopupDropdownContext = createContext<{ close: () => void }>({ close: () => {} });

/** Hook for children to close the nearest PopupDropdown */
export const usePopupDropdownClose = () => useContext(PopupDropdownContext).close;

interface PopupDropdownProps {
  trigger: ReactNode; // Button or icon to trigger the dropdown
  children: ReactNode; // Content to display in the dropdown
  className?: string;
  align?: 'left' | 'right' | 'center';
  anchor?: 'bottom-left' | 'bottom-right' | 'bottom-center'; // Where to anchor the dropdown to the button
  minWidth?: string;
  maxWidth?: string;
  width?: string;
}

/**
 * Reusable popup dropdown component that consolidates shared logic and styling
 * Used by AvailabilityDropdown, AddressDropdown, PhoneDropdown, NotificationBell, etc.
 */
export const PopupDropdown: React.FC<PopupDropdownProps> = ({
  trigger,
  children,
  className = '',
  align = 'left',
  anchor,
  minWidth = '200px',
  maxWidth = '400px',
  width = 'max-content'
}) => {
  const { isOpen, setIsOpen, toggle, dropdownRef, buttonRef, containerRef } = useDropdown();
  const close = () => setIsOpen(false);

  // Type assertions for refs
  const divDropdownRef = dropdownRef as React.RefObject<HTMLDivElement>;
  const divContainerRef = containerRef as React.RefObject<HTMLDivElement>;
  const btnRef = buttonRef as React.RefObject<HTMLElement>;

  // Determine anchor class - use anchor prop if provided, otherwise fall back to align
  const anchorClass = anchor 
    ? `popup-dropdown--anchor-${anchor}` 
    : `popup-dropdown--${align}`;

  // Clone trigger element to attach ref, onClick, and aria attributes
  const triggerWithProps = React.isValidElement(trigger)
    ? React.cloneElement(trigger as React.ReactElement<any>, {
        ref: btnRef,
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          toggle();
          // Call original onClick if it exists
          const originalOnClick = (trigger as React.ReactElement<any>).props?.onClick;
          if (originalOnClick && typeof originalOnClick === 'function') {
            originalOnClick(e);
          }
        },
        'aria-expanded': isOpen,
        'aria-haspopup': 'true',
        'aria-controls': isOpen ? `${className}-dropdown` : undefined
      })
    : (
        <div
          ref={btnRef as React.RefObject<HTMLDivElement>}
          onClick={toggle}
          style={{ display: 'inline-block' }}
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-controls={isOpen ? `${className}-dropdown` : undefined}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggle();
            }
          }}
        >
          {trigger}
        </div>
      );

  return (
    <div ref={divContainerRef} className={`popup-dropdown-container ${className}`}>
      {triggerWithProps}
      {isOpen && (
        <div
          ref={divDropdownRef}
          id={className ? `${className}-dropdown` : 'popup-dropdown-content'}
          className={`popup-dropdown ${anchorClass}`}
          style={{ minWidth, maxWidth, width }}
          onClick={(e) => e.stopPropagation()}
          role="menu"
        >
          <PopupDropdownContext.Provider value={{ close }}>
            {children}
          </PopupDropdownContext.Provider>
        </div>
      )}
    </div>
  );
};

