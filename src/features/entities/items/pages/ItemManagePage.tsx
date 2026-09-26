import { Helmet } from 'react-helmet-async';
import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useItem, useStudio } from '@shared/hooks';
import { useUserContext } from '@core/contexts';
import { ItemManageShell } from '../manage/ItemManageShell';
import '@features/entities/studios/manage/styles/_studio-manage.scss';

const ItemManagePage = () => {
  const { itemId } = useParams();
  const { t, i18n } = useTranslation('forms');
  const { user } = useUserContext();
  const { data: item, isLoading, error } = useItem(itemId || '');
  const studioId = item?.studioId ? String(item.studioId) : '';
  const { data: studioData, isLoading: studioLoading } = useStudio(studioId);
  const studio = studioData?.currStudio;

  const titleName = item?.name?.en || item?.name?.he || t('manage.item.untitled', 'Service');

  const ownerId = studio?.createdBy
    ? String(studio.createdBy)
    : item?.createdBy || item?.sellerId
      ? String(item.createdBy || item.sellerId)
      : '';
  const isOwner = Boolean(user?._id && ownerId && user._id === ownerId);
  const lang = (i18n.language || 'en').split('-')[0];
  const ownershipReady = !isLoading && !studioLoading && !!item && (!studioId || !!studio);

  if (ownershipReady && user?._id && !isOwner) {
    return <Navigate to={`/${lang}/dashboard`} replace />;
  }

  if (ownershipReady && !user?._id) {
    return <Navigate to={`/${lang}/dashboard`} replace />;
  }

  return (
    <section className="item-manage-page">
      <Helmet>
        <title>
          {t('manage.item.pageTitle', 'Manage')} · {titleName} | Studioz
        </title>
      </Helmet>

      {(isLoading || (studioId && studioLoading)) && (
        <div className="studio-manage-page__loading">
          {t('manage.item.loading', 'Loading service…')}
        </div>
      )}

      {!!error && (
        <div className="studio-manage-page__error">
          {t('manage.item.loadError', 'Could not load this service.')}
        </div>
      )}

      {!isLoading && !error && item && isOwner && <ItemManageShell item={item} />}

      {!isLoading && !error && !item && (
        <div className="studio-manage-page__error">
          {t('manage.item.notFound', 'Service not found.')}
        </div>
      )}
    </section>
  );
};

export default ItemManagePage;
