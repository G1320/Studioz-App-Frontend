import { useLayoutEffect, useEffect, useRef, useState, RefObject } from 'react';

const VIEWPORT_PADDING = 8;

export interface UseDropdownPositionOptions {
  /** Preferred placement relative to trigger */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  /** Gap between trigger and menu (px) */
  gap?: number;
  /** RTL: align to right edge of trigger */
  isRtl?: boolean;
}

const HIDDEN_STYLE: React.CSSProperties = {
  position: 'fixed',
  left: 0,
  top: 0,
  visibility: 'hidden',
  zIndex: 1000
};

/**
 * Computes viewport-aware position for a dropdown so it stays on-screen.
 * Use with position: fixed and the returned style; render the menu in a portal.
 */
export function useDropdownPosition(
  isOpen: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  options: UseDropdownPositionOptions = {}
): { menuRef: RefObject<HTMLDivElement>; menuStyle: React.CSSProperties } {
  const {
    placement = 'bottom-start',
    gap = 8,
    isRtl = typeof document !== 'undefined' && document.documentElement.getAttribute('dir') === 'rtl'
  } = options;
  const menuRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>(() => ({}));

  useEffect(() => {
    if (!isOpen) setReady(false);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !menuRef.current) {
      if (!isOpen) setMenuStyle({});
      return;
    }

    const trigger = triggerRef.current.getBoundingClientRect();
    const menu = menuRef.current;
    const width = menu.offsetWidth;
    const height = menu.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top: number;
    const spaceBelow = vh - trigger.bottom - VIEWPORT_PADDING;
    const spaceAbove = trigger.top - VIEWPORT_PADDING;
    if (spaceBelow >= height || spaceBelow >= spaceAbove) {
      top = trigger.bottom + gap;
    } else {
      top = trigger.top - height - gap;
    }

    let left: number;
    const alignStart = isRtl ? placement.includes('end') : placement.includes('start');
    if (alignStart) {
      left = isRtl ? trigger.right - width : trigger.left;
    } else {
      left = isRtl ? trigger.left : trigger.right - width;
    }

    left = Math.max(VIEWPORT_PADDING, Math.min(vw - width - VIEWPORT_PADDING, left));
    top = Math.max(VIEWPORT_PADDING, Math.min(vh - height - VIEWPORT_PADDING, top));

    const maxHeight = vh - top - VIEWPORT_PADDING;
    const style: React.CSSProperties = {
      position: 'fixed',
      left,
      top,
      zIndex: 1000,
      visibility: 'visible'
    };
    if (maxHeight < height) {
      style.maxHeight = maxHeight;
      style.overflowY = 'auto';
    }
    setMenuStyle(style);
    setReady(true);
  }, [isOpen, placement, gap, isRtl, triggerRef]);

  const resolvedStyle = !isOpen ? {} : ready ? menuStyle : HIDDEN_STYLE;
  return { menuRef, menuStyle: resolvedStyle };
}
