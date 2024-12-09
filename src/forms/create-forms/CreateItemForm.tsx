import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { GenericForm, FieldType } from '@components/index';
import { Item } from 'src/types/index';
import { getLocalUser } from '@services/user-service';
import {
  useCreateItemMutation,
  useMusicCategories,
  useMusicSubCategories,
  usePhotoCategories,
  usePhotoSubCategories
} from '@hooks/index';

export const CreateItemForm = () => {
  const user = getLocalUser();

  const { studioName, studioId } = useParams();
  const createItemMutation = useCreateItemMutation(studioId || '');
  const musicSubCategories = useMusicSubCategories();
  const musicCategories = useMusicCategories();
  const photoSubCategories = usePhotoSubCategories();
  const photoCategories = usePhotoCategories();

  const handleSubmit = async (formData: Record<string, unknown>) => {
    createItemMutation.mutate({ ...formData, studioId, studioName, createdBy: user?._id } as Item);
  };

  const [selectedCategory, setSelectedCategory] = useState(`${musicCategories}`);
  const [selectedSubCategory, setSelectedSubCategory] = useState(`${musicSubCategories[0]}`);
  const [subCategories, setSubCategories] = useState(musicSubCategories);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const newSubCategories = value === `${musicCategories}` ? musicSubCategories : photoSubCategories;
    setSubCategories(newSubCategories);
    setSelectedSubCategory(newSubCategories[0]);
  };

  const handleSubCategoryChange = (value: string) => {
    setSelectedSubCategory(value);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as FieldType },
    { name: 'description', label: 'Description', type: 'textarea' as FieldType },
    {
      name: 'categories',
      label: 'Categories',
      type: 'select' as FieldType,
      options: [`${musicCategories}`, `${photoCategories}`],
      value: selectedCategory,
      onChange: handleCategoryChange
    },
    {
      name: 'subCategory',
      label: selectedCategory === `${musicCategories}` ? `${musicCategories}` : `${photoCategories}`,
      type: 'select' as FieldType,
      options: subCategories,
      value: selectedSubCategory,
      onChange: handleSubCategoryChange
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
