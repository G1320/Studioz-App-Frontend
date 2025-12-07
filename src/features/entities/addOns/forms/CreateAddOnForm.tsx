import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { GenericForm, FieldType } from '@shared/components';
import { useCreateAddOnMutation } from '@shared/hooks';
import { AddOn } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import './styles/_create-addon-form.scss';

export const CreateAddOnForm = () => {
  const { itemId } = useParams();
  const { t } = useTranslation('forms');
  const createAddOnMutation = useCreateAddOnMutation(itemId);
  const [pricePer, setPricePer] = useState<string>('hour');
  const [formKey, setFormKey] = useState<number>(0);

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
    isActive?: boolean | string;
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
    // Validate required fields
    if (!formData.name?.en || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Convert string to boolean for isActive (GenericForm passes checkbox values as strings)
    const isActive = formData.isActive === 'true' || formData.isActive === true || formData.isActive === undefined;

    const addOnData: AddOn = {
      _id: '', // Will be set by the backend
      name: {
        en: formData.name.en,
        he: formData.name.he || ''
      },
      description: formData.description
        ? {
            en: formData.description.en || '',
            he: formData.description.he || ''
          }
        : undefined,
      price: Number(formData.price),
      pricePer: pricePer as 'hour' | 'session' | 'unit' | 'song',
      itemId: itemId, // Optional - can be undefined when creating addon before item exists
      isActive,
      imageUrl: formData.imageUrl
    };

    createAddOnMutation.mutate(addOnData, {
      onSuccess: () => {
        // Reset form by changing key to force re-render
        setFormKey((prev) => prev + 1);
        setPricePer('hour');
      }
    });
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
    <section className="create-addon-form-container">
      <h1 className="create-addon-form-title">Create Add-On</h1>
      <div className="create-addon-form-wrapper">
        <GenericForm key={formKey} className="create-addon-form" fields={fields} onSubmit={handleSubmit} />
      </div>
    </section>
  );
};
