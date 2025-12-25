import { Modal } from '@mui/material';
import { useLayoutEffect, useRef, useEffect, useId } from 'react';

interface GenericModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  /** Optional title ID for aria-labelledby. If not provided, will search for h1-h6 in children */
  titleId?: string;
  /** Optional description ID for aria-describedby */
  descriptionId?: string;
  /** Optional aria-label if title cannot be determined */
  ariaLabel?: string;
}

export const GenericModal: React.FC<GenericModalProps> = ({
  open,
  onClose,
  children,
  className = '',
  titleId,
  descriptionId,
  ariaLabel
}) => {
  const scrollPositionRef = useRef<{ window: number; root: number; html: number }>({ window: 0, root: 0, html: 0 });
  const modalContentRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const modalId = useId();
  const defaultTitleId = `${modalId}-title`;

  // Find title element in children for aria-labelledby and set ID if needed
  useEffect(() => {
    if (open && !titleId && !ariaLabel && modalContentRef.current) {
      // Search for heading elements (h1-h6) in the modal content
      const heading = modalContentRef.current.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading && !heading.id) {
        heading.id = defaultTitleId;
      }
    }
  }, [open, titleId, ariaLabel, defaultTitleId]);

  // Focus management: store previous active element
  // Note: MUI Modal handles focus restoration with disableRestoreFocus={false},
  // but we store it as a backup
  useEffect(() => {
    if (open) {
      // Store the element that had focus before modal opened
      previousActiveElementRef.current = document.activeElement as HTMLElement;
    }
  }, [open]);

  useLayoutEffect(() => {
    if (open) {
      // Store current scroll position from all possible scroll containers
      // BEFORE any DOM changes to prevent scroll jump
      const rootElement = document.getElementById('root');
      const headerElement = document.querySelector('header.app-header');
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

      // Store original header position if it exists
      if (headerElement) {
        const headerRect = headerElement.getBoundingClientRect();
        (headerElement as HTMLElement).style.position = 'fixed';
        (headerElement as HTMLElement).style.top = `${headerRect.top}px`;
        (headerElement as HTMLElement).style.left = `${headerRect.left}px`;
        (headerElement as HTMLElement).style.right = `${headerRect.right}px`;
        (headerElement as HTMLElement).style.width = `${headerRect.width}px`;
        (headerElement as HTMLElement).style.zIndex = '1400';
      }

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
        const headerElement = document.querySelector('header.app-header');

        // Restore header to sticky positioning
        if (headerElement) {
          (headerElement as HTMLElement).style.position = '';
          (headerElement as HTMLElement).style.top = '';
          (headerElement as HTMLElement).style.left = '';
          (headerElement as HTMLElement).style.right = '';
          (headerElement as HTMLElement).style.width = '';
          (headerElement as HTMLElement).style.zIndex = '';
        }

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

  // Determine aria-labelledby: use provided titleId, or search for heading, or use default
  const getAriaLabelledBy = () => {
    if (titleId) return titleId;
    if (ariaLabel) return undefined; // If aria-label is provided, don't use aria-labelledby
    if (open && modalContentRef.current) {
      const heading = modalContentRef.current.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading?.id) return heading.id;
    }
    return defaultTitleId;
  };

  const ariaLabelledBy = getAriaLabelledBy();

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={`generic-modal ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={descriptionId || undefined}
      aria-label={ariaLabel || undefined}
      disableAutoFocus={false}
      disableEnforceFocus={false}
      disableRestoreFocus={false}
      disableScrollLock={true}
      slotProps={{
        backdrop: {
          timeout: 500,
          'aria-hidden': 'true'
        }
      }}
    >
      <div className="modal-wrapper" ref={modalContentRef}>
        <div className="modal-content">{children}</div>
      </div>
    </Modal>
  );
};
