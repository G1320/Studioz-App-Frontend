import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Item } from 'src/types/index';
import { useToggleItemActiveMutation } from '@shared/hooks/mutations/studios/studioMutations';
import { ITEM_NAME_MAX, ITEM_DESCRIPTION_MAX } from '@shared/constants/fieldLimits';
import { SectionChrome } from '@features/entities/studios/manage/sections/SectionChrome';
import { useItemSectionSave } from '../useItemSectionSave';

interface BasicsSectionProps {
  item: Item;
}

export const BasicsSection = ({ item }: BasicsSectionProps) => {
  const { t, i18n } = useTranslation(['forms', 'common']);
  const [editLang, setEditLang] = useState<'en' | 'he'>(i18n.language?.startsWith('he') ? 'he' : 'en');
  const [name, setName] = useState(item.name || { en: '', he: '' });
  const [description, setDescription] = useState(item.description || { en: '', he: '' });
  const { savePatch, isSaving } = useItemSectionSave(item, item._id);
  const toggleActive = useToggleItemActiveMutation();

  useEffect(() => {
    setName(item.name || { en: '', he: '' });
    setDescription(item.description || { en: '', he: '' });
  }, [item._id, item.name, item.description]);

  const isDirty =
    name.en !== (item.name?.en || '') ||
    name.he !== (item.name?.he || '') ||
    (description.en || '') !== (item.description?.en || '') ||
    (description.he || '') !== (item.description?.he || '');

  const isActive = item.active !== false;

  return (
    <SectionChrome
      title={t('manage.item.sections.basics', 'Basics')}
      subtitle={t('manage.item.basics.subtitle', 'Name, description, and visibility.')}
      isDirty={isDirty}
      isSaving={isSaving}
      onDiscard={() => {
        setName(item.name || { en: '', he: '' });
        setDescription(item.description || { en: '', he: '' });
      }}
      onSave={() =>
        savePatch({
          name: { en: name.en.trim(), he: (name.he || '').trim() },
          description: {
            en: (description.en || '').trim(),
            he: (description.he || '').trim()
          }
        })
      }
      saveDisabled={!name.en.trim()}
    >
      <div className="studio-manage-panel">
        <div className="studio-manage-panel__row">
          <div className="studio-manage-panel__row-copy">
            <span className="studio-manage-label">
              {t('manage.item.basics.status', 'Service status')}
            </span>
            <p className="studio-manage-hint">
              {isActive
                ? t('manage.item.basics.statusActive', 'Visible and bookable.')
                : t('manage.item.basics.statusOffline', 'Hidden from the studio listing.')}
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
                toggleActive.mutate({
                  studioId: item.studioId,
                  itemId: item._id,
                  active: !isActive
                })
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
          <div className="studio-manage-lang-toggle" role="group">
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
            <label className="studio-manage-label" htmlFor="item-manage-name">
              {editLang === 'en' ? t('form.name.en') : t('form.name.he')}
            </label>
            <input
              id="item-manage-name"
              className="studio-manage-input"
              value={name[editLang] || ''}
              maxLength={ITEM_NAME_MAX}
              onChange={(e) => setName((prev) => ({ ...prev, [editLang]: e.target.value }))}
            />
          </div>
          <div className="studio-manage-field">
            <label className="studio-manage-label" htmlFor="item-manage-description">
              {editLang === 'en' ? t('form.description.en') : t('form.description.he')}
            </label>
            <textarea
              id="item-manage-description"
              className="studio-manage-textarea"
              rows={5}
              maxLength={ITEM_DESCRIPTION_MAX}
              value={description[editLang] || ''}
              onChange={(e) =>
                setDescription((prev) => ({ ...prev, [editLang]: e.target.value }))
              }
            />
          </div>
        </div>
      </div>
    </SectionChrome>
  );
};
