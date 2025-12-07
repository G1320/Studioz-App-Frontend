import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { GenericForm, FieldType } from '@shared/components';
import { useCreateAddOnMutation } from '@shared/hooks';
import { AddOn } from 'src/types/index';
import { useTranslation } from 'react-i18next';

export const CreateAddOnForm = () => {
  const { itemId } = useParams();
  const createAddOnMutation = useCreateAddOnMutation(itemId || '');
  const { t } = useTranslation('forms');

  const [pricePer, setPricePer] = useState<string>('hour');

  interface FormData {
    name?: {
      en: string;
      he?: string;
    };
    description?: {
      en: string;
      he?: string;
    };
    price?: number;
    pricePer?: string;
    itemId?: string;
    isActive?: boolean | string;
    idx?: number;
    imageUrl?: string;
  }

  const pricePerOptions = [
    { value: 'hour', label: t('form.pricePer.hour') },
    { value: 'session', label: t('form.pricePer.session') },
    { value: 'unit', label: t('form.pricePer.unit') },
    { value: 'song', label: t('form.pricePer.song') }
  ];

  const pricePerValues = pricePerOptions.map((option) => option.value);

  const handleSubmit = async (formData: FormData) => {
    formData.itemId = itemId || '';
    formData.pricePer = pricePer;
    // Convert string to boolean for isActive (GenericForm passes checkbox values as strings)
    formData.isActive = formData.isActive === 'true' || formData.isActive === true || formData.isActive === undefined;

    createAddOnMutation.mutate(formData as AddOn);
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
    },
    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox' as FieldType,
      value: true
    }
  ];

  return (
    <section>
      <h1>Create Add-On</h1>
      <section className="form-wrapper create-addon-form-wrapper">
        <GenericForm className="create-addon-form" title="Add-On" fields={fields} onSubmit={handleSubmit} />
      </section>
    </section>
  );
};

