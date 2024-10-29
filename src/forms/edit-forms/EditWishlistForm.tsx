import { useNavigate, useParams } from 'react-router-dom';
import { GenericForm, FieldType } from '@components/index';
import { useWishlists, useUpdateWishlistMutation } from '@hooks/index';
import { getLocalUser } from '@services/index';
import { Wishlist } from '@models/index';

export const EditWishlistForm = () => {
  const user = getLocalUser();
  const navigate = useNavigate();
  const { wishlistId } = useParams();
  const { data: wishlists = [] } = useWishlists(user?._id || '');

  const wishlist = wishlists.find((wishlist) => wishlist._id === wishlistId);

  const updateWishlistMutation = useUpdateWishlistMutation(wishlistId || '');

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as FieldType, value: wishlist?.name || '' },
    { name: 'description', label: 'Description', type: 'text' as FieldType, value: wishlist?.description || '' }
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    const updatedWishlist: Wishlist = {
      ...wishlist,
      ...formData
    } as Wishlist;

    updateWishlistMutation.mutate(updatedWishlist);
    navigate('/wishlists');
  };

  return (
    <section className="edit-wishlist-form-wrapper">
      <GenericForm className="edit-wishlist-form" title="Edit Wishlist" fields={fields} onSubmit={handleSubmit} />
    </section>
  );
};
