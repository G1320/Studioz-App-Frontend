import { getLocalUser } from '../../../services/user-service';
import GenericForm, { FieldType } from '../../common/forms/genericForm';

import { useCreateWishlistMutation } from '../../../hooks/mutations/wishlists/wishlistMutations';
import { Wishlist } from '../../../../../shared/types';

const CreateWishlist = () => {
  const user = getLocalUser();

  const createWishlistMutation = useCreateWishlistMutation(user?._id ||'');

  const handleSubmit = async (formData: Record<string, any>) => {
    const updatedWishlist: Wishlist = {
        ...formData,
    } as Wishlist;
    
    createWishlistMutation.mutate(updatedWishlist);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as FieldType},
    { name: 'description', label: 'Description', type: 'text' as FieldType },
  ];

  return <GenericForm title="Create Wishlist" fields={fields} onSubmit={handleSubmit} />;
};

export default CreateWishlist;
