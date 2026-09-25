import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Studio } from 'src/types/index';
import { useToggleStudioActiveMutation } from '@shared/hooks/mutations/studios/studioMutations';
import { STUDIO_NAME_MAX, STUDIO_DESCRIPTION_MAX } from '@shared/constants/fieldLimits';
import { useStudioSectionSave } from '../useStudioSectionSave';

interface OverviewSectionProps {
  studio: Studio;
}

export const OverviewSection = ({ studio }: OverviewSectionProps) => {
  const { t, i18n } = useTranslation(['forms', 'common']);
  const [editLang, setEditLang] = useState<'en' | 'he'>(i18n.language?.startsWith('he') ? 'he' : 'en');
  const [name, setName] = useState(studio.name || { en: '', he: '' });
  const [description, setDescription] = useState(studio.description || { en: '', he: '' });
  const { savePatch, isSaving } = useStudioSectionSave(studio, studio._id);
  const toggleActive = useToggleStudioActiveMutation();

  useEffect(() => {
    setName(studio.name || { en: '', he: '' });
    setDescription(studio.description || { en: '', he: '' });
  }, [studio._id, studio.name, studio.description]);

  const isDirty =
    name.en !== (studio.name?.en || '') ||
    name.he !== (studio.name?.he || '') ||
    (description.en || '') !== (studio.description?.en || '') ||
    (description.he || '') !== (studio.description?.he || '');

  const isActive = studio.active !== false;

  const handleDiscard = () => {
    setName(studio.name || { en: '', he: '' });
    setDescription(studio.description || { en: '', he: '' });
  };

  const handleSave = () => {
    savePatch({
      name: { en: name.en.trim(), he: name.he.trim() },
      description: {
        en: (description.en || '').trim(),
        he: (description.he || '').trim()
      }
    });
  };

  return (
    <div className="studio-manage-section">
      <header className="studio-manage-section__header">
        <div>
          <h2 className="studio-manage-section__title">
            {t('manage.sections.overview', 'Overview')}
          </h2>
          <p className="studio-manage-section__subtitle">
            {t('manage.overview.subtitle', 'Identity and visibility for this listing.')}
          </p>
        </div>
        <div className="studio-manage-section__actions">
          <button
            type="button"
            className="studio-manage-btn studio-manage-btn--ghost studio-manage-btn--compact"
            onClick={handleDiscard}
            disabled={!isDirty || isSaving}
          >
            {t('common:buttons.discard', 'Discard')}
          </button>
          <button
            type="button"
            className="studio-manage-btn studio-manage-btn--primary studio-manage-btn--compact"
            onClick={handleSave}
            disabled={!isDirty || isSaving || !name.en.trim()}
          >
            {isSaving
              ? t('common:buttons.saving', 'Saving…')
              : t('common:buttons.save', 'Save')}
          </button>
        </div>
      </header>

      <div className="studio-manage-panel">
        <div className="studio-manage-panel__row">
          <div className="studio-manage-panel__row-copy">
            <span className="studio-manage-label">
              {t('manage.overview.status', 'Listing status')}
            </span>
            <p className="studio-manage-hint">
              {isActive
                ? t('manage.overview.statusActiveHint', 'Visible and bookable.')
                : t('manage.overview.statusOfflineHint', 'Hidden from search.')}
            </p>
          </div>
          <div className="studio-manage-status-control">
            <span className={`studio-manage-status-pill ${isActive ? 'is-active' : 'is-offline'}`}>
              {isActive
                ? t('manage.overview.active', 'Active')
                : t('manage.overview.offline', 'Offline')}
            </span>
            <button
              type="button"
              className={`studio-manage-toggle ${isActive ? 'is-on' : ''}`}
              aria-pressed={isActive}
              disabled={toggleActive.isPending}
              onClick={() =>
                toggleActive.mutate({ studioId: studio._id, active: !isActive })
              }
            >
              <span className="studio-manage-toggle__thumb" />
            </button>
          </div>
        </div>

        <div className="studio-manage-panel__toolbar">
          <span className="studio-manage-label studio-manage-label--inline">
            {t('manage.overview.copyLang', 'Copy language')}
          </span>
          <div className="studio-manage-lang-toggle" role="group" aria-label="Edit language">
            {(['en', 'he'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                className={`studio-manage-lang-toggle__btn ${editLang === lang ? 'is-active' : ''}`}
                onClick={() => setEditLang(lang)}
              >
                {lang === 'en' ? 'EN' : 'HE'}
              </button>
            ))}
          </div>
        </div>

        <div className="studio-manage-panel__body">
          <div className="studio-manage-field">
            <label className="studio-manage-label" htmlFor="studio-manage-name">
              {editLang === 'en' ? t('form.name.en') : t('form.name.he')}
            </label>
            <input
              id="studio-manage-name"
              className="studio-manage-input"
              value={name[editLang] || ''}
              maxLength={STUDIO_NAME_MAX}
              onChange={(e) => setName((prev) => ({ ...prev, [editLang]: e.target.value }))}
            />
          </div>

          <div className="studio-manage-field">
            <label className="studio-manage-label" htmlFor="studio-manage-description">
              {editLang === 'en' ? t('form.description.en') : t('form.description.he')}
            </label>
            <textarea
              id="studio-manage-description"
              className="studio-manage-textarea"
              rows={5}
              maxLength={STUDIO_DESCRIPTION_MAX}
              value={description[editLang] || ''}
              onChange={(e) =>
                setDescription((prev) => ({ ...prev, [editLang]: e.target.value }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
