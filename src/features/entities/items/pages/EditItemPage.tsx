import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import '../styles/_index.scss';
import { EditItemForm } from '@features/entities/items/forms/EditItemForm';

const EditItemPage = () => {
  const { t } = useTranslation('forms');

  return (
    <section className="edit-item-page">
      <Helmet>
        <title>{t('form.EditItemTitle')} | Studioz</title>
      </Helmet>
      <EditItemForm />
    </section>
  );
};

export default EditItemPage;
