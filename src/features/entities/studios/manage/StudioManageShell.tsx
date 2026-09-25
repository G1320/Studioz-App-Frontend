import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks';
import { ArrowBackIcon, ExternalLinkIcon } from '@shared/components/icons';
import { Studio } from 'src/types/index';
import {
  DEFAULT_STUDIO_MANAGE_SECTION,
  parseStudioManageSection,
  STUDIO_MANAGE_NAV_GROUPS,
  STUDIO_MANAGE_SECTIONS,
  StudioManageSectionId
} from './constants';
import { OverviewSection } from './sections/OverviewSection';
import { MediaSection } from './sections/MediaSection';
import { HoursSection } from './sections/HoursSection';
import { LocationSection } from './sections/LocationSection';
import { AmenitiesSection } from './sections/AmenitiesSection';
import { PoliciesSection } from './sections/PoliciesSection';
import { PortfolioSection } from './sections/PortfolioSection';
import { ServicesSection } from './sections/ServicesSection';
import './styles/_studio-manage.scss';

interface StudioManageShellProps {
  studio: Studio;
}

export const StudioManageShell = ({ studio }: StudioManageShellProps) => {
  const { t, i18n } = useTranslation(['forms', 'common']);
  const langNavigate = useLanguageNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const sectionId = parseStudioManageSection(searchParams.get('section'));
  const activeSection =
    STUDIO_MANAGE_SECTIONS.find((s) => s.id === sectionId) || STUDIO_MANAGE_SECTIONS[0];

  const displayName = useMemo(() => {
    const lang = (i18n.language?.startsWith('he') ? 'he' : 'en') as 'en' | 'he';
    return studio.name?.[lang] || studio.name?.en || studio.name?.he || 'Studio';
  }, [studio.name, i18n.language]);

  const isActive = studio.active !== false;
  const shortId = studio._id?.slice(-6)?.toUpperCase() || '';

  const setSection = (id: StudioManageSectionId) => {
    setSearchParams(
      id === DEFAULT_STUDIO_MANAGE_SECTION ? {} : { section: id },
      { replace: true }
    );
    setMobileNavOpen(false);
  };

  const renderSection = () => {
    switch (activeSection.id) {
      case 'overview':
        return <OverviewSection studio={studio} />;
      case 'media':
        return <MediaSection studio={studio} />;
      case 'hours':
        return <HoursSection studio={studio} />;
      case 'location':
        return <LocationSection studio={studio} />;
      case 'amenities':
        return <AmenitiesSection studio={studio} />;
      case 'policies':
        return <PoliciesSection studio={studio} />;
      case 'portfolio':
        return <PortfolioSection studio={studio} />;
      case 'services':
        return <ServicesSection studio={studio} />;
      default:
        return <OverviewSection studio={studio} />;
    }
  };

  return (
    <div className={`studio-manage ${mobileNavOpen ? 'studio-manage--nav-open' : ''}`}>
      <aside className="studio-manage__sidebar" aria-label="Studio sections">
        <div className="studio-manage__sidebar-head">
          <button
            type="button"
            className="studio-manage__back"
            onClick={() => langNavigate('/dashboard')}
          >
            <ArrowBackIcon fontSize="inherit" />
            <span>{t('common:buttons.back', 'Dashboard')}</span>
          </button>

          <div className="studio-manage__entity">
            <span className="studio-manage__entity-kicker">
              {t('manage.entityKicker', 'Studio listing')}
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
              {shortId && <span className="studio-manage__entity-id">ID · {shortId}</span>}
            </div>
          </div>
        </div>

        <nav className="studio-manage__nav">
          {STUDIO_MANAGE_NAV_GROUPS.map((group) => {
            const items = STUDIO_MANAGE_SECTIONS.filter((s) => s.group === group.id);
            if (!items.length) return null;
            return (
              <div key={group.id} className="studio-manage__nav-group">
                <p className="studio-manage__nav-label">
                  {t(group.labelKey, group.defaultLabel)}
                </p>
                {items.map((section) => {
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
            );
          })}
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
            <button type="button" onClick={() => langNavigate('/dashboard')}>
              {t('manage.crumb.dashboard', 'Dashboard')}
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
              href={`/${i18n.language || 'en'}/studio/${studio._id}`}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLinkIcon fontSize="inherit" />
              <span>{t('manage.preview', 'Preview')}</span>
            </a>
          </div>
        </header>

        <div
          className={`studio-manage__content ${
            activeSection.id === 'services' ? 'studio-manage__content--wide' : ''
          }`}
        >
          {renderSection()}
        </div>
      </div>
    </div>
  );
};
