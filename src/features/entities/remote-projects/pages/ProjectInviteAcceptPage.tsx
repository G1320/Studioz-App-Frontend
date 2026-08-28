import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@shared/components';
import { useUserContext } from '@core/contexts';
import { acceptInviteByToken, getInviteByToken } from '@shared/services';
import './styles/_project-invite-page.scss';

export const ProjectInviteAcceptPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { t, i18n } = useTranslation('remoteProjects');
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect, isLoading: authLoading } = useAuth0();
  const { user } = useUserContext();
  const [invite, setInvite] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await getInviteByToken(token);
        if (!cancelled) setInvite(res.invite);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              t('collaborators.inviteNotFound')
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, t]);

  const handleAccept = async () => {
    if (!token) return;
    if (!isAuthenticated) {
      sessionStorage.setItem('pendingProjectInviteToken', token);
      await loginWithRedirect({
        appState: { returnTo: `/${i18n.language}/projects/invites/${token}` }
      });
      return;
    }
    setAccepting(true);
    setError(null);
    try {
      const res = await acceptInviteByToken(token);
      sessionStorage.removeItem('pendingProjectInviteToken');
      navigate(`/${i18n.language}/projects/${res.projectId}`);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          t('collaborators.acceptFailed')
      );
    } finally {
      setAccepting(false);
    }
  };

  if (loading || authLoading) {
    return <div className="project-invite-page">{t('common.loading')}</div>;
  }

  if (error && !invite) {
    return (
      <div className="project-invite-page">
        <p className="project-invite-page__error">{error}</p>
        <Button onClick={() => navigate(`/${i18n.language}/projects`)}>{t('myProjects')}</Button>
      </div>
    );
  }

  const projectTitle = invite?.project?.title || t('collaborators.aProject');
  const inviterName =
    typeof invite?.invitedBy === 'object' ? invite.invitedBy?.name : t('collaborators.someone');

  return (
    <div className="project-invite-page">
      <h1>{t('collaborators.acceptTitle')}</h1>
      <p>
        {t('collaborators.acceptBody', {
          inviter: inviterName,
          project: projectTitle,
          side: t(`collaborators.side.${invite?.side || 'customer'}`)
        })}
      </p>
      {invite?.email ? (
        <p className="project-invite-page__email">
          {t('collaborators.sentTo', { email: invite.email })}
          {user?.email && user.email.toLowerCase() !== invite.email.toLowerCase()
            ? ` ${t('collaborators.emailMismatchHint')}`
            : ''}
        </p>
      ) : null}
      {error ? <p className="project-invite-page__error">{error}</p> : null}
      <div className="project-invite-page__actions">
        <Button onClick={handleAccept} disabled={accepting || invite?.status !== 'pending'}>
          {isAuthenticated ? t('collaborators.accept') : t('collaborators.loginToAccept')}
        </Button>
        <Button className="button--secondary" onClick={() => navigate(`/${i18n.language}/projects`)}>
          {t('common.cancel', { defaultValue: 'Cancel' })}
        </Button>
      </div>
    </div>
  );
};

export default ProjectInviteAcceptPage;
