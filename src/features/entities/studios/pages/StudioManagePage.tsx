import { Helmet } from 'react-helmet-async';
import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStudio } from '@shared/hooks';
import { useUserContext } from '@core/contexts';
import { StudioManageShell } from '../manage/StudioManageShell';
import '../manage/styles/_studio-manage.scss';

const StudioManagePage = () => {
  const { studioId } = useParams();
  const { t, i18n } = useTranslation('forms');
  const { user } = useUserContext();
  const { data, isLoading, error } = useStudio(studioId || '');
  const studio = data?.currStudio;

  const titleName =
    studio?.name?.en || studio?.name?.he || t('manage.untitled', 'Studio');

  const ownerId =
    typeof studio?.createdBy === 'object' && studio?.createdBy && '_id' in (studio.createdBy as object)
      ? String((studio.createdBy as { _id: string })._id)
      : studio?.createdBy
        ? String(studio.createdBy)
        : '';
  const isOwner = Boolean(user?._id && ownerId && user._id === ownerId);
  const lang = (i18n.language || 'en').split('-')[0];

  // Loaded studio that the signed-in user does not own → dashboard
  if (!isLoading && !error && studio && user?._id && !isOwner) {
    return <Navigate to={`/${lang}/dashboard`} replace />;
  }

  // Not signed in after load → login still leaves manage URL; send to dashboard
  if (!isLoading && !error && studio && !user?._id) {
    return <Navigate to={`/${lang}/dashboard`} replace />;
  }

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

      {!isLoading && !error && studio && isOwner && <StudioManageShell studio={studio} />}

      {!isLoading && !error && !studio && (
        <div className="studio-manage-page__error">
          {t('manage.notFound', 'Studio not found.')}
        </div>
      )}
    </section>
  );
};

export default StudioManagePage;
