import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProjectCapability, ProjectFile, ProjectRole } from 'src/types';
import {
  PROJECT_CAPABILITIES,
  PROJECT_ROLES,
  ROLE_CAPABILITIES,
  canonicalCapabilities,
  roleForCapabilities
} from '../utils/projectPermissions';
import './styles/_project-grant-editor.scss';

export interface GrantDraft {
  capabilities: ProjectCapability[];
  /** Empty = whole project. */
  fileIds: string[];
}

export const grantDraftForRole = (role: ProjectRole): GrantDraft => ({
  capabilities: [...ROLE_CAPABILITIES[role]],
  fileIds: []
});

interface ProjectGrantEditorProps {
  value: GrantDraft;
  onChange: (next: GrantDraft) => void;
  /** Files available for scoping. Scope controls are hidden when omitted. */
  files?: Pick<ProjectFile, '_id' | 'fileName'>[];
  disabled?: boolean;
}

/**
 * Role presets with per-capability overrides and optional file scope.
 * Shared by email invites and share links so both speak the same permission model.
 */
export const ProjectGrantEditor: React.FC<ProjectGrantEditorProps> = ({ value, onChange, files, disabled }) => {
  const { t } = useTranslation('remoteProjects');
  const idPrefix = useId();
  const role = roleForCapabilities(value.capabilities);
  const [advancedOpen, setAdvancedOpen] = useState(role === 'custom');
  const scoped = value.fileIds.length > 0;

  const toggleCapability = (capability: ProjectCapability) => {
    if (capability === 'listen') return;
    const next = new Set(value.capabilities);
    if (next.has(capability)) next.delete(capability);
    else next.add(capability);
    onChange({ ...value, capabilities: canonicalCapabilities(next) });
  };

  const toggleFile = (fileId: string) => {
    const next = value.fileIds.includes(fileId)
      ? value.fileIds.filter((id) => id !== fileId)
      : [...value.fileIds, fileId];
    onChange({ ...value, fileIds: next });
  };

  return (
    <div className="project-grant-editor">
      <fieldset className="project-grant-editor__roles" disabled={disabled}>
        <legend className="project-grant-editor__legend">{t('permissions.accessLevel')}</legend>
        {PROJECT_ROLES.map((preset) => (
          <label
            key={preset}
            className={`project-grant-editor__role${role === preset ? ' project-grant-editor__role--active' : ''}`}
          >
            <input
              type="radio"
              name={`${idPrefix}-role`}
              checked={role === preset}
              onChange={() => onChange({ ...value, capabilities: [...ROLE_CAPABILITIES[preset]] })}
            />
            <span className="project-grant-editor__role-text">
              <span className="project-grant-editor__role-name">{t(`permissions.roles.${preset}.name`)}</span>
              <span className="project-grant-editor__role-desc">{t(`permissions.roles.${preset}.description`)}</span>
            </span>
          </label>
        ))}
        {role === 'custom' && (
          <p className="project-grant-editor__custom-note">{t('permissions.roles.custom.description')}</p>
        )}
      </fieldset>

      <button
        type="button"
        className="project-grant-editor__advanced-toggle"
        onClick={() => setAdvancedOpen((open) => !open)}
        aria-expanded={advancedOpen}
        disabled={disabled}
      >
        {advancedOpen ? t('permissions.hideAdvanced') : t('permissions.showAdvanced')}
      </button>

      {advancedOpen && (
        <fieldset className="project-grant-editor__capabilities" disabled={disabled}>
          <legend className="project-grant-editor__legend">{t('permissions.capabilitiesTitle')}</legend>
          {PROJECT_CAPABILITIES.map((capability) => (
            <label key={capability} className="project-grant-editor__capability">
              <input
                type="checkbox"
                checked={value.capabilities.includes(capability)}
                disabled={capability === 'listen'}
                onChange={() => toggleCapability(capability)}
              />
              <span>
                <span className="project-grant-editor__capability-name">
                  {t(`permissions.capabilities.${capability}.name`)}
                </span>
                <span className="project-grant-editor__capability-desc">
                  {t(`permissions.capabilities.${capability}.description`)}
                </span>
              </span>
            </label>
          ))}
        </fieldset>
      )}

      {files && files.length > 0 && (
        <fieldset className="project-grant-editor__scope" disabled={disabled}>
          <legend className="project-grant-editor__legend">{t('permissions.scopeTitle')}</legend>
          <label className="project-grant-editor__capability">
            <input type="radio" checked={!scoped} onChange={() => onChange({ ...value, fileIds: [] })} />
            <span className="project-grant-editor__capability-name">{t('permissions.scopeAll')}</span>
          </label>
          <label className="project-grant-editor__capability">
            <input
              type="radio"
              checked={scoped}
              onChange={() => onChange({ ...value, fileIds: scoped ? value.fileIds : [files[0]._id] })}
            />
            <span className="project-grant-editor__capability-name">{t('permissions.scopeSelected')}</span>
          </label>
          {scoped && (
            <ul className="project-grant-editor__files">
              {files.map((file) => (
                <li key={file._id}>
                  <label className="project-grant-editor__capability">
                    <input
                      type="checkbox"
                      checked={value.fileIds.includes(file._id)}
                      onChange={() => toggleFile(file._id)}
                    />
                    <span className="project-grant-editor__file-name" title={file.fileName}>
                      {file.fileName}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </fieldset>
      )}
    </div>
  );
};

export default ProjectGrantEditor;
