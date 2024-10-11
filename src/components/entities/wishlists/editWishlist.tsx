import { useNavigate, useParams } from 'react-router-dom';
import { GenericForm, FieldType } from '@/components';
import { useWishlists, useUpdateWishlistMutation } from '@/hooks';
import { getLocalUser } from '@/services';
import { Wishlist } from '@/types/index';

export const EditWishlist: React.FC = () => {
  const user = getLocalUser();
  const navigate = useNavigate();
  const { wishlistId } = useParams<{ wishlistId: string }>();
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
    <section className="edit-wishlist">
      <GenericForm title="Edit Wishlist" fields={fields} onSubmit={handleSubmit} className="edit-wishlist-form" />
    </section>
  );
};

export default EditWishlist;
