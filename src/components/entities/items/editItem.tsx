import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericForm from '../../common/forms/genericForm';
import { useItem } from '../../../hooks/dataFetching/useItem';
import { useUpdateItemMutation } from '../../../hooks/mutations/items/itemMutations';
import { Item } from '../../../types/index'; 

import { FieldType } from '../../common/forms/genericForm';

const EditItem: React.FC = () => {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>(); 
  const { data: item } = useItem(itemId || '');

  const updateItemMutation = useUpdateItemMutation(itemId || '');

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as FieldType, value: item?.name || '' },
    { name: 'description', label: 'Description', type: 'text' as FieldType, value: item?.description || '' },
    { name: 'price', label: 'Price', type: 'number' as FieldType, value: item?.price || 0 },
    { name: 'imageUrl', label: 'Image URL', type: 'text' as FieldType, value: item?.imageUrl || '' },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    const updatedItem: Item = {
      ...item,
      ...formData,
    } as Item;

    updateItemMutation.mutate(updatedItem);
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
