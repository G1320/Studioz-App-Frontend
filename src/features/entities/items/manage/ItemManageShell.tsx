import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks';
import { isFeatureEnabled } from '@core/config/featureFlags';
import { ArrowBackIcon, ExternalLinkIcon } from '@shared/components/icons';
import { Item } from 'src/types/index';
import {
  DEFAULT_ITEM_MANAGE_SECTION,
  ITEM_MANAGE_SECTIONS,
  ItemManageSectionId,
  parseItemManageSection
} from './constants';
import { BasicsSection } from './sections/BasicsSection';
import { ClassificationSection } from './sections/ClassificationSection';
import { DeliverySection } from './sections/DeliverySection';
import { PricingSection } from './sections/PricingSection';
import { BookingSection } from './sections/BookingSection';
import { AddonsSection } from './sections/AddonsSection';
import '@features/entities/studios/manage/styles/_studio-manage.scss';
import '@features/entities/items/forms/_createItemForm.scss';
import './styles/_item-manage.scss';

interface ItemManageShellProps {
  item: Item;
}

export const ItemManageShell = ({ item }: ItemManageShellProps) => {
  const { t, i18n } = useTranslation(['forms', 'common']);
  const langNavigate = useLanguageNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isRemote =
    item.serviceDeliveryType === 'remote' ||
    (item as Item & { remoteService?: boolean }).remoteService === true;
  const isActive = item.active !== false;

  const visibleSections = useMemo(
    () =>
      ITEM_MANAGE_SECTIONS.filter((section) => {
        if (section.inStudioOnly && isRemote) return false;
        if (section.featureFlag && !isFeatureEnabled(section.featureFlag)) return false;
        return true;
      }),
    [isRemote]
  );

  const sectionId = parseItemManageSection(searchParams.get('section'));
  const activeSection =
    visibleSections.find((s) => s.id === sectionId) || visibleSections[0] || ITEM_MANAGE_SECTIONS[0];

  const displayName = useMemo(() => {
    const lang = (i18n.language?.startsWith('he') ? 'he' : 'en') as 'en' | 'he';
    return item.name?.[lang] || item.name?.en || item.name?.he || 'Service';
  }, [item.name, i18n.language]);

  const shortId = item._id?.slice(-6)?.toUpperCase() || '';

  const setSection = (id: ItemManageSectionId) => {
    setSearchParams(
      id === DEFAULT_ITEM_MANAGE_SECTION ? {} : { section: id },
      { replace: true }
    );
    setMobileNavOpen(false);
  };

  const renderSection = () => {
    switch (activeSection.id) {
      case 'basics':
        return <BasicsSection item={item} />;
      case 'classification':
        return <ClassificationSection item={item} />;
      case 'delivery':
        return <DeliverySection item={item} />;
      case 'pricing':
        return <PricingSection item={item} />;
      case 'booking':
        return <BookingSection item={item} />;
      case 'addons':
        return <AddonsSection item={item} />;
      default:
        return <BasicsSection item={item} />;
    }
  };

  return (
    <div className={`studio-manage item-manage ${mobileNavOpen ? 'studio-manage--nav-open' : ''}`}>
      <aside className="studio-manage__sidebar" aria-label="Service sections">
        <div className="studio-manage__sidebar-head">
          <button
            type="button"
            className="studio-manage__back"
            onClick={() =>
              langNavigate(`/studio/${item.studioId}/manage?section=services`)
            }
          >
            <ArrowBackIcon fontSize="inherit" />
            <span>{t('manage.item.backToServices', 'Services')}</span>
          </button>

          <div className="studio-manage__entity">
            <span className="studio-manage__entity-kicker">
              {t('manage.item.entityKicker', 'Service listing')}
            </span>
            <p className="studio-manage__studio-name" title={displayName}>
              {displayName}
            </p>
            <div className="studio-manage__entity-meta">
              <span className={`studio-manage-status-pill ${isActive ? 'is-active' : 'is-offline'}`}>
                {isActive
                  ? t('manage.overview.active', 'Active')
                  : t('manage.overview.offline', 'Offline')}
              </span>
              <span className="studio-manage-table__badge">
                {isRemote
                  ? t('manage.services.remote', 'Remote')
                  : t('manage.services.inStudio', 'In-studio')}
              </span>
              {shortId && <span className="studio-manage__entity-id">ID · {shortId}</span>}
            </div>
          </div>
        </div>

        <nav className="studio-manage__nav">
          <div className="studio-manage__nav-group">
            <p className="studio-manage__nav-label">
              {t('manage.item.nav.service', 'Service')}
            </p>
            {visibleSections.map((section) => {
              const Icon = section.icon;
              const isCurrent = section.id === activeSection.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  className={`studio-manage__nav-item ${isCurrent ? 'is-active' : ''}`}
                  onClick={() => setSection(section.id)}
                >
                  <Icon fontSize="inherit" className="studio-manage__nav-icon" />
                  <span>{t(section.labelKey, section.defaultLabel)}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      {mobileNavOpen && (
        <button
          type="button"
          className="studio-manage__backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <div className="studio-manage__main">
        <header className="studio-manage__topbar">
          <button
            type="button"
            className="studio-manage-btn studio-manage-btn--ghost studio-manage-btn--icon studio-manage__menu-btn"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open sections"
          >
            <span className="studio-manage__hamburger" aria-hidden />
          </button>

          <nav className="studio-manage__crumb" aria-label="Breadcrumb">
            <button
              type="button"
              onClick={() =>
                langNavigate(`/studio/${item.studioId}/manage?section=services`)
              }
            >
              {t('manage.item.crumb.services', 'Services')}
            </button>
            <span className="studio-manage__crumb-sep" aria-hidden>
              /
            </span>
            <span className="studio-manage__crumb-current" title={displayName}>
              {displayName}
            </span>
            <span className="studio-manage__crumb-sep" aria-hidden>
              /
            </span>
            <span className="studio-manage__crumb-section">
              {t(activeSection.labelKey, activeSection.defaultLabel)}
            </span>
          </nav>

          <div className="studio-manage__topbar-actions">
            <a
              className="studio-manage-btn studio-manage-btn--ghost studio-manage-btn--compact"
              href={`/${i18n.language || 'en'}/studio/${item.studioId}?item=${item._id}`}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLinkIcon fontSize="inherit" />
              <span>{t('manage.preview', 'Preview')}</span>
            </a>
          </div>
        </header>

        <div className="studio-manage__content">{renderSection()}</div>
      </div>
    </div>
  );
};
