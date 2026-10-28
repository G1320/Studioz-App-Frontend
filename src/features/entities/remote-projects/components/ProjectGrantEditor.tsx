import { useId } from 'react';
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

interface RoleSelectProps {
  value: GrantDraft;
  onChange: (next: GrantDraft) => void;
  disabled?: boolean;
  id?: string;
}

/** Compact access-level picker. Shows "Custom" when the permissions don't match a preset. */
export const RoleSelect: React.FC<RoleSelectProps> = ({ value, onChange, disabled, id }) => {
  const { t } = useTranslation('remoteProjects');
  const role = roleForCapabilities(value.capabilities);

  return (
    <select
      id={id}
      className="project-grant-select"
      value={role}
      onChange={(e) => onChange({ ...value, capabilities: [...ROLE_CAPABILITIES[e.target.value as ProjectRole]] })}
      disabled={disabled}
      aria-label={t('permissions.accessLevel')}
      title={t(`permissions.roles.${role}.description`)}
    >
      {role === 'custom' && (
        <option value="custom" disabled>
          {t('permissions.roles.custom.name')}
        </option>
      )}
      {PROJECT_ROLES.map((preset) => (
        <option key={preset} value={preset}>
          {t(`permissions.roles.${preset}.name`)}
        </option>
      ))}
    </select>
  );
};

interface GrantDetailsProps {
  value: GrantDraft;
  onChange: (next: GrantDraft) => void;
  /** Files available for scoping. The file picker is hidden when there are none. */
  files?: Pick<ProjectFile, '_id' | 'fileName'>[];
  disabled?: boolean;
}

/** Fine-grained permissions and file scope, shown behind "More options". */
export const GrantDetails: React.FC<GrantDetailsProps> = ({ value, onChange, files, disabled }) => {
  const { t } = useTranslation('remoteProjects');
  const idPrefix = useId();
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
    <div className="project-grant-details">
      <fieldset className="project-grant-details__group" disabled={disabled}>
        <legend className="project-grant-details__legend">{t('permissions.capabilitiesTitle')}</legend>
        <div className="project-grant-details__chips">
          {PROJECT_CAPABILITIES.map((capability) => (
            <label
              key={capability}
              className="project-grant-details__chip"
              title={t(`permissions.capabilities.${capability}.description`)}
            >
              <input
                type="checkbox"
                checked={value.capabilities.includes(capability)}
                disabled={capability === 'listen'}
                onChange={() => toggleCapability(capability)}
              />
              <span>{t(`permissions.capabilities.${capability}.name`)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {files && files.length > 0 && (
        <fieldset className="project-grant-details__group" disabled={disabled}>
          <legend className="project-grant-details__legend">{t('permissions.scopeTitle')}</legend>
          <div className="project-grant-details__chips">
            <label className="project-grant-details__chip">
              <input
                type="radio"
                name={`${idPrefix}-scope`}
                checked={!scoped}
                onChange={() => onChange({ ...value, fileIds: [] })}
              />
              <span>{t('permissions.scopeAll')}</span>
            </label>
            <label className="project-grant-details__chip">
              <input
                type="radio"
                name={`${idPrefix}-scope`}
                checked={scoped}
                onChange={() => onChange({ ...value, fileIds: scoped ? value.fileIds : [files[0]._id] })}
              />
              <span>{t('permissions.scopeSelected')}</span>
            </label>
          </div>
          {scoped && (
            <ul className="project-grant-details__files">
              {files.map((file) => (
                <li key={file._id}>
                  <label className="project-grant-details__file">
                    <input
                      type="checkbox"
                      checked={value.fileIds.includes(file._id)}
                      onChange={() => toggleFile(file._id)}
                    />
                    <span title={file.fileName}>{file.fileName}</span>
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
