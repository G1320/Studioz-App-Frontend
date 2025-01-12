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
import { useTranslation } from 'react-i18next';

export const CreateItemForm = () => {
  const user = getLocalUser();
  const { studioName, studioId } = useParams();
  const createItemMutation = useCreateItemMutation(studioId || '');
  const { data: studioObj } = useStudio(studioId || '');
  const { t } = useTranslation('forms');

  const studio = studioObj?.currStudio;

  const musicCategories = useMusicCategories();
  const musicSubCategories = useMusicSubCategories();
  const photoCategories = usePhotoCategories();
  const photoSubCategories = usePhotoSubCategories();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(musicCategories);
  const [subCategories, setSubCategories] = useState<string[]>(musicSubCategories);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([musicSubCategories[0]]);
  const [pricePer, setPricePer] = useState<string>(t('form.pricePer.hour'));

  interface FormData {
    coverImage?: string;
    coverAudioFile?: string;
    categories?: string[];
    subCategories?: string[];
    createdBy?: string;
    pricePer?: string;
    studioNameEn?: string;
    studioId?: string;
    address?: string;
    lat?: number;
    lng?: number;
    paypalMerchantId?: string;
  }

  const pricePerEnglishMap: Record<string, string> = {
    [t('form.pricePer.hour')]: 'hour',
    [t('form.pricePer.session')]: 'session',
    [t('form.pricePer.unit')]: 'unit',
    [t('form.pricePer.song')]: 'song'
  };

  const pricePerOptions = [
    { value: 'hour', label: t('form.pricePer.hour') },
    { value: 'session', label: t('form.pricePer.session') },
    { value: 'unit', label: t('form.pricePer.unit') },
    { value: 'song', label: t('form.pricePer.song') }
  ];

  const pricePerValues = pricePerOptions.map((option) => option.label);

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
    formData.studioNameEn = studioName || '';
    formData.studioId = studioId || '';
    formData.address = studio?.address || '';
    formData.lat = studio?.lat || 0;
    formData.lng = studio?.lng || 0;
    formData.pricePer = pricePerEnglishMap[pricePer] || pricePer;

    formData.paypalMerchantId = user?.paypalMerchantId || '';

    if (!user?.paypalMerchantId || user?.paypalOnboardingStatus !== 'COMPLETED') {
      return toast.error('Please complete PayPal onboarding process before creating a studio');
    }

    createItemMutation.mutate(formData as Item);
  };

  const fields = [
    {
      name: 'name.en',
      label: t('form.name.en'),
      type: 'text' as FieldType
    },
    {
      name: 'name.he',
      label: t('form.name.he'),
      type: 'text' as FieldType
    },
    {
      name: 'description.en',
      label: t('form.description.en'),
      type: 'textarea' as FieldType
    },
    {
      name: 'description.he',
      label: t('form.description.he'),
      type: 'textarea' as FieldType
    },
    {
      name: 'categories',
      label: t('form.categories.label'),
      type: 'select' as FieldType,
      options: [musicCategories, photoCategories],
      value: selectedCategories,
      onChange: handleCategoryChange
    },
    {
      name: 'subCategories',
      label: selectedCategories.includes(`${musicCategories}`)
        ? t('form.categories.music')
        : t('form.categories.photo'),
      type: 'multiSelect' as FieldType,
      options: subCategories,
      value: selectedSubCategories,
      onChange: handleSubCategoryChange
    },
    {
      name: 'price',
      label: t('form.price.label'),
      type: 'number' as FieldType
    },
    {
      name: 'pricePer',
      label: t('form.pricePer.label'),
      type: 'select' as FieldType,
      options: pricePerValues,
      value: pricePer,
      onChange: (value: string) => setPricePer(value)
    }
  ];

  return (
    <section>
      <h1>{t('form.AddItemTitle')}</h1>
      <section className="form-wrapper create-item-form-wrapper">
        <GenericForm className="create-item-form" title={studioName} fields={fields} onSubmit={handleSubmit} />
      </section>
    </section>
  );
};
