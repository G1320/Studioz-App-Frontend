import { useState } from 'react';
import { Loader2, LogOut, MailX, Plus, UserMinus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@shared/components';
import {
  getCollaborators,
  inviteCollaborator,
  removeCollaborator,
  revokeCollaboratorInvite
} from '@shared/services';
import type { ProjectAccess, ProjectCollaborator, ProjectInvite } from 'src/types';
import './styles/_project-collaborators.scss';

interface ProjectCollaboratorsProps {
  projectId: string;
  access?: ProjectAccess;
  /** When true, show invite affordance (primary customer/vendor). */
  canInvite?: boolean;
  currentUserId?: string;
}

function userLabel(user: ProjectCollaborator['userId']): string {
  if (typeof user === 'string') return user;
  return user.name || user.email || user._id;
}

function userTooltip(user: ProjectCollaborator['userId']): string {
  if (typeof user === 'string') return user;
  return user.name?.trim() || user.email || user._id;
}

function userAvatarUrl(user: ProjectCollaborator['userId']): string | undefined {
  if (typeof user === 'string') return undefined;
  return user.picture || user.avatar || user.imgUrl || undefined;
}

function userInitials(user: ProjectCollaborator['userId']): string {
  if (typeof user === 'string') return '?';
  const source = user.name?.trim() || user.email?.trim() || '';
  if (!source) return '?';
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

function userIdOf(user: ProjectCollaborator['userId']): string {
  return typeof user === 'string' ? user : user._id;
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
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['projectCollaborators', projectId],
    queryFn: () => getCollaborators(projectId),
    enabled: !!projectId
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['projectCollaborators', projectId] });
    void queryClient.invalidateQueries({ queryKey: ['remoteProject', projectId] });
  };

  const inviteMutation = useMutation({
    mutationFn: (inviteEmail: string) => inviteCollaborator(projectId, inviteEmail),
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
  const showInvite =
    canInvite === true || access?.canInvite === true || access?.isPrimary === true;
  const canManageSide = (side: string) => showInvite && (!access?.side || access.side === side);
  const maxVisibleAvatars = 5;
  const visibleCollaborators = collaborators.slice(0, maxVisibleAvatars);
  const overflowCount = Math.max(0, collaborators.length - maxVisibleAvatars);

  return (
    <div className="project-collaborators project-collaborators--inline">
      <div className="project-collaborators__strip">
        <span className="project-collaborators__label">{t('collaborators.title')}</span>

        {isLoading ? (
          <span className="project-collaborators__loading-inline">{t('common.loading')}</span>
        ) : (
          <div className="project-collaborators__avatars">
            {visibleCollaborators.length > 0 ? (
              visibleCollaborators.map((c) => {
                const tip = userTooltip(c.userId);
                const avatarUrl = userAvatarUrl(c.userId);
                return (
                  <span
                    key={userIdOf(c.userId)}
                    className="project-collaborators__avatar"
                    title={tip}
                    aria-label={tip}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" />
                    ) : (
                      <span className="project-collaborators__avatar-initials" aria-hidden>
                        {userInitials(c.userId)}
                      </span>
                    )}
                  </span>
                );
              })
            ) : (
              <span className="project-collaborators__empty-inline">{t('collaborators.empty')}</span>
            )}
            {overflowCount > 0 && (
              <span
                className="project-collaborators__avatar project-collaborators__avatar--more"
                title={t('collaborators.moreCount', { count: overflowCount, defaultValue: `+${overflowCount}` })}
              >
                +{overflowCount}
              </span>
            )}
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
            </button>
          </div>
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
                {error ? <p className="project-collaborators__error">{error}</p> : null}
              </form>
            ) : null}

            {isLoading ? (
              <div className="project-collaborators__loading">{t('common.loading')}</div>
            ) : (
              <ul className="project-collaborators__list">
                {collaborators.map((c: ProjectCollaborator) => (
                  <li key={userIdOf(c.userId)} className="project-collaborators__item">
                    <div>
                      <div className="project-collaborators__name">{userLabel(c.userId)}</div>
                      <div className="project-collaborators__meta">
                        {t(`collaborators.side.${c.side}`)}
                        {typeof c.userId === 'object' && c.userId.email ? ` · ${c.userId.email}` : ''}
                      </div>
                    </div>
                    {canManageSide(c.side) || currentUserId === userIdOf(c.userId) ? (
                      <div className="project-collaborators__item-actions">
                        <button
                          type="button"
                          className="project-icon-action project-icon-action--round project-icon-action--danger"
                          onClick={() => removeMutation.mutate(userIdOf(c.userId))}
                          disabled={removeMutation.isPending}
                          aria-label={
                            currentUserId === userIdOf(c.userId)
                              ? t('collaborators.leave')
                              : t('collaborators.remove')
                          }
                        >
                          {removeMutation.isPending ? (
                            <Loader2 className="project-icon-action__spin" aria-hidden />
                          ) : currentUserId === userIdOf(c.userId) ? (
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
                        {t('collaborators.pending')} · {t(`collaborators.side.${invite.side}`)}
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
          </div>
        </div>
      )}
    </div>
  );
};
