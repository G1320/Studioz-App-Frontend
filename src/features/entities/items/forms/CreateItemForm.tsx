import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GenericForm, FieldType } from '@shared/components';
import { getLocalUser } from '@shared/services';
import {
  useCreateItemMutation,
  useMusicCategories,
  useMusicSubCategories,
  usePhotoCategories,
  usePhotoSubCategories,
  useStudio,
  useItems,
  useSubscription
} from '@shared/hooks';
import { Item } from 'src/types/index';
import { CreateAddOnForm } from '@features/entities/addOns/forms';
import { isFeatureEnabled } from '@core/config/featureFlags';
import { toast } from 'sonner';

export const CreateItemForm = () => {
  const user = getLocalUser();
  const { studioName, studioId } = useParams();
  const createItemMutation = useCreateItemMutation(studioId || '');
  const { data: studioObj } = useStudio(studioId || '');
  const { data: allItems = [] } = useItems();
  const { hasSubscription, isPro, isStarter, isLoading: isSubscriptionLoading } = useSubscription();
  const { t } = useTranslation('forms');

  const studio = studioObj?.currStudio;

  // Count user's items
  const userItemCount = useMemo(() => {
    if (!user?._id) return 0;
    return allItems.filter((item) => item.createdBy === user._id).length;
  }, [allItems, user?._id]);

  // Check if user can create more items
  const canCreateItem = useMemo(() => {
    // If subscription is loading, allow (will be validated on submit)
    if (isSubscriptionLoading) return true;

    // If user has paid subscription (pro or starter), allow unlimited
    if (hasSubscription && (isPro || isStarter)) return true;

    // If user has free subscription (no subscription or inactive), limit to 3 items
    return userItemCount < 3;
  }, [hasSubscription, isPro, isStarter, userItemCount, isSubscriptionLoading]);

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
    studioName?: {
      en: string;
      he?: string;
    };
    studioId?: string;
    address?: string;
    lat?: number;
    lng?: number;
    instantBook?: boolean | string;
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
    // Check subscription limit before submitting
    if (!canCreateItem) {
      toast.error(
        t('form.errors.itemLimitReached', {
          defaultValue:
            'You have reached the maximum limit of 3 services for free accounts. Please upgrade to a paid plan to create more services.'
        })
      );
      return;
    }

    formData.createdBy = user?._id || '';
    formData.categories = selectedCategories;
    formData.subCategories = selectedSubCategories;
    formData.studioName = {
      en: studioName || ''
    };
    formData.studioId = studioId || '';
    formData.address = studio?.address || '';
    formData.lat = studio?.lat || 0;
    formData.lng = studio?.lng || 0;
    formData.pricePer = pricePerEnglishMap[pricePer] || pricePer;
    // Convert string to boolean for instantBook (GenericForm passes checkbox values as strings)
    formData.instantBook = formData.instantBook === 'true' || formData.instantBook === true;

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
    },
    {
      name: 'instantBook',
      label: t('form.instantBook.label'),
      type: 'checkbox' as FieldType,
      value: false
    }
  ];

  // Calculate remaining items for free users
  const remainingItems = useMemo(() => {
    if (isSubscriptionLoading) return null;
    if (hasSubscription && (isPro || isStarter)) return null; // Unlimited for paid users
    return Math.max(0, 3 - userItemCount);
  }, [hasSubscription, isPro, isStarter, userItemCount, isSubscriptionLoading]);

  return (
    <section>
      <h1>{t('form.AddItemTitle')}</h1>
      {remainingItems !== null && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '16px',
            backgroundColor: remainingItems === 0 ? 'rgba(248, 113, 113, 0.2)' : 'rgba(16, 185, 129, 0.1)',
            border: `1px solid ${remainingItems === 0 ? 'rgba(248, 113, 113, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            borderRadius: '8px',
            color: remainingItems === 0 ? '#f87171' : '#10b981'
          }}
        >
          {remainingItems === 0 ? (
            <p style={{ margin: 0, fontWeight: 600 }}>
              {t('form.errors.itemLimitReached', {
                defaultValue:
                  'You have reached the maximum limit of 3 items. Please upgrade to a paid plan to create more items.'
              })}
            </p>
          ) : (
            <p style={{ margin: 0, fontWeight: 500 }}>
              {t('form.itemLimitInfo', {
                defaultValue: `You have ${remainingItems} item${remainingItems !== 1 ? 's' : ''} remaining on your free plan. Upgrade to create unlimited items.`,
                count: remainingItems
              })}
            </p>
          )}
        </div>
      )}
      <section className="form-wrapper create-item-form-wrapper">
        <GenericForm
          className="create-item-form"
          title={studioName}
          fields={fields}
          onSubmit={handleSubmit}
          btnTxt={t('form.submit.createItem')}
        />
      </section>
      {isFeatureEnabled('addOns') && (
        <section className="addon-form-section">
          <CreateAddOnForm />
        </section>
      )}
    </section>
  );
};
