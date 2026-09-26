import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useItems, useLanguageNavigate } from '@shared/hooks';
import { useToggleItemActiveMutation } from '@shared/hooks/mutations/studios/studioMutations';
import { AddIcon, EditIcon, ExternalLinkIcon } from '@shared/components/icons';
import { Studio } from 'src/types/index';
import Item from 'src/types/item';

interface ServicesSectionProps {
  studio: Studio;
}

export const ServicesSection = ({ studio }: ServicesSectionProps) => {
  const { t, i18n } = useTranslation(['forms', 'common']);
  const langNavigate = useLanguageNavigate();
  const { data: allItems = [] } = useItems();
  const toggleItem = useToggleItemActiveMutation();

  const lang = (i18n.language?.startsWith('he') ? 'he' : 'en') as 'en' | 'he';

  const itemsMap = useMemo(() => {
    const map = new Map<string, Item>();
    allItems.forEach((item) => {
      if (item._id) map.set(String(item._id), item);
    });
    return map;
  }, [allItems]);

  const pricePerLabel = (unit: string) => {
    const key = `form.pricing.per.${unit}`;
    const translated = t(key);
    if (translated !== key) {
      // Keys are like "/ project" — strip leading slash; cell already has "/ "
      return translated.replace(/^\s*\/\s*/, '');
    }
    return unit;
  };

  const rows = useMemo(() => {
    return (studio.items || []).map((studioItem) => {
      const itemId = String(studioItem.itemId || studioItem._id || '');
      const full = itemsMap.get(itemId);
      const name =
        full?.name?.[lang] ||
        full?.name?.en ||
        studioItem.name?.[lang] ||
        studioItem.name?.en ||
        studioItem.subCategories?.[0] ||
        studioItem.categories?.[0] ||
        t('manage.services.untitled', 'Untitled service');

      const isRemote =
        full?.serviceDeliveryType === 'remote' ||
        full?.remoteService === true ||
        full?.pricePer === 'project' ||
        full?.pricePer === 'song';

      const price = isRemote
        ? (full?.projectPricing?.basePrice ?? full?.price ?? studioItem.price)
        : (full?.price ?? studioItem.price);

      const pricePer = isRemote
        ? full?.pricePer === 'song'
          ? 'song'
          : 'project'
        : full?.pricePer || 'hour';

      // Prefer embedded studio item status — useItems() can lag behind the toggle PATCH.
      const active = studioItem.active !== false;
      const specialties =
        full?.subCategories?.filter(Boolean) ||
        studioItem.subCategories?.filter(Boolean) ||
        [];
      const category =
        (specialties.length > 0 ? specialties.join(', ') : null) ||
        full?.categories?.[0] ||
        studioItem.categories?.[0] ||
        '—';
      const delivery = isRemote
        ? t('manage.services.remote', 'Remote')
        : t('manage.services.inStudio', 'In-studio');

      return { itemId, name, price, pricePer, active, category, delivery };
    });
  }, [studio.items, itemsMap, lang, t]);

  const togglingId = toggleItem.isPending
    ? (toggleItem.variables as { itemId?: string } | undefined)?.itemId
    : undefined;

  return (
    <div className="studio-manage-section studio-manage-section--wide">
      <header className="studio-manage-section__header">
        <div>
          <h2 className="studio-manage-section__title">
            {t('manage.sections.services', 'Services')}
          </h2>
          <p className="studio-manage-section__subtitle">
            {t('manage.services.subtitle', 'Toggle availability, open a service to edit details.')}
          </p>
        </div>
        <div className="studio-manage-section__actions">
          <button
            type="button"
            className="studio-manage-btn studio-manage-btn--primary studio-manage-btn--compact"
            onClick={() => langNavigate(`/studio/${studio._id}/items/create`)}
          >
            <AddIcon fontSize="inherit" />
            {t('manage.services.add', 'Add service')}
          </button>
        </div>
      </header>

      <div className="studio-manage-panel">
        {rows.length === 0 ? (
          <div className="studio-manage-empty">
            <p>{t('manage.services.empty', 'No services on this studio yet.')}</p>
            <button
              type="button"
              className="studio-manage-btn studio-manage-btn--ghost studio-manage-btn--compact"
              onClick={() => langNavigate(`/studio/${studio._id}/items/create`)}
            >
              {t('manage.services.addFirst', 'Create first service')}
            </button>
          </div>
        ) : (
          <div className="studio-manage-table-wrap">
            <table className="studio-manage-table">
              <thead>
                <tr>
                  <th>{t('manage.services.colName', 'Name')}</th>
                  <th>{t('manage.services.colCategory', 'Category')}</th>
                  <th>{t('manage.services.colType', 'Type')}</th>
                  <th>{t('manage.services.colPrice', 'Price')}</th>
                  <th>{t('manage.services.colStatus', 'Status')}</th>
                  <th aria-label={t('manage.services.colActions', 'Actions')} />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.itemId} className={!row.active ? 'is-offline' : undefined}>
                    <td>
                      <button
                        type="button"
                        className="studio-manage-table__link"
                        onClick={() => langNavigate(`/item/${row.itemId}/manage`)}
                      >
                        {row.name}
                      </button>
                    </td>
                    <td>
                      <span className="studio-manage-table__muted">{row.category}</span>
                    </td>
                    <td>
                      <span className="studio-manage-table__badge">{row.delivery}</span>
                    </td>
                    <td>
                      <div className="studio-manage-price-cell">
                        <span className="studio-manage-price-cell__currency">₪</span>
                        <button
                          type="button"
                          className="studio-manage-input studio-manage-input--price"
                          title={t(
                            'manage.services.priceHint',
                            'Open the service editor to change pricing'
                          )}
                          onClick={() =>
                            langNavigate(`/item/${row.itemId}/manage?section=pricing`)
                          }
                        >
                          {row.price != null && row.price > 0 ? row.price : '—'}
                        </button>
                        <span className="studio-manage-table__muted">
                          / {pricePerLabel(row.pricePer)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="studio-manage-status-control">
                        <span
                          className={`studio-manage-status-pill ${
                            row.active ? 'is-active' : 'is-offline'
                          }`}
                        >
                          {row.active
                            ? t('manage.overview.active', 'Active')
                            : t('manage.overview.offline', 'Offline')}
                        </span>
                        <button
                          type="button"
                          className={`studio-manage-toggle ${row.active ? 'is-on' : ''}`}
                          aria-pressed={row.active}
                          disabled={togglingId === row.itemId}
                          onClick={() =>
                            toggleItem.mutate({
                              studioId: studio._id,
                              itemId: row.itemId,
                              active: !row.active
                            })
                          }
                        >
                          <span className="studio-manage-toggle__thumb" />
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="studio-manage-table__actions">
                        <button
                          type="button"
                          className="studio-manage-btn studio-manage-btn--ghost studio-manage-btn--icon studio-manage-btn--compact"
                          title={t('manage.services.edit', 'Edit')}
                          onClick={() => langNavigate(`/item/${row.itemId}/manage`)}
                        >
                          <EditIcon fontSize="inherit" />
                        </button>
                        <a
                          className="studio-manage-btn studio-manage-btn--ghost studio-manage-btn--icon studio-manage-btn--compact"
                          href={`/${i18n.language || 'en'}/studio/${studio._id}?item=${row.itemId}`}
                          target="_blank"
                          rel="noreferrer"
                          title={t('manage.services.view', 'Preview')}
                        >
                          <ExternalLinkIcon fontSize="inherit" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
