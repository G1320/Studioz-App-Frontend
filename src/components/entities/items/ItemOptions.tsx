import { Button } from '@components/index';
import { Item, User } from 'src/types/index';
import EditNoteIcon from '@mui/icons-material/EditNote';

interface ItemOptionsProps {
  item?: Item;
  user: User;
  onEdit: (itemId: string) => void;
}

const ItemOptions: React.FC<ItemOptionsProps> = ({ item, user, onEdit }) => {
  const canEdit = Boolean(user?._id && user._id === item?.createdBy);

  return (
    <section className="item-details-options-container">
      <div className="details-buttons item-details-buttons">
        {canEdit && (
          <div>
            <Button className="edit-button" onClick={() => onEdit(item?._id || '')}>
              <EditNoteIcon />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ItemOptions;
