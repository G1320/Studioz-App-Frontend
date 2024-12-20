import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { GenericForm, FieldType } from '@components/index';
import { getLocalUser } from '@services/index';
import {
  useCreateItemMutation,
  useMusicCategories,
  useMusicSubCategories,
  usePhotoCategories,
  usePhotoSubCategories,
  useStudio
} from '@hooks/index';
import { Item } from 'src/types/index';
import { toast } from 'sonner';

export const CreateItemForm = () => {
  const user = getLocalUser();
  const { studioName, studioId } = useParams();
  const createItemMutation = useCreateItemMutation(studioId || '');
  const { data: studioObj } = useStudio(studioId || '');

  const studio = studioObj?.currStudio;

  const musicCategories = useMusicCategories();
  const musicSubCategories = useMusicSubCategories();
  const photoCategories = usePhotoCategories();
  const photoSubCategories = usePhotoSubCategories();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(musicCategories);
  const [subCategories, setSubCategories] = useState<string[]>(musicSubCategories);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([musicSubCategories[0]]);

  interface FormData {
    coverImage?: string;
    coverAudioFile?: string;
    categories?: string[];
    subCategories?: string[];
    createdBy?: string;
    studioName?: string;
    studioId?: string;
    address?: string;
    lat?: number;
    lng?: number;
    paypalMerchantId?: string;
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

  const handleSubmit = async (formData: FormData) => {
    formData.createdBy = user?._id || '';
    formData.categories = selectedCategories;
    formData.subCategories = selectedSubCategories;
    formData.studioName = studioName;
    formData.studioId = studioId || '';
    formData.address = studio?.address || '';
    formData.lat = studio?.lat || 0;
    formData.lng = studio?.lng || 0;

    formData.paypalMerchantId = user?.paypalMerchantId || '';

    if (!user?.paypalMerchantId || user?.paypalOnboardingStatus !== 'COMPLETED') {
      return toast.error('Please complete PayPal onboarding process before creating a studio');
    }

    createItemMutation.mutate(formData as Item);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as FieldType },
    { name: 'description', label: 'Description', type: 'textarea' as FieldType },
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
      <h1>Add a new Service</h1>
      <section className="form-wrapper create-item-form-wrapper">
        <GenericForm className="create-item-form" title={studioName} fields={fields} onSubmit={handleSubmit} />
      </section>
    </section>
  );
};
