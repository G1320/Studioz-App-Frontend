import { useLayoutEffect, useRef } from 'react';

type ScrollSnapshot = {
  window: number;
  root: number;
  html: number;
};

/**
 * Lock document scroll while `locked` is true (menu, notifications, overlays).
 * Mirrors GenericModal: position fixed + restore scroll on unlock.
 */
export const useBodyScrollLock = (locked: boolean) => {
  const scrollPositionRef = useRef<ScrollSnapshot>({ window: 0, root: 0, html: 0 });

  useLayoutEffect(() => {
    if (!locked) return;

    const rootElement = document.getElementById('root');
    const scrollData: ScrollSnapshot = {
      window: window.scrollY || window.pageYOffset || 0,
      root: rootElement?.scrollTop || 0,
      html: document.documentElement.scrollTop || 0
    };
    scrollPositionRef.current = scrollData;

    const scrollY = scrollData.window || scrollData.html || scrollData.root;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    if (rootElement) {
      rootElement.style.overflow = 'hidden';
    }

    return () => {
      const savedScroll = scrollPositionRef.current;
      const root = document.getElementById('root');

      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';

      if (root) {
        root.style.overflow = '';
      }

      requestAnimationFrame(() => {
        if (savedScroll.window > 0) {
          window.scrollTo(0, savedScroll.window);
        }
        if (root && savedScroll.root > 0) {
          root.scrollTop = savedScroll.root;
        }
        if (savedScroll.html > 0) {
          document.documentElement.scrollTop = savedScroll.html;
        }
      });
    };
  }, [locked]);
};
