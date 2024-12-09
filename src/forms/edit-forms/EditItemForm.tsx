import { useParams } from 'react-router-dom';
import { GenericForm, FieldType } from '@components/index';
import { useItem, useMusicSubCategories, usePhotoSubCategories, useUpdateItemMutation } from '@hooks/index';
import { Item } from 'src/types/index';
import { useState } from 'react';

export const EditItemForm = () => {
  const { itemId } = useParams();
  const { data: item } = useItem(itemId || '');
  const musicSubCategories = useMusicSubCategories();
  const photoSubCategories = usePhotoSubCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>(item?.categories[0] || ['Music']);
  const [subCategories, setSubCategories] = useState(item?.subCategory || musicSubCategories);

  const updateItemMutation = useUpdateItemMutation(itemId || '');

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSubCategories(value === 'Music / Podcast Studio' ? musicSubCategories : photoSubCategories);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as FieldType, value: item?.name || '' },
    { name: 'description', label: 'Description', type: 'text' as FieldType, value: item?.description || '' },
    { name: 'price', label: 'Price', type: 'number' as FieldType, value: item?.price || 0 },
    { name: 'imageUrl', label: 'Image URL', type: 'text' as FieldType, value: item?.imageUrl || '' },
    {
      name: 'categories',
      label: 'Categories',
      type: 'select' as FieldType,
      options: ['Music / Podcast Studio', 'Photo / Video Studio'],
      value: item?.categories,
      onChange: handleCategoryChange
    },
    {
      name: 'subCategory',
      label: selectedCategory === 'Music / Podcast Studio' ? 'Music / Podcast Studio' : 'Photo / Video Studio',
      type: 'select' as FieldType,
      options: subCategories,
      value: item?.subCategory
    }
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    const updatedItem: Item = {
      ...item,
      ...formData
    } as Item;
    updateItemMutation.mutate(updatedItem);
  };

  return (
    <section className="form-wrapper edit-item-form-wrapper">
      <GenericForm className="edit-item-form" title="Edit Item" fields={fields} onSubmit={handleSubmit} />
    </section>
  );
};
