import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import '../styles/_index.scss';
import { EditStudioForm } from '@features/entities/studios/forms/EditStudioForm';
import { StickyRemoteAudioBar } from '@shared/components/audio';

const EditStudioPage = () => {
  const { t } = useTranslation('forms');

  return (
    <section className="edit-studio-page">
      <Helmet>
        <title>{t('form.EditStudioTitle')} | Studioz</title>
      </Helmet>
      <EditStudioForm />
      <StickyRemoteAudioBar />
    </section>
  );
};
export default EditStudioPage;
