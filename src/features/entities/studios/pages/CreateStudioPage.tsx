import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import '../styles/_index.scss';
import { CreateStudioForm } from '@features/entities/studios/forms/CreateStudioForm';

const CreateStudioPage = () => {
  const { t } = useTranslation('forms');

  return (
    <section className="create-studio-page">
      <Helmet>
        <title>{t('form.AddStudioTitle')} | Studioz</title>
      </Helmet>
      <CreateStudioForm />
    </section>
  );
};

export default CreateStudioPage;
