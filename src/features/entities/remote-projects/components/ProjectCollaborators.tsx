import { useState } from 'react';
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

  return (
    <section className="project-collaborators">
      <h3 className="project-collaborators__title">{t('collaborators.title')}</h3>
      <p className="project-collaborators__hint">{t('collaborators.hint')}</p>

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
              {(access?.canInvite && access.side === c.side) ||
              currentUserId === userIdOf(c.userId) ? (
                <Button
                  className="button--secondary button--sm"
                  onClick={() => removeMutation.mutate(userIdOf(c.userId))}
                  disabled={removeMutation.isPending}
                >
                  {currentUserId === userIdOf(c.userId)
                    ? t('collaborators.leave')
                    : t('collaborators.remove')}
                </Button>
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
              {access?.canInvite && access.side === invite.side ? (
                <Button
                  className="button--secondary button--sm"
                  onClick={() => revokeMutation.mutate(invite._id)}
                  disabled={revokeMutation.isPending}
                >
                  {t('collaborators.revoke')}
                </Button>
              ) : null}
            </li>
          ))}
          {collaborators.length === 0 && pending.length === 0 ? (
            <li className="project-collaborators__empty">{t('collaborators.empty')}</li>
          ) : null}
        </ul>
      )}

      {access?.canInvite ? (
        <form className="project-collaborators__invite" onSubmit={handleInvite}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('collaborators.emailPlaceholder')}
            required
          />
          <Button type="submit" disabled={inviteMutation.isPending || !email.trim()}>
            {t('collaborators.invite')}
          </Button>
        </form>
      ) : null}
      {error ? <p className="project-collaborators__error">{error}</p> : null}
    </section>
  );
};
