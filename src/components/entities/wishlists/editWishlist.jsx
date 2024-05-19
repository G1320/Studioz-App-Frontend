import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericForm from '../../common/forms/genericForm';
import { useWishlists } from '../../../hooks/dataFetching/useWishlists';
import { useUpdateWishlistMutation } from '../../../hooks/mutations/wishlists/wishlistMutations';
import { getLocalUser } from '../../../services/user-service';

const EditWishlist = () => {
  const user = getLocalUser();
  const navigate = useNavigate();
  const { wishlistId } = useParams();
  const { data: wishlist } = useWishlists(user?._id);

  const updateWishlistMutation = useUpdateWishlistMutation(wishlistId);

  const fields = [
    { name: 'name', label: 'Name', type: 'text', value: wishlist?.name },
    { name: 'description', label: 'Description', type: 'text', value: wishlist?.description },
  ];

  const handleSubmit = async (formData) => {
    updateWishlistMutation.mutate(formData);
    navigate('/wishlists');
  };

  return (
    <section className="edit-wishlist">
      <GenericForm
        title="Edit Wishlist"
        fields={fields}
        onSubmit={handleSubmit}
        className="edit-wishlist-form"
      />
    </section>
  );
};

export default EditWishlist;
