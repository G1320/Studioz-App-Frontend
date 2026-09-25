import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStudio } from '@shared/hooks';
import { StudioManageShell } from '../manage/StudioManageShell';
import '../manage/styles/_studio-manage.scss';

const StudioManagePage = () => {
  const { studioId } = useParams();
  const { t } = useTranslation('forms');
  const { data, isLoading, error } = useStudio(studioId || '');
  const studio = data?.currStudio;

  const titleName =
    studio?.name?.en || studio?.name?.he || t('manage.untitled', 'Studio');

  return (
    <section className="studio-manage-page">
      <Helmet>
        <title>
          {t('manage.pageTitle', 'Manage')} · {titleName} | Studioz
        </title>
      </Helmet>

      {isLoading && (
        <div className="studio-manage-page__loading">
          {t('manage.loading', 'Loading studio…')}
        </div>
      )}

      {!!error && (
        <div className="studio-manage-page__error">
          {t('manage.loadError', 'Could not load this studio.')}
        </div>
      )}

      {!isLoading && !error && studio && <StudioManageShell studio={studio} />}

      {!isLoading && !error && !studio && (
        <div className="studio-manage-page__error">
          {t('manage.notFound', 'Studio not found.')}
        </div>
      )}
    </section>
  );
};

export default StudioManagePage;
