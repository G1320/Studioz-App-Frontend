import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileUploader, GenericForm, FieldType } from '@components/index';
import { getLocalUser, uploadFile } from '@services/index';
import { toast } from 'sonner';
import {
  useCreateItemMutation,
  useMusicCategories,
  useMusicSubCategories,
  usePhotoCategories,
  usePhotoSubCategories
} from '@hooks/index';
import { Item } from 'src/types/index';

export const CreateItemForm = () => {
  const user = getLocalUser();
  const { studioName, studioId } = useParams();
  const createItemMutation = useCreateItemMutation(studioId || '');

  const musicCategories = useMusicCategories();
  const musicSubCategories = useMusicSubCategories();
  const photoCategories = usePhotoCategories();
  const photoSubCategories = usePhotoSubCategories();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(musicCategories);
  const [subCategories, setSubCategories] = useState<string[]>(musicSubCategories);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([musicSubCategories[0]]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  interface FormData {
    coverImage?: string;
    coverAudioFile?: string;
    categories?: string[];
    subCategories?: string[];
    createdBy?: string;
    studioName?: string;
    studioId?: string;
  }

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values);
    const newSubCategories = values.includes(`${musicCategories}`) ? musicSubCategories : photoSubCategories;
    setSubCategories(newSubCategories);
    setSelectedSubCategories([newSubCategories[0]]);
  };

  const handleSubCategoryChange = (values: string[]) => {
    setSelectedSubCategories(values);
  };

  const handleFileUpload = async (files: File[]) => {
    const results = await Promise.all(files.map(async (file) => await uploadFile(file)));
    const fileUrls = results.map((result) => result.secure_url);
    setGalleryImages(fileUrls);
    toast.success('Images uploaded successfully');
  };

  const handleSubmit = async (formData: FormData) => {
    formData.coverImage = galleryImages[0];
    formData.createdBy = user?._id || '';
    formData.categories = selectedCategories;
    formData.subCategories = selectedSubCategories;
    formData.studioName = studioName;
    formData.studioId = studioId || '';
    createItemMutation.mutate(formData as Item);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as FieldType },
    { name: 'description', label: 'Description', type: 'textarea' as FieldType },
    {
      name: 'categories',
      label: 'Categories',
      type: 'select' as FieldType,
      options: [musicCategories, photoCategories],
      value: selectedCategories,
      onChange: handleCategoryChange
    },
    {
      name: 'subCategories',
      label: selectedCategories.includes(`${musicCategories}`) ? `${musicCategories}` : `${photoCategories}`,
      type: 'multiSelect' as FieldType,
      options: subCategories,
      value: selectedSubCategories,
      onChange: handleSubCategoryChange
    },
    { name: 'price', label: 'Price', type: 'number' as FieldType },
    { name: 'inStock', label: 'In Stock', type: 'checkbox' as FieldType }
  ];

  return (
    <section>
      <FileUploader fileType="image" onFileUpload={handleFileUpload} galleryFiles={galleryImages} />
      <section className="form-wrapper create-item-form-wrapper">
        <GenericForm className="create-item-form" title={studioName} fields={fields} onSubmit={handleSubmit} />
      </section>
    </section>
  );
};
