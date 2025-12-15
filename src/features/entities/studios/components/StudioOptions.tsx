import { Button } from '@shared/components';
import { Studio, User, Wishlist } from 'src/types/index';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { StudioBlockModal } from './StudioBlockTimeSlotModal';

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
  return (
    <section className="studio-details-options-container">
      <div className="details-buttons studio-details-buttons">
        {studio && user?._id === studio?.createdBy && (
          <>
            <StudioBlockModal studioId={studio?._id} studioAvailability={studio?.studioAvailability} />
            <Button className="add-button" onClick={() => onAddNewService(studio?._id || '')}>
              <LibraryAddIcon />
            </Button>
            <Button className="edit-button" onClick={() => onEdit(studio?._id || '')}>
              <EditNoteIcon />
            </Button>
          </>
        )}
      </div>
    </section>
  );
};
