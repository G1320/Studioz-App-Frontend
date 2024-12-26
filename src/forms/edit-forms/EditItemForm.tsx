import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileUploader, GenericForm, FieldType } from '@components/index';
import {
  useItem,
  useMusicCategories,
  useMusicSubCategories,
  usePhotoCategories,
  usePhotoSubCategories,
  useUpdateItemMutation
} from '@hooks/index';
import { uploadFile } from '@services/index';
import { Item } from 'src/types/index';
import { toast } from 'sonner';
import { arraysEqual } from '@utils/compareArrays';

interface FormData {
  imageUrl?: string;
  categories?: string[];
  subCategories?: string[];
  studioId?: string;
}

export const EditItemForm = () => {
  const { itemId } = useParams();
  const { data: item } = useItem(itemId || '');

  const musicCategories = useMusicCategories();
  const musicSubCategories = useMusicSubCategories();
  const photoCategories = usePhotoCategories();
  const photoSubCategories = usePhotoSubCategories();

  const updateItemMutation = useUpdateItemMutation(itemId || '');

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    item?.categories && item.categories.length > 0 ? [item.categories[0]] : musicCategories
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(item?.subCategories || []);
  const [subCategories, setSubCategories] = useState<string[]>(musicSubCategories);
  const [imageUrl, setImageUrl] = useState<string>(item?.imageUrl || '');

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values);
    const newSubCategories = values.includes(`${musicCategories}`) ? musicSubCategories : photoSubCategories;
    setSubCategories(newSubCategories);
    setSelectedSubCategories([newSubCategories[0]]);
  };

  const handleSubCategoryChange = (values: string[]) => {
    setSelectedSubCategories(values);
  };

  const fields = [
    { name: 'name.en', label: 'English Name', type: 'text' as FieldType, value: item?.name.en },
    { name: 'name.he', label: 'Hebrew Name', type: 'text' as FieldType, value: item?.name.he },
    {
      name: 'description.en',
      label: 'English Description',
      type: 'textarea' as FieldType,
      value: item?.description.en
    },
    {
      name: 'description.he',
      label: 'English Description',
      type: 'textarea' as FieldType,
      value: item?.description.he
    },
    {
      name: 'categories',
      label: 'Category',
      type: 'select' as FieldType,
      options: [musicCategories, photoCategories],
      value: selectedCategories,
      onChange: handleCategoryChange
    },
    {
      name: 'subCategories',
      label: arraysEqual(selectedCategories, musicCategories) ? [musicCategories] : [photoCategories],
      type: 'multiSelect' as FieldType,
      options: subCategories,
      value: selectedSubCategories,
      onChange: handleSubCategoryChange
    },
    { name: 'price', label: 'Price', type: 'number' as FieldType, value: item?.price }
  ];

  const handleSubmit = async (formData: FormData) => {
    formData.imageUrl = imageUrl;
    formData.categories = selectedCategories;
    formData.subCategories = selectedSubCategories;
    formData.studioId = item?.studioId || '';

    // console.log('formData: ', formData);
    updateItemMutation.mutate(formData as Item);
  };

  const handleFileUpload = async (files: File[], type: string) => {
    const results = await Promise.all(files.map((file) => uploadFile(file)));
    const urls = results.map((result) => result.secure_url);

    if (type === 'image') {
      if (files.length === 1) {
        setImageUrl(urls[0]);
        return toast.success('Image uploaded successfully');
      }
      toast.success('Gallery images uploaded successfully');
    }
  };

  return (
    <section>
      <FileUploader fileType="image" onFileUpload={handleFileUpload} isCoverShown={true} />
      <section className="form-wrapper edit-item-form-wrapper">
        <GenericForm
          className="edit-item-form"
          title="Edit Item"
          fields={fields}
          onSubmit={handleSubmit}
          onCategoryChange={handleCategoryChange}
        />
      </section>
    </section>
  );
};
