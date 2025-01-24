import { useParams } from 'react-router-dom';
import { ItemPreview } from '@components/index';
import { Button } from '@shared/components';
import { useItem, useWishlists, useDeleteItemMutation, useLanguageNavigate } from '@hooks/index';

import { useUserContext } from '@core/contexts';

const ItemDetailsPage = () => {
  const { user } = useUserContext();
  const langNavigate = useLanguageNavigate();
  const { itemId } = useParams();
  const { data: item } = useItem(itemId || '');
  const { data: wishlists } = useWishlists(user?._id || '');

  const deleteItemMutation = useDeleteItemMutation();

  const handleEditBtnClicked = () => {
    if (itemId) langNavigate(`/edit-item/${itemId}`);
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
