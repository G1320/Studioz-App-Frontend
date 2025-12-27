import { FanMenu, FanMenuButton } from '@shared/components';
import { Studio, User, Wishlist } from 'src/types/index';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import LockClockIcon from '@mui/icons-material/LockClock';
import { StudioBlockModal } from './StudioBlockTimeSlotModal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface StudioOptionsProps {
  studio: Studio;
  user: User;
  wishlists: Wishlist[];
  nextStudioId?: string;
  prevStudioId?: string;
  onEdit: (studioId: string) => void;
  onAddNewService: (studioId: string) => void;
}

export const StudioOptions: React.FC<StudioOptionsProps> = ({ studio, user, onEdit, onAddNewService }) => {
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const { t } = useTranslation('studio');

  if (!studio || user?._id !== studio?.createdBy) {
    return null;
  }

  const fanMenuButtons: FanMenuButton[] = [
    {
      icon: <LockClockIcon />,
      label: t('block_time_slot'),
      onClick: () => setIsBlockModalOpen(true),
      className: 'block-button'
    },
    {
      icon: <LibraryAddIcon />,
      label: t('add_service'),
      onClick: () => onAddNewService(studio?._id || ''),
      className: 'add-button'
    },
    {
      icon: <EditNoteIcon />,
      label: t('edit_studio'),
      onClick: () => onEdit(studio?._id || ''),
      className: 'edit-button'
    }
  ];

  return (
    <section className="studio-details-options-container">
      <div className="details-buttons studio-details-buttons">
        <FanMenu buttons={fanMenuButtons} />
        <StudioBlockModal
          studioId={studio?._id}
          studioAvailability={studio?.studioAvailability}
          open={isBlockModalOpen}
          onClose={() => setIsBlockModalOpen(false)}
        />
      </div>
    </section>
  );
};
