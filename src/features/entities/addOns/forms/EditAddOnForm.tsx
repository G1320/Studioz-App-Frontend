import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { GenericForm, FieldType } from '@shared/components';
import { useAddOn, useUpdateAddOnMutation } from '@shared/hooks';
import { AddOn } from 'src/types/index';
import { useTranslation } from 'react-i18next';

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
  idx?: number;
  imageUrl?: string;
}

export const EditAddOnForm = () => {
  const { addOnId, itemId } = useParams();
  const { data: addOn } = useAddOn(addOnId || '');
  const updateAddOnMutation = useUpdateAddOnMutation(addOnId || '', itemId);
  const { t } = useTranslation('forms');

  const [pricePer, setPricePer] = useState<string>(addOn?.pricePer || 'hour');

  const pricePerOptions = [
    { value: 'hour', label: t('common.items.price_per.hour') },
    { value: 'session', label: t('common.items.price_per.session') },
    { value: 'unit', label: t('common.items.price_per.unit') },
    { value: 'song', label: t('common.items.price_per.song') }
  ];

  const pricePerValues = pricePerOptions.map((option) => option.value);

  const fields = [
    {
      name: 'name.en',
      label: 'English Name',
      type: 'text' as FieldType,
      value: addOn?.name?.en
    },
    {
      name: 'name.he',
      label: 'Hebrew Name',
      type: 'text' as FieldType,
      value: addOn?.name?.he
    },
    {
      name: 'description.en',
      label: 'English Description',
      type: 'textarea' as FieldType,
      value: addOn?.description?.en
    },
    {
      name: 'description.he',
      label: 'Hebrew Description',
      type: 'textarea' as FieldType,
      value: addOn?.description?.he
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number' as FieldType,
      value: addOn?.price
    },
    {
      name: 'pricePer',
      label: 'Price Per',
      type: 'select' as FieldType,
      options: pricePerValues,
      value: pricePer,
      onChange: (value: string) => setPricePer(value)
    },
    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox' as FieldType,
      value: addOn?.isActive ?? true
    }
  ];

  const handleSubmit = async (formData: FormData) => {
    formData.pricePer = pricePer;
    // Convert string to boolean for isActive
    formData.isActive = formData.isActive === 'true' || formData.isActive === true;

    updateAddOnMutation.mutate(formData as AddOn);
  };

  if (!addOn) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <h1>Edit Add-On</h1>
      <section className="form-wrapper edit-addon-form-wrapper">
        <GenericForm
          className="edit-addon-form"
          title="Edit Add-On"
          fields={fields}
          onSubmit={handleSubmit}
          btnTxt={t('form.submit.editAddOn')}
        />
      </section>
    </section>
  );
};



