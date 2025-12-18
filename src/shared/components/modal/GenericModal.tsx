import { Modal } from '@mui/material';
import { useLayoutEffect, useRef } from 'react';

interface GenericModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const GenericModal: React.FC<GenericModalProps> = ({ open, onClose, children, className = '' }) => {
  const scrollPositionRef = useRef<{ window: number; root: number; html: number }>({ window: 0, root: 0, html: 0 });

  useLayoutEffect(() => {
    if (open) {
      // Store current scroll position from all possible scroll containers
      // BEFORE any DOM changes to prevent scroll jump
      const rootElement = document.getElementById('root');
      const scrollData = {
        window: window.scrollY || window.pageYOffset || 0,
        root: rootElement?.scrollTop || 0,
        html: document.documentElement.scrollTop || 0
      };
      scrollPositionRef.current = scrollData;

      // Prevent background scroll when modal is open
      // Apply styles synchronously before paint to prevent visual jump
      // Use the window scroll position for body positioning
      const scrollY = scrollData.window || scrollData.html || scrollData.root;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      // Also lock scroll on root element if it exists and is scrollable
      if (rootElement) {
        rootElement.style.overflow = 'hidden';
      }

      return () => {
        // Restore scroll position when modal closes
        const savedScroll = scrollPositionRef.current;
        const rootElement = document.getElementById('root');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';

        // Restore root element overflow
        if (rootElement) {
          rootElement.style.overflow = '';
        }

        // Restore scroll position after styles are cleared
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
          // Restore scroll on the element that was actually scrolling
          if (savedScroll.window > 0) {
            window.scrollTo(0, savedScroll.window);
          }
          if (rootElement && savedScroll.root > 0) {
            rootElement.scrollTop = savedScroll.root;
          }
          if (savedScroll.html > 0) {
            document.documentElement.scrollTop = savedScroll.html;
          }
        });
      };
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={`generic-modal ${className}`}
      disableAutoFocus={false}
      disableEnforceFocus={false}
      disableScrollLock={true}
      slotProps={{
        backdrop: {
          timeout: 500
        }
      }}
    >
      <div className="modal-wrapper">
        <div className="modal-content">{children}</div>
      </div>
    </Modal>
  );
};
