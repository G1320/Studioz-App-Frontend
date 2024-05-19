import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocalUser } from '../../../services/user-service';
import GenericForm from '../../common/forms/genericForm';

import { useCreateWishlistMutation } from '../../../hooks/mutations/wishlists/wishlistMutations';

const CreateWishlist = () => {
  const user = getLocalUser();
  const navigate = useNavigate();

  const createWishlistMutation = useCreateWishlistMutation(user?._id);

  const handleSubmit = async (formData) => {
    createWishlistMutation.mutate(formData);
    navigate('/wishlists');
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'description', label: 'Description', type: 'text' },
  ];

  return <GenericForm title="Create Wishlist" fields={fields} onSubmit={handleSubmit} />;
};

export default CreateWishlist;
