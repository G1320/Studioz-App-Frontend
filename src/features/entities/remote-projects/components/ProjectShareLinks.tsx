import { useState, type FormEvent } from 'react';
import { Check, ChevronDown, Copy, KeyRound, Pencil, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@shared/components';
import { useProjectFiles } from '@shared/hooks';
import { createShareLink, getShareLinks, revokeShareLink, updateShareLink } from '@shared/services';
import type { ProjectFile, ProjectShareLink, ShareLinkSettingsRequest } from 'src/types';
import { GrantDetails, RoleSelect, grantDraftForRole, type GrantDraft } from './ProjectGrantEditor';
import { capabilitiesRequireLogin, roleForCapabilities } from '../utils/projectPermissions';
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
  onCancel: () => void;
  /** Edit-only actions (pause/resume, revoke). */
  extraActions?: React.ReactNode;
}

const ShareLinkForm: React.FC<ShareLinkFormProps> = ({
  initial,
  files,
  submitting,
  error,
  submitLabel,
  onSubmit,
  onCancel,
  extraActions
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
  const [moreOpen, setMoreOpen] = useState(
    () =>
      Boolean(initial) &&
      Boolean(
        initial!.label ||
          initial!.hasPassword ||
          initial!.maxJoins === 1 ||
          initial!.fileIds.length ||
          roleForCapabilities(initial!.capabilities) === 'custom'
      )
  );

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
    <form className="project-share-links__form" onSubmit={submit}>
      <div className="project-share-links__row">
        <RoleSelect value={grant} onChange={setGrant} disabled={submitting} />
        <select
          className="project-share-links__select"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value as ExpiryChoice)}
          aria-label={t('shareLinks.expiry')}
          disabled={submitting}
        >
          <option value="never">{t('shareLinks.expiryNever')}</option>
          {PRESET_DAYS.map((days) => (
            <option key={days} value={String(days)}>
              {t('shareLinks.expiryDays', { count: days })}
            </option>
          ))}
          <option value="custom">{t('shareLinks.expiryCustom')}</option>
        </select>
      </div>

      {expiry === 'custom' && (
        <input
          type="datetime-local"
          className="project-share-links__input"
          value={customExpiry}
          min={toLocalInputValue(new Date(now + HOUR_MS))}
          max={toLocalInputValue(new Date(now + MAX_EXPIRY_DAYS * DAY_MS))}
          onChange={(e) => setCustomExpiry(e.target.value)}
          aria-label={t('shareLinks.expiryCustomLabel')}
          required
        />
      )}

      <p className="project-share-links__note">
        {requiresLogin ? t('shareLinks.requiresLoginNote') : t('shareLinks.anonymousNote')}
      </p>

      <button
        type="button"
        className="project-share-links__more"
        onClick={() => setMoreOpen((open) => !open)}
        aria-expanded={moreOpen}
      >
        {moreOpen ? t('permissions.fewerOptions') : t('permissions.moreOptions')}
        <ChevronDown size={14} aria-hidden className={moreOpen ? 'is-open' : undefined} />
      </button>

      {moreOpen && (
        <div className="project-share-links__more-panel">
          <input
            type="text"
            className="project-share-links__input"
            value={label}
            maxLength={80}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={t('shareLinks.labelPlaceholder')}
            aria-label={t('shareLinks.labelField')}
          />
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
              className="project-share-links__input"
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
          <GrantDetails value={grant} onChange={setGrant} files={files} disabled={submitting} />
        </div>
      )}

      {localError || error ? <p className="project-collaborators__error">{localError || error}</p> : null}

      <div className="project-share-links__form-actions">
        {extraActions ? <div className="project-share-links__extra-actions">{extraActions}</div> : null}
        <Button type="button" className="button--secondary" onClick={onCancel} disabled={submitting}>
          {t('common.cancel')}
        </Button>
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
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
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

  const closeEditor = () => {
    setEditingId(null);
    setEditError(null);
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
      setCreating(false);
      invalidate();
      await copy(shareLink);
    },
    onError: (err: unknown) => setCreateError(apiErrorMessage(err) || t('shareLinks.createFailed'))
  });

  const editMutation = useMutation({
    mutationFn: ({ linkId, values }: { linkId: string; values: ShareLinkFormValues }) =>
      updateShareLink(projectId, linkId, { ...grantRequest(values.grant), ...values.settings }),
    onSuccess: () => {
      closeEditor();
      invalidate();
    },
    onError: (err: unknown) => setEditError(apiErrorMessage(err) || t('shareLinks.updateFailed'))
  });

  const pauseMutation = useMutation({
    mutationFn: ({ linkId, active }: { linkId: string; active: boolean }) =>
      updateShareLink(projectId, linkId, { active }),
    onSuccess: () => {
      closeEditor();
      invalidate();
    },
    onError: (err: unknown) => setEditError(apiErrorMessage(err) || t('shareLinks.updateFailed'))
  });

  const revokeMutation = useMutation({
    mutationFn: (linkId: string) => revokeShareLink(projectId, linkId),
    onSuccess: () => {
      closeEditor();
      invalidate();
    },
    onError: (err: unknown) => setEditError(apiErrorMessage(err) || t('shareLinks.updateFailed'))
  });

  const handleRevoke = (link: ProjectShareLink) => {
    const message = link.joinCount > 0 ? t('shareLinks.confirmRevokeJoined') : t('shareLinks.confirmRevoke');
    if (confirm(message)) revokeMutation.mutate(link._id);
  };

  const statusText = (link: ProjectShareLink) => {
    switch (link.status) {
      case 'expired':
        return t('shareLinks.expired');
      case 'used':
        return t('shareLinks.used');
      case 'paused':
        return t('shareLinks.paused');
      default:
        return link.expiresAt
          ? t('shareLinks.expiresOn', { date: new Date(link.expiresAt).toLocaleDateString() })
          : t('shareLinks.expiryNever');
    }
  };

  const links = (data?.shareLinks ?? []).filter((link) => link.status !== 'revoked');
  const busy = pauseMutation.isPending || revokeMutation.isPending;

  return (
    <section className="project-share-links" aria-label={t('shareLinks.title')}>
      {creating ? (
        <ShareLinkForm
          files={files}
          submitting={createMutation.isPending}
          error={createError}
          submitLabel={t('shareLinks.create')}
          onSubmit={(values) => createMutation.mutate(values)}
          onCancel={() => {
            setCreating(false);
            setCreateError(null);
          }}
        />
      ) : (
        <Button
          type="button"
          className="button--secondary project-share-links__new"
          onClick={() => {
            closeEditor();
            setCreating(true);
          }}
        >
          <Plus size={16} aria-hidden /> {t('shareLinks.newLink')}
        </Button>
      )}

      {isLoading ? (
        <div className="project-collaborators__loading">{t('common.loading')}</div>
      ) : links.length > 0 ? (
        <ul className="project-share-links__list">
          {links.map((link) => {
            const roleName = t(`permissions.roles.${link.role}.name`);
            if (editingId === link._id) {
              return (
                <li key={link._id} className="project-share-links__item project-share-links__item--editing">
                  <ShareLinkForm
                    initial={link}
                    files={files}
                    submitting={editMutation.isPending || busy}
                    error={editError}
                    submitLabel={t('shareLinks.save')}
                    onSubmit={(values) => editMutation.mutate({ linkId: link._id, values })}
                    onCancel={closeEditor}
                    extraActions={
                      <>
                        {(link.status === 'active' || link.status === 'paused') && (
                          <button
                            type="button"
                            className="project-share-links__text-action"
                            onClick={() =>
                              pauseMutation.mutate({ linkId: link._id, active: link.status === 'paused' })
                            }
                            disabled={busy}
                          >
                            {link.status === 'paused' ? t('shareLinks.resume') : t('shareLinks.pause')}
                          </button>
                        )}
                        <button
                          type="button"
                          className="project-share-links__text-action project-share-links__text-action--danger"
                          onClick={() => handleRevoke(link)}
                          disabled={busy}
                        >
                          {t('shareLinks.revoke')}
                        </button>
                      </>
                    }
                  />
                </li>
              );
            }
            const active = link.status === 'active';
            return (
              <li
                key={link._id}
                className={`project-share-links__item${active ? '' : ' project-share-links__item--inactive'}`}
              >
                <div className="project-share-links__item-info">
                  <div className="project-share-links__item-name">
                    {link.label || roleName}
                    {link.hasPassword && (
                      <KeyRound
                        size={12}
                        className="project-share-links__badge-icon"
                        aria-label={t('shareLinks.passwordProtected')}
                      />
                    )}
                  </div>
                  <div className="project-share-links__item-meta">
                    {[
                      link.label ? roleName : null,
                      link.fileIds.length ? t('shareLinks.scopeCount', { count: link.fileIds.length }) : null,
                      link.maxJoins === 1 ? t('shareLinks.singleUseBadge') : null,
                      statusText(link),
                      t('shareLinks.views', { count: link.viewCount })
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                </div>
                <div className="project-collaborators__item-actions">
                  {active && (
                    <button
                      type="button"
                      className="project-icon-action project-icon-action--round project-icon-action--neutral"
                      onClick={() => copy(link)}
                      aria-label={copiedId === link._id ? t('shareLinks.copied') : t('shareLinks.copy')}
                      title={copiedId === link._id ? t('shareLinks.copied') : t('shareLinks.copy')}
                    >
                      {copiedId === link._id ? <Check aria-hidden /> : <Copy aria-hidden />}
                    </button>
                  )}
                  <button
                    type="button"
                    className="project-icon-action project-icon-action--round project-icon-action--neutral"
                    onClick={() => {
                      setCreating(false);
                      setEditError(null);
                      setEditingId(link._id);
                    }}
                    aria-label={t('shareLinks.edit')}
                    title={t('shareLinks.edit')}
                  >
                    <Pencil aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : !creating ? (
        <p className="project-share-links__empty">{t('shareLinks.hint')}</p>
      ) : null}
    </section>
  );
};

export default ProjectShareLinks;
