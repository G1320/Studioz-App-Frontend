import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useItem } from '@shared/hooks';
import { ItemManageShell } from '../manage/ItemManageShell';

const ItemManagePage = () => {
  const { itemId } = useParams();
  const { t } = useTranslation('forms');
  const { data: item, isLoading, error } = useItem(itemId || '');

  const titleName = item?.name?.en || item?.name?.he || t('manage.item.untitled', 'Service');

  return (
    <section className="item-manage-page">
      <Helmet>
        <title>
          {t('manage.item.pageTitle', 'Manage')} · {titleName} | Studioz
        </title>
      </Helmet>

      {isLoading && (
        <div className="studio-manage-page__loading">
          {t('manage.item.loading', 'Loading service…')}
        </div>
      )}

      {!!error && (
        <div className="studio-manage-page__error">
          {t('manage.item.loadError', 'Could not load this service.')}
        </div>
      )}

      {!isLoading && !error && item && <ItemManageShell item={item} />}

      {!isLoading && !error && !item && (
        <div className="studio-manage-page__error">
          {t('manage.item.notFound', 'Service not found.')}
        </div>
      )}
    </section>
  );
};

export default ItemManagePage;
