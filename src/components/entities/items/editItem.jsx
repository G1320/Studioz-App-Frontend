import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericForm from '../../common/forms/genericForm';
import { useItem } from '../../../hooks/dataFetching/useItem';
import { useUpdateItemMutation } from '../../../hooks/mutations/items/itemMutations';

const EditItem = () => {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const { data: item } = useItem(itemId);

  const updateItemMutation = useUpdateItemMutation(itemId);

  const fields = [
    { name: 'name', label: 'Name', type: 'text', value: item?.name },
    { name: 'description', label: 'Description', type: 'text', value: item?.description },
    { name: 'price', label: 'Price', type: 'number', value: item?.price },
    { name: 'imageUrl', label: 'Image URL', type: 'text', value: item?.imageUrl },
  ];

  const handleSubmit = async (formData) => {
    updateItemMutation.mutate(formData);
    navigate('/store');
  };

  return (
    <section className="edit-item">
      <GenericForm
        title="Edit Item"
        fields={fields}
        onSubmit={handleSubmit}
        className="edit-item-form"
      />
    </section>
  );
};

export default EditItem;
