import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { GenericForm, FieldType } from '@components/index';
import { Item } from 'src/types/index';
import { getLocalUser } from '@services/user-service';
import { useCreateItemMutation, useMusicSubCategories, usePhotoSubCategories } from '@hooks/index';

export const CreateItemForm = () => {
  const user = getLocalUser();

  const { studioName, studioId } = useParams();
  const createItemMutation = useCreateItemMutation(studioId || '');
  const musicSubCategories = useMusicSubCategories();
  const photoSubCategories = usePhotoSubCategories();

  const handleSubmit = async (formData: Record<string, unknown>) => {
    createItemMutation.mutate({ ...formData, studioId, studioName, createdBy: user?._id } as Item);
  };

  const [selectedCategory, setSelectedCategory] = useState('Music');
  const [subCategories, setSubCategories] = useState(musicSubCategories);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSubCategories(value === 'Music / Podcast Studio' ? musicSubCategories : photoSubCategories);
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
      label: selectedCategory === 'Music / Podcast Studio' ? 'Music / Podcast Studio' : 'Photo / Video Studio',
      type: 'select' as FieldType,
      options: subCategories,
      value: ''
    },
    { name: 'price', label: 'Price', type: 'number' as FieldType },
    { name: 'inStock', label: 'In Stock', type: 'checkbox' as FieldType }
    // { name: 'imageUrl', label: 'Image URL', type: 'text' as FieldType }
  ];

  return (
    <section className="form-wrapper create-item-form-wrapper">
      <GenericForm
        className="create-item-form"
        title={studioName}
        fields={fields}
        onSubmit={handleSubmit}
        onCategoryChange={handleCategoryChange}
      />
    </section>
  );
};
