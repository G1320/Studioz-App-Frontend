import { GenericForm, FieldType } from '@shared/components';

import { useCreateWishlistMutation } from '@shared/hooks';
import { getLocalUser } from '@shared/services';
import { Wishlist } from 'src/types/index';

export const CreateWishlistForm = () => {
  const user = getLocalUser();

  const createWishlistMutation = useCreateWishlistMutation(user?._id || '');

  const handleSubmit = async (formData: Record<string, any>) => {
    const updatedWishlist: Wishlist = {
      ...formData
    } as Wishlist;

    createWishlistMutation.mutate(updatedWishlist);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as FieldType },
    { name: 'description', label: 'Description', type: 'text' as FieldType }
  ];

  return (
    <section className="form-wrapper create-wishlist-form-wrapper">
      <GenericForm className="create-wishlist-form" title="Create Wishlist" fields={fields} onSubmit={handleSubmit} />
    </section>
  );
};
