import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { GenericForm, FieldType } from '@components/index';
import { useCreateItemMutation } from '@hooks/index';
import { Item } from '@models/index';
import { musicSubCategories, videoAndPhotographySubCategories } from '@config/index';

export const CreateItemForm = () => {
  const { studioName, studioId } = useParams();
  const createItemMutation = useCreateItemMutation(studioId || '');

  const handleSubmit = async (formData: Record<string, unknown>) => {
    createItemMutation.mutate({ ...formData, studioId, studioName } as Item);
  };

  const [selectedCategory, setSelectedCategory] = useState('Music');
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as FieldType },
    { name: 'description', label: 'Description', type: 'textarea' as FieldType },
    {
      name: 'category',
      label: 'Category',
      type: 'select' as FieldType,
      options: ['Music', 'Photo / Video Studio'],
      value: selectedCategory,
      onChange: handleCategoryChange
    },
    {
      name: 'subCategory',
      label: selectedCategory === 'Music' ? 'Music' : 'Photo / Video ',
      type: 'select' as FieldType,
      options: selectedCategory === 'Music' ? musicSubCategories : videoAndPhotographySubCategories
    },
    { name: 'price', label: 'Price', type: 'number' as FieldType },
    { name: 'inStock', label: 'In Stock', type: 'checkbox' as FieldType }
    // { name: 'imageUrl', label: 'Image URL', type: 'text' as FieldType }
  ];

  return (
    <GenericForm
      className="create-item-form"
      title={studioName}
      fields={fields}
      onSubmit={handleSubmit}
      onCategoryChange={handleCategoryChange}
    />
  );
};
