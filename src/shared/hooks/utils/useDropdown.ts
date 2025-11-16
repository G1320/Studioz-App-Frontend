import { useEffect, useRef, useState, RefObject } from 'react';

interface UseDropdownReturn {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
  dropdownRef: RefObject<HTMLElement>;
  buttonRef: RefObject<HTMLElement>;
  containerRef: RefObject<HTMLElement>;
}

/**
 * Custom hook for managing dropdown/popup state and click-outside behavior
 * @returns Object containing dropdown state, refs, and control functions
 */
export const useDropdown = (): UseDropdownReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return {
    isOpen,
    setIsOpen,
    toggle,
    dropdownRef,
    buttonRef,
    containerRef
  };
};
