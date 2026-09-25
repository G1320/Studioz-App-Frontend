import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks';
import {
  ArrowBackIcon,
  ExternalLinkIcon
} from '@shared/components/icons';
import { Studio } from 'src/types/index';
import {
  DEFAULT_STUDIO_MANAGE_SECTION,
  parseStudioManageSection,
  STUDIO_MANAGE_SECTIONS,
  StudioManageSectionId
} from './constants';
import { OverviewSection } from './sections/OverviewSection';
import { MediaSection } from './sections/MediaSection';
import { HoursSection } from './sections/HoursSection';
import { LegacySectionBridge } from './sections/LegacySectionBridge';
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

  const setSection = (id: StudioManageSectionId) => {
    setSearchParams(
      id === DEFAULT_STUDIO_MANAGE_SECTION ? {} : { section: id },
      { replace: true }
    );
    setMobileNavOpen(false);
  };

  const renderSection = () => {
    if (!activeSection.ready) {
      return <LegacySectionBridge studioId={studio._id} section={activeSection} />;
    }
    switch (activeSection.id) {
      case 'overview':
        return <OverviewSection studio={studio} />;
      case 'media':
        return <MediaSection studio={studio} />;
      case 'hours':
        return <HoursSection studio={studio} />;
      default:
        return <LegacySectionBridge studioId={studio._id} section={activeSection} />;
    }
  };

  return (
    <div className={`studio-manage ${mobileNavOpen ? 'studio-manage--nav-open' : ''}`}>
      <aside className="studio-manage__sidebar" aria-label="Studio sections">
        <div className="studio-manage__sidebar-head">
          <button
            type="button"
            className="studio-manage-btn studio-manage-btn--ghost studio-manage-btn--icon"
            onClick={() => langNavigate('/dashboard')}
          >
            <ArrowBackIcon fontSize="small" />
            <span>{t('buttons.back', { ns: 'common', defaultValue: 'Back' })}</span>
          </button>
          <p className="studio-manage__studio-name" title={displayName}>
            {displayName}
          </p>
          <span className={`studio-manage-status-pill ${isActive ? 'is-active' : 'is-offline'}`}>
            {isActive
              ? t('manage.overview.active', 'Active')
              : t('manage.overview.offline', 'Offline')}
          </span>
        </div>

        <nav className="studio-manage__nav">
          {STUDIO_MANAGE_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isCurrent = section.id === activeSection.id;
            return (
              <button
                key={section.id}
                type="button"
                className={`studio-manage__nav-item ${isCurrent ? 'is-active' : ''} ${
                  section.ready ? '' : 'is-pending'
                }`}
                onClick={() => setSection(section.id)}
              >
                <Icon fontSize="small" />
                <span>{t(section.labelKey, section.defaultLabel)}</span>
              </button>
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
          <div className="studio-manage__topbar-title">
            <span className="studio-manage__topbar-name">{displayName}</span>
            <span className="studio-manage__topbar-section">
              {t(activeSection.labelKey, activeSection.defaultLabel)}
            </span>
          </div>
          <div className="studio-manage__topbar-actions">
            <a
              className="studio-manage-btn studio-manage-btn--ghost studio-manage-btn--icon"
              href={`/${i18n.language || 'en'}/studio/${studio._id}`}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLinkIcon fontSize="small" />
              <span>{t('manage.preview', 'Preview')}</span>
            </a>
          </div>
        </header>

        <div className="studio-manage__content">{renderSection()}</div>
      </div>
    </div>
  );
};
