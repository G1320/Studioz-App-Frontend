import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeftRight, Check, ChevronDown, Loader2, LogOut, MailX, Plus, UserMinus, X } from 'lucide-react';
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
  ProjectSide
} from 'src/types';
import { ProjectCollaboratorAvatars } from './ProjectCollaboratorAvatars';
import { GrantDetails, RoleSelect, grantDraftForRole, type GrantDraft } from './ProjectGrantEditor';
import { ProjectShareLinks } from './ProjectShareLinks';
import { collaboratorUserId, collaboratorUserLabel } from '../utils/collaboratorUser';
import { ROLE_CAPABILITIES } from '../utils/projectPermissions';
import './styles/_project-collaborators.scss';

const apiErrorMessage = (err: unknown, fallback: string) =>
  (err as { response?: { data?: { message?: string } } })?.response?.data?.message || fallback;

type Tab = 'people' | 'links';

const SIDES: ProjectSide[] = ['vendor', 'customer'];
const otherSide = (side: ProjectSide): ProjectSide => (side === 'vendor' ? 'customer' : 'vendor');

interface ProjectCollaboratorsProps {
  projectId: string;
  access?: ProjectAccess;
  /** When true, show invite affordance (owners and editors). */
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
  const [inviteMoreOpen, setInviteMoreOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('people');

  const { data, isLoading } = useQuery({
    queryKey: ['projectCollaborators', projectId],
    queryFn: () => getCollaborators(projectId),
    enabled: !!projectId
  });

  const showInvite = canInvite === true || access?.canInvite === true || access?.isPrimary === true;
  const canChooseSide = showInvite && access?.canChooseSide === true;
  const [inviteSide, setInviteSide] = useState<ProjectSide>(access?.side ?? 'vendor');
  const { files } = useProjectFiles({ projectId: modalOpen && showInvite ? projectId : '' });

  const { data: accessRequestData } = useQuery({
    queryKey: ['projectAccessRequests', projectId],
    queryFn: () => getAccessRequests(projectId),
    enabled: !!projectId && showInvite
  });
  const accessRequests = accessRequestData?.accessRequests || [];
  const [requestGrants, setRequestGrants] = useState<Record<string, GrantDraft>>({});
  const [requestError, setRequestError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (!showInvite || searchParams.get('accessRequests') !== '1') return;
    setTab('people');
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
    mutationFn: ({ requestId, grant }: { requestId: string; grant: GrantDraft }) =>
      approveAccessRequest(projectId, requestId, { capabilities: grant.capabilities }),
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
        fileIds: inviteGrant.fileIds.length ? inviteGrant.fileIds : undefined,
        ...(canChooseSide ? { side: inviteSide } : {})
      }),
    onSuccess: () => {
      setEmail('');
      setError(null);
      invalidate();
    },
    onError: (err: unknown) => setError(apiErrorMessage(err, t('collaborators.inviteFailed')))
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) => removeCollaborator(projectId, userId),
    onSuccess: invalidate,
    onError: (err: unknown) => setError(apiErrorMessage(err, t('collaborators.updateFailed')))
  });

  const revokeMutation = useMutation({
    mutationFn: (inviteId: string) => revokeCollaboratorInvite(projectId, inviteId),
    onSuccess: invalidate
  });

  const roleMutation = useMutation({
    mutationFn: ({ collaborator, grant }: { collaborator: ProjectCollaborator; grant: GrantDraft }) =>
      updateCollaborator(projectId, collaboratorUserId(collaborator.userId), {
        capabilities: grant.capabilities,
        fileIds: collaborator.fileIds?.length ? collaborator.fileIds : undefined
      }),
    onSuccess: invalidate,
    onError: (err: unknown) => setError(apiErrorMessage(err, t('collaborators.updateFailed')))
  });

  const moveMutation = useMutation({
    mutationFn: ({ userId, side }: { userId: string; side: ProjectSide }) =>
      updateCollaborator(projectId, userId, { side }),
    onSuccess: invalidate,
    onError: (err: unknown) => setError(apiErrorMessage(err, t('collaborators.updateFailed')))
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    inviteMutation.mutate(email.trim());
  };

  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if (modalOpen) {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setModalOpen(false);
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }
    setError(null);
    setEmail('');
    setInviteMoreOpen(false);
  }, [modalOpen]);

  const collaborators = data?.collaborators || [];
  const pending = data?.pendingInvites || [];
  const roleLabel = (role?: string) => t(`permissions.roles.${role || 'editor'}.name`);
  const canManageSide = (side: string) => showInvite && (canChooseSide || !access?.side || access.side === side);

  const collaboratorMeta = (c: ProjectCollaborator) =>
    [
      typeof c.userId === 'object' && c.userId?.email ? c.userId.email : null,
      c.fileIds?.length ? t('shareLinks.scopeCount', { count: c.fileIds.length }) : null,
      c.expiresAt ? t('shareLinks.expiresOn', { date: new Date(c.expiresAt).toLocaleDateString() }) : null,
      c.shareLinkId ? t('collaborators.viaLink') : null
    ]
      .filter(Boolean)
      .join(' · ');

  const renderCollaborator = (c: ProjectCollaborator) => {
    const id = collaboratorUserId(c.userId);
    const isSelf = currentUserId === id;
    const manageable = canManageSide(c.side) && !isSelf;
    const moveLabel = t('collaborators.moveTo', { side: t(`collaborators.side.${otherSide(c.side)}`) });
    return (
      <li key={id} className="project-collaborators__item">
        <div className="project-collaborators__person">
          <div className="project-collaborators__name">{collaboratorUserLabel(c.userId)}</div>
          <div className="project-collaborators__meta">{collaboratorMeta(c)}</div>
        </div>
        <div className="project-collaborators__item-actions">
          {manageable ? (
            <RoleSelect
              value={{ capabilities: c.capabilities ?? [...ROLE_CAPABILITIES.editor], fileIds: [] }}
              onChange={(grant) => roleMutation.mutate({ collaborator: c, grant })}
              disabled={roleMutation.isPending}
            />
          ) : (
            <span className="project-collaborators__role">{roleLabel(c.role)}</span>
          )}
          {manageable && canChooseSide && (
            <button
              type="button"
              className="project-icon-action project-icon-action--round project-icon-action--neutral"
              onClick={() => moveMutation.mutate({ userId: id, side: otherSide(c.side) })}
              disabled={moveMutation.isPending}
              aria-label={moveLabel}
              title={moveLabel}
            >
              {moveMutation.isPending && moveMutation.variables?.userId === id ? (
                <Loader2 className="project-icon-action__spin" aria-hidden />
              ) : (
                <ArrowLeftRight aria-hidden />
              )}
            </button>
          )}
          {(manageable || isSelf) && (
            <button
              type="button"
              className="project-icon-action project-icon-action--round project-icon-action--danger"
              onClick={() => removeMutation.mutate(id)}
              disabled={removeMutation.isPending}
              aria-label={isSelf ? t('collaborators.leave') : t('collaborators.remove')}
              title={isSelf ? t('collaborators.leave') : t('collaborators.remove')}
            >
              {removeMutation.isPending && removeMutation.variables === id ? (
                <Loader2 className="project-icon-action__spin" aria-hidden />
              ) : isSelf ? (
                <LogOut aria-hidden />
              ) : (
                <UserMinus aria-hidden />
              )}
            </button>
          )}
        </div>
      </li>
    );
  };

  const renderInvite = (invite: ProjectInvite) => (
    <li key={invite._id} className="project-collaborators__item project-collaborators__item--pending">
      <div className="project-collaborators__person">
        <div className="project-collaborators__name">{invite.email}</div>
        <div className="project-collaborators__meta">{t('collaborators.pending')}</div>
      </div>
      <div className="project-collaborators__item-actions">
        <span className="project-collaborators__role">{roleLabel(invite.role)}</span>
        {canManageSide(invite.side) && (
          <button
            type="button"
            className="project-icon-action project-icon-action--round project-icon-action--neutral"
            onClick={() => revokeMutation.mutate(invite._id)}
            disabled={revokeMutation.isPending}
            aria-label={t('collaborators.revoke')}
            title={t('collaborators.revoke')}
          >
            {revokeMutation.isPending && revokeMutation.variables === invite._id ? (
              <Loader2 className="project-icon-action__spin" aria-hidden />
            ) : (
              <MailX aria-hidden />
            )}
          </button>
        )}
      </div>
    </li>
  );

  const peopleList = isLoading ? (
    <div className="project-collaborators__loading">{t('common.loading')}</div>
  ) : collaborators.length === 0 && pending.length === 0 ? (
    <p className="project-collaborators__empty">{t('collaborators.empty')}</p>
  ) : (
    SIDES.map((side) => {
      const sideCollaborators = collaborators.filter(
        (c: ProjectCollaborator) => c.side === side && c.userId != null
      );
      const sideInvites = pending.filter((invite: ProjectInvite) => invite.side === side);
      if (sideCollaborators.length === 0 && sideInvites.length === 0) return null;
      return (
        <section key={side} className="project-collaborators__side" aria-label={t(`collaborators.side.${side}`)}>
          <h4 className="project-collaborators__section-title">{t(`collaborators.side.${side}`)}</h4>
          <ul className="project-collaborators__list">
            {sideCollaborators.map(renderCollaborator)}
            {sideInvites.map(renderInvite)}
          </ul>
        </section>
      );
    })
  );

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
                  aria-label={showInvite ? t('collaborators.manageOrInvite') : t('collaborators.view')}
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
              <h3 id="project-collab-modal-title">
                {showInvite ? t('collaborators.shareTitle') : t('collaborators.title')}
              </h3>
              <button
                type="button"
                className="project-collaborators__modal-close"
                onClick={closeModal}
                aria-label={t('common.close', 'Close')}
              >
                <X size={18} />
              </button>
            </div>

            {showInvite && (
              <div className="project-collaborators__tabs" role="tablist">
                {(['people', 'links'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={tab === key}
                    className={`project-collaborators__tab${tab === key ? ' project-collaborators__tab--active' : ''}`}
                    onClick={() => setTab(key)}
                  >
                    {t(`collaborators.tabs.${key}`)}
                    {key === 'people' && accessRequests.length > 0 ? (
                      <span className="project-collaborators__tab-count">{accessRequests.length}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            )}

            <div className="project-collaborators__modal-body">
              {showInvite && tab === 'links' ? (
                <ProjectShareLinks projectId={projectId} />
              ) : (
                <>
                  {showInvite && (
                    <form className="project-collaborators__invite" onSubmit={handleInvite}>
                      <div className="project-collaborators__invite-row">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t('collaborators.emailPlaceholder')}
                          aria-label={t('collaborators.emailLabel')}
                          autoComplete="email"
                          required
                          autoFocus
                        />
                        <RoleSelect value={inviteGrant} onChange={setInviteGrant} disabled={inviteMutation.isPending} />
                        <Button
                          type="submit"
                          className="button--primary"
                          disabled={inviteMutation.isPending || !email.trim()}
                        >
                          {inviteMutation.isPending ? t('common.sending') : t('collaborators.inviteShort')}
                        </Button>
                      </div>
                      <div className="project-collaborators__invite-options">
                        {canChooseSide && (
                          <div
                            className="project-collaborators__side-toggle"
                            role="radiogroup"
                            aria-label={t('collaborators.sideLabel')}
                          >
                            {SIDES.map((side) => (
                              <button
                                key={side}
                                type="button"
                                role="radio"
                                aria-checked={inviteSide === side}
                                className={`project-collaborators__side-option${
                                  inviteSide === side ? ' project-collaborators__side-option--active' : ''
                                }`}
                                onClick={() => setInviteSide(side)}
                              >
                                {t(`collaborators.side.${side}`)}
                              </button>
                            ))}
                          </div>
                        )}
                        <button
                          type="button"
                          className="project-collaborators__more"
                          onClick={() => setInviteMoreOpen((open) => !open)}
                          aria-expanded={inviteMoreOpen}
                        >
                          {inviteMoreOpen ? t('permissions.fewerOptions') : t('permissions.moreOptions')}
                          <ChevronDown size={14} aria-hidden className={inviteMoreOpen ? 'is-open' : undefined} />
                        </button>
                      </div>
                      {inviteMoreOpen && (
                        <GrantDetails
                          value={inviteGrant}
                          onChange={setInviteGrant}
                          files={files}
                          disabled={inviteMutation.isPending}
                        />
                      )}
                      {error ? <p className="project-collaborators__error">{error}</p> : null}
                    </form>
                  )}

                  {showInvite && accessRequests.length > 0 && (
                    <section className="project-collaborators__requests" aria-label={t('accessRequests.title')}>
                      <h4 className="project-collaborators__section-title">{t('accessRequests.title')}</h4>
                      <ul className="project-collaborators__list">
                        {accessRequests.map((request: ProjectAccessRequestItem) => {
                          const grant = requestGrants[request._id] ?? grantDraftForRole('reviewer');
                          const busy =
                            (approveMutation.isPending && approveMutation.variables?.requestId === request._id) ||
                            (denyMutation.isPending && denyMutation.variables === request._id);
                          return (
                            <li key={request._id} className="project-collaborators__item">
                              <div className="project-collaborators__person">
                                <div className="project-collaborators__name">
                                  {collaboratorUserLabel(request.userId)}
                                </div>
                                <div className="project-collaborators__meta">
                                  {typeof request.userId === 'object' && request.userId?.email
                                    ? request.userId.email
                                    : new Date(request.createdAt).toLocaleDateString()}
                                </div>
                                {request.message ? (
                                  <p className="project-collaborators__request-message">“{request.message}”</p>
                                ) : null}
                              </div>
                              <div className="project-collaborators__item-actions">
                                <RoleSelect
                                  value={grant}
                                  onChange={(next) => setRequestGrants((prev) => ({ ...prev, [request._id]: next }))}
                                  disabled={busy}
                                />
                                <button
                                  type="button"
                                  className="project-icon-action project-icon-action--round project-icon-action--neutral"
                                  onClick={() => approveMutation.mutate({ requestId: request._id, grant })}
                                  disabled={busy}
                                  aria-label={t('accessRequests.approve')}
                                  title={t('accessRequests.approve')}
                                >
                                  <Check aria-hidden />
                                </button>
                                <button
                                  type="button"
                                  className="project-icon-action project-icon-action--round project-icon-action--danger"
                                  onClick={() => denyMutation.mutate(request._id)}
                                  disabled={busy}
                                  aria-label={t('accessRequests.deny')}
                                  title={t('accessRequests.deny')}
                                >
                                  <X aria-hidden />
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      {requestError ? <p className="project-collaborators__error">{requestError}</p> : null}
                    </section>
                  )}

                  {peopleList}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
