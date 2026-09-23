import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import '../styles/_index.scss';
import { CreateItemForm } from '@features/entities/items/forms/CreateItemForm';

const CreateItemPage = () => {
  const { t } = useTranslation('forms');

  return (
    <section className="create-item-page">
      <Helmet>
        <title>{t('form.AddItemTitle')} | Studioz</title>
      </Helmet>
      <CreateItemForm />
    </section>
  );
};
export default CreateItemPage;
