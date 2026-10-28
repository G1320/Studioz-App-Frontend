import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, LogOut, MailX, Plus, UserMinus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@shared/components';
import {
  approveAccessRequest,
  denyAccessRequest,
  getAccessRequests,
  getCollaborators,
  inviteCollaborator,
  removeCollaborator,
  revokeCollaboratorInvite,
  updateCollaborator
} from '@shared/services';
import { useProjectFiles } from '@shared/hooks';
import type {
  ProjectAccess,
  ProjectAccessRequestItem,
  ProjectCollaborator,
  ProjectInvite,
  ProjectRole
} from 'src/types';
import { ProjectCollaboratorAvatars } from './ProjectCollaboratorAvatars';
import { ProjectGrantEditor, grantDraftForRole, type GrantDraft } from './ProjectGrantEditor';
import { ProjectShareLinks } from './ProjectShareLinks';
import { collaboratorUserId, collaboratorUserLabel } from '../utils/collaboratorUser';
import { PROJECT_ROLES, ROLE_CAPABILITIES } from '../utils/projectPermissions';
import './styles/_project-collaborators.scss';

const apiErrorMessage = (err: unknown, fallback: string) =>
  (err as { response?: { data?: { message?: string } } })?.response?.data?.message || fallback;

interface ProjectCollaboratorsProps {
  projectId: string;
  access?: ProjectAccess;
  /** When true, show invite affordance (primary customer/vendor). */
  canInvite?: boolean;
  currentUserId?: string;
}

export const ProjectCollaborators: React.FC<ProjectCollaboratorsProps> = ({
  projectId,
  access,
  canInvite = false,
  currentUserId
}) => {
  const { t } = useTranslation('remoteProjects');
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [inviteGrant, setInviteGrant] = useState<GrantDraft>(() => grantDraftForRole('editor'));
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['projectCollaborators', projectId],
    queryFn: () => getCollaborators(projectId),
    enabled: !!projectId
  });

  const showInvite =
    canInvite === true || access?.canInvite === true || access?.isPrimary === true;
  const { files } = useProjectFiles({ projectId: modalOpen && showInvite ? projectId : '' });

  const { data: accessRequestData } = useQuery({
    queryKey: ['projectAccessRequests', projectId],
    queryFn: () => getAccessRequests(projectId),
    enabled: !!projectId && showInvite
  });
  const accessRequests = accessRequestData?.accessRequests || [];
  const [requestRoles, setRequestRoles] = useState<Record<string, ProjectRole>>({});
  const [requestError, setRequestError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (!showInvite || searchParams.get('accessRequests') !== '1') return;
    setModalOpen(true);
    const next = new URLSearchParams(searchParams);
    next.delete('accessRequests');
    setSearchParams(next, { replace: true });
  }, [showInvite, searchParams, setSearchParams]);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['projectCollaborators', projectId] });
    void queryClient.invalidateQueries({ queryKey: ['remoteProject', projectId] });
    void queryClient.invalidateQueries({ queryKey: ['projectAccessRequests', projectId] });
  };

  const approveMutation = useMutation({
    mutationFn: ({ requestId, role }: { requestId: string; role: ProjectRole }) =>
      approveAccessRequest(projectId, requestId, { capabilities: [...ROLE_CAPABILITIES[role]] }),
    onSuccess: () => {
      setRequestError(null);
      invalidate();
    },
    onError: (err: unknown) => setRequestError(apiErrorMessage(err, t('accessRequests.approveFailed')))
  });

  const denyMutation = useMutation({
    mutationFn: (requestId: string) => denyAccessRequest(projectId, requestId),
    onSuccess: () => {
      setRequestError(null);
      invalidate();
    },
    onError: (err: unknown) => setRequestError(apiErrorMessage(err, t('accessRequests.denyFailed')))
  });

  const inviteMutation = useMutation({
    mutationFn: (inviteEmail: string) =>
      inviteCollaborator(projectId, inviteEmail, {
        capabilities: inviteGrant.capabilities,
        fileIds: inviteGrant.fileIds.length ? inviteGrant.fileIds : undefined
      }),
    onSuccess: () => {
      setEmail('');
      setError(null);
      invalidate();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t('collaborators.inviteFailed');
      setError(msg);
    }
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) => removeCollaborator(projectId, userId),
    onSuccess: invalidate
  });

  const revokeMutation = useMutation({
    mutationFn: (inviteId: string) => revokeCollaboratorInvite(projectId, inviteId),
    onSuccess: invalidate
  });

  const roleMutation = useMutation({
    mutationFn: ({ collaborator, role }: { collaborator: ProjectCollaborator; role: ProjectRole }) =>
      updateCollaborator(projectId, collaboratorUserId(collaborator.userId), {
        capabilities: [...ROLE_CAPABILITIES[role]],
        fileIds: collaborator.fileIds?.length ? collaborator.fileIds : undefined
      }),
    onSuccess: invalidate
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    inviteMutation.mutate(email.trim());
  };

  const closeModal = () => {
    setModalOpen(false);
    setError(null);
    setEmail('');
  };

  const collaborators = data?.collaborators || [];
  const pending = data?.pendingInvites || [];
  const roleLabel = (role?: string) => t(`permissions.roles.${role || 'editor'}.name`);
  const canManageSide = (side: string) => showInvite && (!access?.side || access.side === side);

  return (
    <div className="project-collaborators project-collaborators--inline">
      <div className="project-collaborators__strip">
        <span className="project-collaborators__label">{t('collaborators.title')}</span>

        {isLoading ? (
          <span className="project-collaborators__loading-inline">{t('common.loading')}</span>
        ) : (
          <>
            {collaborators.length === 0 ? (
              <span className="project-collaborators__empty-inline">{t('collaborators.empty')}</span>
            ) : null}
            <ProjectCollaboratorAvatars
              collaborators={collaborators}
              trailing={
                <button
                  type="button"
                  className="project-collaborators__add"
                  onClick={() => setModalOpen(true)}
                  aria-label={
                    showInvite ? t('collaborators.manageOrInvite') : t('collaborators.view')
                  }
                  title={showInvite ? t('collaborators.manageOrInvite') : t('collaborators.view')}
                >
                  <Plus aria-hidden />
                  {accessRequests.length > 0 ? (
                    <span
                      className="project-collaborators__request-badge"
                      aria-label={t('accessRequests.pendingCount', { count: accessRequests.length })}
                    >
                      {accessRequests.length}
                    </span>
                  ) : null}
                </button>
              }
            />
          </>
        )}
      </div>

      {modalOpen && (
        <div className="project-collaborators__modal-overlay" onClick={closeModal} role="presentation">
          <div
            className="project-collaborators__modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-collab-modal-title"
          >
            <div className="project-collaborators__modal-header">
              <h3 id="project-collab-modal-title">{t('collaborators.title')}</h3>
              <button
                type="button"
                className="project-collaborators__modal-close"
                onClick={closeModal}
                aria-label={t('common.close', 'Close')}
              >
                <X size={18} />
              </button>
            </div>

            <p className="project-collaborators__hint">{t('collaborators.hint')}</p>

            {showInvite && accessRequests.length > 0 ? (
              <section className="project-collaborators__requests" aria-labelledby="project-access-requests-title">
                <h4 id="project-access-requests-title" className="project-collaborators__requests-title">
                  {t('accessRequests.title')}
                </h4>
                <ul className="project-collaborators__list">
                  {accessRequests.map((request: ProjectAccessRequestItem) => {
                    const role = requestRoles[request._id] ?? 'reviewer';
                    const busy =
                      (approveMutation.isPending && approveMutation.variables?.requestId === request._id) ||
                      (denyMutation.isPending && denyMutation.variables === request._id);
                    return (
                      <li key={request._id} className="project-collaborators__item project-collaborators__item--request">
                        <div>
                          <div className="project-collaborators__name">{collaboratorUserLabel(request.userId)}</div>
                          <div className="project-collaborators__meta">
                            {typeof request.userId === 'object' && request.userId.email
                              ? `${request.userId.email} · `
                              : ''}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                          {request.message ? (
                            <p className="project-collaborators__request-message">{request.message}</p>
                          ) : null}
                        </div>
                        <div className="project-collaborators__item-actions">
                          <select
                            className="project-collaborators__role-select"
                            value={role}
                            onChange={(e) =>
                              setRequestRoles((prev) => ({ ...prev, [request._id]: e.target.value as ProjectRole }))
                            }
                            disabled={busy}
                            aria-label={t('accessRequests.roleLabel')}
                          >
                            {PROJECT_ROLES.map((r) => (
                              <option key={r} value={r}>
                                {roleLabel(r)}
                              </option>
                            ))}
                          </select>
                          <Button
                            type="button"
                            className="button--primary"
                            onClick={() => approveMutation.mutate({ requestId: request._id, role })}
                            disabled={busy}
                          >
                            {t('accessRequests.approve')}
                          </Button>
                          <Button
                            type="button"
                            className="button--secondary"
                            onClick={() => denyMutation.mutate(request._id)}
                            disabled={busy}
                          >
                            {t('accessRequests.deny')}
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {requestError ? <p className="project-collaborators__error">{requestError}</p> : null}
              </section>
            ) : null}

            {showInvite ? (
              <form className="project-collaborators__invite" onSubmit={handleInvite}>
                <label className="project-collaborators__invite-label" htmlFor="project-collab-email">
                  {t('collaborators.invite')}
                </label>
                <div className="project-collaborators__invite-row">
                  <input
                    id="project-collab-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('collaborators.emailPlaceholder')}
                    autoComplete="email"
                    required
                    autoFocus
                  />
                  <Button
                    type="submit"
                    className="button--primary"
                    disabled={inviteMutation.isPending || !email.trim()}
                  >
                    {inviteMutation.isPending ? t('common.sending') : t('collaborators.invite')}
                  </Button>
                </div>
                <ProjectGrantEditor
                  value={inviteGrant}
                  onChange={setInviteGrant}
                  files={files}
                  disabled={inviteMutation.isPending}
                />
                {error ? <p className="project-collaborators__error">{error}</p> : null}
              </form>
            ) : null}

            {isLoading ? (
              <div className="project-collaborators__loading">{t('common.loading')}</div>
            ) : (
              <ul className="project-collaborators__list">
                {collaborators.map((c: ProjectCollaborator) => (
                  <li key={collaboratorUserId(c.userId)} className="project-collaborators__item">
                    <div>
                      <div className="project-collaborators__name">{collaboratorUserLabel(c.userId)}</div>
                      <div className="project-collaborators__meta">
                        {t(`collaborators.side.${c.side}`)}
                        {typeof c.userId === 'object' && c.userId.email ? ` · ${c.userId.email}` : ''}
                      </div>
                      <div className="project-collaborators__meta">
                        {roleLabel(c.role)}
                        {c.fileIds?.length ? ` · ${t('shareLinks.scopeCount', { count: c.fileIds.length })}` : ''}
                        {c.expiresAt
                          ? ` · ${t('shareLinks.expiresOn', { date: new Date(c.expiresAt).toLocaleDateString() })}`
                          : ''}
                        {c.shareLinkId ? ` · ${t('collaborators.viaLink')}` : ''}
                      </div>
                    </div>
                    {canManageSide(c.side) || currentUserId === collaboratorUserId(c.userId) ? (
                      <div className="project-collaborators__item-actions">
                        {canManageSide(c.side) && (
                          <select
                            className="project-collaborators__role-select"
                            value={c.role && c.role !== 'custom' ? c.role : 'custom'}
                            onChange={(e) =>
                              roleMutation.mutate({ collaborator: c, role: e.target.value as ProjectRole })
                            }
                            disabled={roleMutation.isPending}
                            aria-label={t('permissions.changeRole')}
                          >
                            {c.role === 'custom' && (
                              <option value="custom" disabled>
                                {roleLabel('custom')}
                              </option>
                            )}
                            {PROJECT_ROLES.map((role) => (
                              <option key={role} value={role}>
                                {roleLabel(role)}
                              </option>
                            ))}
                          </select>
                        )}
                        <button
                          type="button"
                          className="project-icon-action project-icon-action--round project-icon-action--danger"
                          onClick={() => removeMutation.mutate(collaboratorUserId(c.userId))}
                          disabled={removeMutation.isPending}
                          aria-label={
                            currentUserId === collaboratorUserId(c.userId)
                              ? t('collaborators.leave')
                              : t('collaborators.remove')
                          }
                        >
                          {removeMutation.isPending ? (
                            <Loader2 className="project-icon-action__spin" aria-hidden />
                          ) : currentUserId === collaboratorUserId(c.userId) ? (
                            <LogOut aria-hidden />
                          ) : (
                            <UserMinus aria-hidden />
                          )}
                        </button>
                      </div>
                    ) : null}
                  </li>
                ))}
                {pending.map((invite: ProjectInvite) => (
                  <li
                    key={invite._id}
                    className="project-collaborators__item project-collaborators__item--pending"
                  >
                    <div>
                      <div className="project-collaborators__name">{invite.email}</div>
                      <div className="project-collaborators__meta">
                        {t('collaborators.pending')} · {t(`collaborators.side.${invite.side}`)} ·{' '}
                        {roleLabel(invite.role)}
                      </div>
                    </div>
                    {canManageSide(invite.side) ? (
                      <div className="project-collaborators__item-actions">
                        <button
                          type="button"
                          className="project-icon-action project-icon-action--round project-icon-action--neutral"
                          onClick={() => revokeMutation.mutate(invite._id)}
                          disabled={revokeMutation.isPending}
                          aria-label={t('collaborators.revoke')}
                        >
                          {revokeMutation.isPending ? (
                            <Loader2 className="project-icon-action__spin" aria-hidden />
                          ) : (
                            <MailX aria-hidden />
                          )}
                        </button>
                      </div>
                    ) : null}
                  </li>
                ))}
                {collaborators.length === 0 && pending.length === 0 ? (
                  <li className="project-collaborators__empty">{t('collaborators.empty')}</li>
                ) : null}
              </ul>
            )}

            {showInvite ? <ProjectShareLinks projectId={projectId} /> : null}
          </div>
        </div>
      )}
    </div>
  );
};
