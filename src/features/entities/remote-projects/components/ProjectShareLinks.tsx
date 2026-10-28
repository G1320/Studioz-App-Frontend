import { useState, type FormEvent } from 'react';
import { Check, Copy, KeyRound, Link2, Link2Off, Loader2, Pause, Pencil, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@shared/components';
import { useProjectFiles } from '@shared/hooks';
import { createShareLink, getShareLinks, revokeShareLink, updateShareLink } from '@shared/services';
import type { ProjectFile, ProjectShareLink, ShareLinkSettingsRequest } from 'src/types';
import { ProjectGrantEditor, grantDraftForRole, type GrantDraft } from './ProjectGrantEditor';
import { capabilitiesRequireLogin } from '../utils/projectPermissions';
import './styles/_project-share-links.scss';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const MAX_EXPIRY_DAYS = 365;
const PRESET_DAYS = [1, 7, 30, 90] as const;
const PASSWORD_MIN_LENGTH = 4;

type ExpiryChoice = 'never' | 'custom' | `${(typeof PRESET_DAYS)[number]}`;

interface ProjectShareLinksProps {
  projectId: string;
}

export function shareLinkUrl(lang: string, token: string): string {
  return `${window.location.origin}/${lang}/projects/share/${token}`;
}

/** `datetime-local` value in the user's timezone. */
function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`;
}

function apiErrorMessage(err: unknown): string | undefined {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
}

interface ShareLinkFormValues {
  grant: GrantDraft;
  settings: ShareLinkSettingsRequest;
}

interface ShareLinkFormProps {
  initial?: ProjectShareLink;
  files: Pick<ProjectFile, '_id' | 'fileName'>[];
  submitting: boolean;
  error: string | null;
  submitLabel: string;
  onSubmit: (values: ShareLinkFormValues) => void;
  onCancel?: () => void;
}

/** Permissions plus link options (label, expiry, password, single use) for creating or editing a link. */
const ShareLinkForm: React.FC<ShareLinkFormProps> = ({
  initial,
  files,
  submitting,
  error,
  submitLabel,
  onSubmit,
  onCancel
}) => {
  const { t } = useTranslation('remoteProjects');
  const [grant, setGrant] = useState<GrantDraft>(() =>
    initial ? { capabilities: initial.capabilities, fileIds: initial.fileIds } : grantDraftForRole('listener')
  );
  const [label, setLabel] = useState(initial?.label ?? '');
  const [expiry, setExpiry] = useState<ExpiryChoice>(initial?.expiresAt ? 'custom' : 'never');
  const [customExpiry, setCustomExpiry] = useState(() =>
    toLocalInputValue(initial?.expiresAt ? new Date(initial.expiresAt) : new Date(Date.now() + 7 * DAY_MS))
  );
  const [passwordEnabled, setPasswordEnabled] = useState(initial?.hasPassword ?? false);
  const [password, setPassword] = useState('');
  const [singleUse, setSingleUse] = useState(initial?.maxJoins === 1);
  const [localError, setLocalError] = useState<string | null>(null);

  const requiresLogin = capabilitiesRequireLogin(grant.capabilities);
  const now = Date.now();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    let expiresAt: string | null = null;
    if (expiry === 'custom') {
      const date = new Date(customExpiry);
      if (Number.isNaN(date.getTime()) || date.getTime() < Date.now() + HOUR_MS) {
        setLocalError(t('shareLinks.expiryTooSoon'));
        return;
      }
      if (date.getTime() > Date.now() + MAX_EXPIRY_DAYS * DAY_MS) {
        setLocalError(t('shareLinks.expiryTooLate', { days: MAX_EXPIRY_DAYS }));
        return;
      }
      expiresAt = date.toISOString();
    } else if (expiry !== 'never') {
      expiresAt = new Date(Date.now() + Number(expiry) * DAY_MS).toISOString();
    }

    const settings: ShareLinkSettingsRequest = {
      label: label.trim() || null,
      maxJoins: requiresLogin && singleUse ? 1 : null
    };
    const expiryChanged =
      !initial ||
      expiry !== 'custom' ||
      !initial.expiresAt ||
      toLocalInputValue(new Date(initial.expiresAt)) !== customExpiry;
    if (expiryChanged) settings.expiresAt = expiresAt;

    if (passwordEnabled) {
      if (password) {
        if (password.length < PASSWORD_MIN_LENGTH) {
          setLocalError(t('shareLinks.passwordTooShort', { count: PASSWORD_MIN_LENGTH }));
          return;
        }
        settings.password = password;
      } else if (!initial?.hasPassword) {
        setLocalError(t('shareLinks.passwordMissing'));
        return;
      }
    } else if (initial?.hasPassword) {
      settings.password = null;
    }

    onSubmit({ grant, settings });
  };

  return (
    <form className="project-share-links__create" onSubmit={submit}>
      <ProjectGrantEditor value={grant} onChange={setGrant} files={files} disabled={submitting} />

      <div className="project-share-links__row">
        <label className="project-share-links__field">
          <span>{t('shareLinks.labelField')}</span>
          <input
            type="text"
            value={label}
            maxLength={80}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={t('shareLinks.labelPlaceholder')}
          />
        </label>
        <label className="project-share-links__field">
          <span>{t('shareLinks.expiry')}</span>
          <select value={expiry} onChange={(e) => setExpiry(e.target.value as ExpiryChoice)}>
            <option value="never">{t('shareLinks.expiryNever')}</option>
            {PRESET_DAYS.map((days) => (
              <option key={days} value={String(days)}>
                {t('shareLinks.expiryDays', { count: days })}
              </option>
            ))}
            <option value="custom">{t('shareLinks.expiryCustom')}</option>
          </select>
        </label>
      </div>

      {expiry === 'custom' && (
        <label className="project-share-links__field">
          <span>{t('shareLinks.expiryCustomLabel')}</span>
          <input
            type="datetime-local"
            value={customExpiry}
            min={toLocalInputValue(new Date(now + HOUR_MS))}
            max={toLocalInputValue(new Date(now + MAX_EXPIRY_DAYS * DAY_MS))}
            onChange={(e) => setCustomExpiry(e.target.value)}
            required
          />
        </label>
      )}

      <div className="project-share-links__options">
        <label className="project-share-links__check">
          <input
            type="checkbox"
            checked={passwordEnabled}
            onChange={(e) => setPasswordEnabled(e.target.checked)}
          />
          <span>{t('shareLinks.passwordToggle')}</span>
        </label>
        {passwordEnabled && (
          <input
            type="password"
            className="project-share-links__password"
            value={password}
            minLength={PASSWORD_MIN_LENGTH}
            maxLength={128}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              initial?.hasPassword ? t('shareLinks.passwordKeepPlaceholder') : t('shareLinks.passwordPlaceholder')
            }
            aria-label={t('shareLinks.passwordPlaceholder')}
            autoComplete="new-password"
          />
        )}
        {requiresLogin && (
          <label className="project-share-links__check">
            <input type="checkbox" checked={singleUse} onChange={(e) => setSingleUse(e.target.checked)} />
            <span>{t('shareLinks.singleUse')}</span>
          </label>
        )}
      </div>

      <p className="project-share-links__login-note">
        {requiresLogin ? t('shareLinks.requiresLoginNote') : t('shareLinks.anonymousNote')}
      </p>

      {localError || error ? <p className="project-collaborators__error">{localError || error}</p> : null}

      <div className="project-share-links__form-actions">
        {onCancel && (
          <Button type="button" className="button--secondary" onClick={onCancel} disabled={submitting}>
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit" className="button--primary" disabled={submitting}>
          {submitting ? t('common.processing') : submitLabel}
        </Button>
      </div>
    </form>
  );
};

function grantRequest(grant: GrantDraft) {
  return { capabilities: grant.capabilities, fileIds: grant.fileIds.length ? grant.fileIds : null };
}

export const ProjectShareLinks: React.FC<ProjectShareLinksProps> = ({ projectId }) => {
  const { t, i18n } = useTranslation('remoteProjects');
  const queryClient = useQueryClient();
  const { files } = useProjectFiles({ projectId });
  const [createError, setCreateError] = useState<string | null>(null);
  const [createKey, setCreateKey] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const queryKey = ['projectShareLinks', projectId];
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => getShareLinks(projectId),
    enabled: !!projectId
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey });
    void queryClient.invalidateQueries({ queryKey: ['projectCollaborators', projectId] });
  };

  const copy = async (link: ProjectShareLink) => {
    try {
      await navigator.clipboard.writeText(shareLinkUrl(i18n.language, link.token));
      setCopiedId(link._id);
      setTimeout(() => setCopiedId((id) => (id === link._id ? null : id)), 2000);
    } catch {
      window.prompt(t('shareLinks.copyPrompt'), shareLinkUrl(i18n.language, link.token));
    }
  };

  const createMutation = useMutation({
    mutationFn: ({ grant, settings }: ShareLinkFormValues) =>
      createShareLink(projectId, {
        ...grantRequest(grant),
        fileIds: grant.fileIds.length ? grant.fileIds : undefined,
        ...settings
      }),
    onSuccess: async ({ shareLink }) => {
      setCreateError(null);
      setCreateKey((k) => k + 1);
      invalidate();
      await copy(shareLink);
    },
    onError: (err: unknown) => setCreateError(apiErrorMessage(err) || t('shareLinks.createFailed'))
  });

  const editMutation = useMutation({
    mutationFn: ({ linkId, values }: { linkId: string; values: ShareLinkFormValues }) =>
      updateShareLink(projectId, linkId, { ...grantRequest(values.grant), ...values.settings }),
    onSuccess: () => {
      setEditingId(null);
      setEditError(null);
      invalidate();
    },
    onError: (err: unknown) => setEditError(apiErrorMessage(err) || t('shareLinks.updateFailed'))
  });

  const pauseMutation = useMutation({
    mutationFn: ({ linkId, active }: { linkId: string; active: boolean }) =>
      updateShareLink(projectId, linkId, { active }),
    onSuccess: invalidate
  });

  const revokeMutation = useMutation({
    mutationFn: (linkId: string) => revokeShareLink(projectId, linkId),
    onSuccess: invalidate
  });

  const handleRevoke = (link: ProjectShareLink) => {
    const message = link.joinCount > 0 ? t('shareLinks.confirmRevokeJoined') : t('shareLinks.confirmRevoke');
    if (confirm(message)) revokeMutation.mutate(link._id);
  };

  const statusText = (link: ProjectShareLink) => {
    switch (link.status) {
      case 'revoked':
        return t('shareLinks.revoked');
      case 'expired':
        return t('shareLinks.expired');
      case 'used':
        return t('shareLinks.used');
      case 'paused':
        return t('shareLinks.paused');
      default:
        return link.expiresAt
          ? t('shareLinks.expiresOn', { date: new Date(link.expiresAt).toLocaleString() })
          : t('shareLinks.expiryNever');
    }
  };

  const links = data?.shareLinks ?? [];

  return (
    <section className="project-share-links" aria-labelledby="project-share-links-title">
      <h4 id="project-share-links-title" className="project-share-links__title">
        <Link2 size={16} aria-hidden /> {t('shareLinks.title')}
      </h4>
      <p className="project-share-links__hint">{t('shareLinks.hint')}</p>

      <ShareLinkForm
        key={createKey}
        files={files}
        submitting={createMutation.isPending}
        error={createError}
        submitLabel={t('shareLinks.create')}
        onSubmit={(values) => createMutation.mutate(values)}
      />

      {isLoading ? (
        <div className="project-collaborators__loading">{t('common.loading')}</div>
      ) : links.length > 0 ? (
        <ul className="project-share-links__list">
          {links.map((link) => {
            const active = link.status === 'active';
            const editable = link.status !== 'revoked';
            if (editingId === link._id) {
              return (
                <li key={link._id} className="project-share-links__item project-share-links__item--editing">
                  <ShareLinkForm
                    initial={link}
                    files={files}
                    submitting={editMutation.isPending}
                    error={editError}
                    submitLabel={t('shareLinks.save')}
                    onSubmit={(values) => editMutation.mutate({ linkId: link._id, values })}
                    onCancel={() => {
                      setEditingId(null);
                      setEditError(null);
                    }}
                  />
                </li>
              );
            }
            return (
              <li
                key={link._id}
                className={`project-share-links__item${active ? '' : ' project-share-links__item--inactive'}`}
              >
                <div className="project-share-links__item-info">
                  <div className="project-share-links__item-name">
                    {link.label || t(`permissions.roles.${link.role}.name`)}
                    {link.hasPassword && (
                      <KeyRound
                        size={12}
                        className="project-share-links__badge-icon"
                        aria-label={t('shareLinks.passwordProtected')}
                      />
                    )}
                  </div>
                  <div className="project-share-links__item-meta">
                    {t(`permissions.roles.${link.role}.name`)}
                    {' · '}
                    {link.fileIds.length
                      ? t('shareLinks.scopeCount', { count: link.fileIds.length })
                      : t('permissions.scopeAll')}
                    {link.maxJoins === 1 ? ` · ${t('shareLinks.singleUseBadge')}` : ''}
                    {' · '}
                    {statusText(link)}
                  </div>
                  <div className="project-share-links__item-meta">
                    {t('shareLinks.stats', { views: link.viewCount, joins: link.joinCount })}
                  </div>
                </div>
                <div className="project-collaborators__item-actions">
                  {active && (
                    <button
                      type="button"
                      className="project-icon-action project-icon-action--round project-icon-action--neutral"
                      onClick={() => copy(link)}
                      aria-label={t('shareLinks.copy')}
                      title={t('shareLinks.copy')}
                    >
                      {copiedId === link._id ? <Check aria-hidden /> : <Copy aria-hidden />}
                    </button>
                  )}
                  {editable && (
                    <button
                      type="button"
                      className="project-icon-action project-icon-action--round project-icon-action--neutral"
                      onClick={() => {
                        setEditError(null);
                        setEditingId(link._id);
                      }}
                      aria-label={t('shareLinks.edit')}
                      title={t('shareLinks.edit')}
                    >
                      <Pencil aria-hidden />
                    </button>
                  )}
                  {(link.status === 'active' || link.status === 'paused') && (
                    <button
                      type="button"
                      className="project-icon-action project-icon-action--round project-icon-action--neutral"
                      onClick={() => pauseMutation.mutate({ linkId: link._id, active: link.status === 'paused' })}
                      disabled={pauseMutation.isPending}
                      aria-label={link.status === 'paused' ? t('shareLinks.resume') : t('shareLinks.pause')}
                      title={link.status === 'paused' ? t('shareLinks.resume') : t('shareLinks.pause')}
                    >
                      {link.status === 'paused' ? <Play aria-hidden /> : <Pause aria-hidden />}
                    </button>
                  )}
                  {editable && (
                    <button
                      type="button"
                      className="project-icon-action project-icon-action--round project-icon-action--danger"
                      onClick={() => handleRevoke(link)}
                      disabled={revokeMutation.isPending}
                      aria-label={t('shareLinks.revoke')}
                      title={t('shareLinks.revoke')}
                    >
                      {revokeMutation.isPending && revokeMutation.variables === link._id ? (
                        <Loader2 className="project-icon-action__spin" aria-hidden />
                      ) : (
                        <Link2Off aria-hidden />
                      )}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="project-share-links__empty">{t('shareLinks.empty')}</p>
      )}
    </section>
  );
};

export default ProjectShareLinks;
