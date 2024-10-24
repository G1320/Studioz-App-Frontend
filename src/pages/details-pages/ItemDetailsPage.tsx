import { useNavigate, useParams } from 'react-router-dom';
import { ItemPreview, Button } from '@/components';
import { useItem, useWishlists, useDeleteItemMutation } from '@/hooks';

import { useUserContext } from '@/contexts';

const ItemDetailsPage: React.FC = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { itemId } = useParams();
  const { data: item } = useItem(itemId || '');
  const { data: wishlists } = useWishlists(user?._id || '');

  const deleteItemMutation = useDeleteItemMutation();

  const handleEditBtnClicked = () => {
    if (itemId) navigate(`/edit-item/${itemId}`);
  };

  const handleDeleteBtnClicked = async () => {
    if (itemId) deleteItemMutation.mutate(itemId);
  };

  return (
    <section className="item-details-page">
      {item ? <ItemPreview item={item} wishlists={wishlists || []} /> : <p>Loading...</p>}
      <section className="details-buttons item-details-buttons">
        <div>
          {user?._id && user._id === item?.createdBy ? (
            <>
              <Button onClick={handleDeleteBtnClicked}>Del</Button>
              <Button onClick={handleEditBtnClicked}>Edit</Button>
            </>
          ) : null}
        </div>
      </section>
    </section>
  );
};
export default ItemDetailsPage;
