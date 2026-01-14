import { GenericForm, FieldType } from '@shared/components';
import { useTranslation } from 'react-i18next';
import { useCreateWishlistMutation } from '@shared/hooks';
import { getLocalUser } from '@shared/services';
import { Wishlist } from 'src/types/index';

export const CreateWishlistForm = () => {
  const user = getLocalUser();
  const { t } = useTranslation('forms');
  const createWishlistMutation = useCreateWishlistMutation(user?._id || '');

  const handleSubmit = async (formData: Record<string, any>) => {
    const updatedWishlist: Wishlist = {
      ...formData
    } as Wishlist;

    createWishlistMutation.mutate(updatedWishlist);
  };

  const fields = [
    { name: 'name', label: t('field.name.label'), type: 'text' as FieldType },
    { name: 'description', label: t('field.description.label'), type: 'text' as FieldType }
  ];

  return (
    <section className="form-wrapper create-wishlist-form-wrapper">
      <GenericForm
        className="create-wishlist-form"
        title={t('wishlist.createTitle')}
        fields={fields}
        onSubmit={handleSubmit}
        btnTxt={t('form.submit.createWishlist')}
      />
    </section>
  );
};
