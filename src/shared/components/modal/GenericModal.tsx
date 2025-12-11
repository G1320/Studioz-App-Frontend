import { Modal } from '@mui/material';
import { useEffect } from 'react';

interface GenericModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const GenericModal: React.FC<GenericModalProps> = ({ open, onClose, children, className = '' }) => {
  useEffect(() => {
    if (open) {
      // Store current scroll position
      const scrollY = window.scrollY;

      // Prevent background scroll when modal is open
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore scroll position when modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
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
      disableScrollLock={false}
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
