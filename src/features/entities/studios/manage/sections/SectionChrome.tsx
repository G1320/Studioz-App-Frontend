import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface SectionChromeProps {
  title: string;
  subtitle?: string;
  isDirty: boolean;
  isSaving: boolean;
  onDiscard: () => void;
  onSave: () => void;
  saveDisabled?: boolean;
  children: ReactNode;
  /** Wider content for tables */
  wide?: boolean;
}

export const SectionChrome = ({
  title,
  subtitle,
  isDirty,
  isSaving,
  onDiscard,
  onSave,
  saveDisabled,
  children,
  wide
}: SectionChromeProps) => {
  const { t } = useTranslation('common');

  return (
    <div className={`studio-manage-section ${wide ? 'studio-manage-section--wide' : ''}`}>
      <header className="studio-manage-section__header">
        <div>
          <h2 className="studio-manage-section__title">{title}</h2>
          {subtitle && <p className="studio-manage-section__subtitle">{subtitle}</p>}
        </div>
        <div className="studio-manage-section__actions">
          <button
            type="button"
            className="studio-manage-btn studio-manage-btn--ghost studio-manage-btn--compact"
            onClick={onDiscard}
            disabled={!isDirty || isSaving}
          >
            {t('buttons.discard', 'Discard')}
          </button>
          <button
            type="button"
            className="studio-manage-btn studio-manage-btn--primary studio-manage-btn--compact"
            onClick={onSave}
            disabled={!isDirty || isSaving || saveDisabled}
          >
            {isSaving ? t('buttons.saving', 'Saving…') : t('buttons.save', 'Save')}
          </button>
        </div>
      </header>
      {children}
    </div>
  );
};
