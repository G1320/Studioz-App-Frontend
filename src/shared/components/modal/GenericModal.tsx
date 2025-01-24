import { Modal } from '@mui/material';

interface GenericModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const GenericModal: React.FC<GenericModalProps> = ({ open, onClose, children, className = '' }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className={`generic-modal ${className}`}
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
