import { useState } from 'react';
import { Loader2, LogOut, MailX, UserMinus } from 'lucide-react';
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
  /** When true, show invite form (primary customer/vendor). */
  canInvite?: boolean;
  currentUserId?: string;
}

function userLabel(user: ProjectCollaborator['userId']): string {
  if (typeof user === 'string') return user;
  return user.name || user.email || user._id;
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

  const collaborators = data?.collaborators || [];
  const pending = data?.pendingInvites || [];
  // Only primary customer/vendor may invite — collaborators get 403 from the API.
  const showInviteForm =
    canInvite === true || access?.canInvite === true || access?.isPrimary === true;
  const canManageSide = (side: string) =>
    showInviteForm && (!access?.side || access.side === side);

  return (
    <section className="project-collaborators">
      <h3 className="project-collaborators__title">{t('collaborators.title')}</h3>
      <p className="project-collaborators__hint">{t('collaborators.hint')}</p>

      {showInviteForm ? (
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
            />
            <Button type="submit" className="button--primary" disabled={inviteMutation.isPending || !email.trim()}>
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
                    className="project-icon-action project-icon-action--danger"
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
            <li key={invite._id} className="project-collaborators__item project-collaborators__item--pending">
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
                    className="project-icon-action project-icon-action--neutral"
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
    </section>
  );
};
