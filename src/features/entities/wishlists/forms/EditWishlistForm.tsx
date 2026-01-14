import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GenericForm, FieldType } from '@shared/components';
import { useWishlists, useUpdateWishlistMutation, useLanguageNavigate } from '@shared/hooks';
import { getLocalUser } from '@shared/services';
import { Wishlist } from 'src/types/index';

export const EditWishlistForm = () => {
  const user = getLocalUser();
  const langNavigate = useLanguageNavigate();
  const { wishlistId } = useParams();
  const { t } = useTranslation('forms');
  const { data: wishlists = [] } = useWishlists(user?._id || '');

  const wishlist = wishlists.find((wishlist) => wishlist._id === wishlistId);

  const updateWishlistMutation = useUpdateWishlistMutation(wishlistId || '');

  const fields = [
    { name: 'name', label: t('field.name.label'), type: 'text' as FieldType, value: wishlist?.name || '' },
    { name: 'description', label: t('field.description.label'), type: 'text' as FieldType, value: wishlist?.description || '' }
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    const updatedWishlist: Wishlist = {
      ...wishlist,
      ...formData
    } as Wishlist;

    updateWishlistMutation.mutate(updatedWishlist);
    langNavigate('/wishlists');
  };

  return (
    <section className="form-wrapper edit-wishlist-form-wrapper">
      <GenericForm
        className="edit-wishlist-form"
        title={t('wishlist.editTitle')}
        fields={fields}
        onSubmit={handleSubmit}
        btnTxt={t('form.submit.editWishlist')}
      />
    </section>
  );
};
