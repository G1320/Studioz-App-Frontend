import React, { ReactNode } from 'react';
import { useDropdown } from '@shared/hooks/utils';
import './styles/popup-dropdown.scss';

interface PopupDropdownProps {
  trigger: ReactNode; // Button or icon to trigger the dropdown
  children: ReactNode; // Content to display in the dropdown
  className?: string;
  align?: 'left' | 'right' | 'center';
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
  minWidth = '200px',
  maxWidth = '400px',
  width = 'max-content'
}) => {
  const { isOpen, toggle, dropdownRef, buttonRef, containerRef } = useDropdown();

  // Type assertions for refs
  const divDropdownRef = dropdownRef as React.RefObject<HTMLDivElement>;
  const divContainerRef = containerRef as React.RefObject<HTMLDivElement>;
  const btnRef = buttonRef as React.RefObject<HTMLElement>;

  // Clone trigger element to attach ref and onClick
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
        }
      })
    : (
        <div ref={btnRef as React.RefObject<HTMLDivElement>} onClick={toggle} style={{ display: 'inline-block' }}>
          {trigger}
        </div>
      );

  return (
    <div ref={divContainerRef} className={`popup-dropdown-container ${className}`}>
      {triggerWithProps}
      {isOpen && (
        <div
          ref={divDropdownRef}
          className={`popup-dropdown popup-dropdown--${align}`}
          style={{ minWidth, maxWidth, width }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  );
};

