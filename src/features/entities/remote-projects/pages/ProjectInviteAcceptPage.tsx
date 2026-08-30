import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth0 } from '@auth0/auth0-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@shared/components';
import { useUserContext } from '@core/contexts';
import { acceptInviteByToken, getInviteByToken } from '@shared/services';
import {
  clearPendingProjectInvite,
  setAuthReturnTo,
  setPendingProjectInviteToken
} from '@shared/utils/authReturnTo';
import './styles/_project-invite-page.scss';

export const ProjectInviteAcceptPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { t, i18n } = useTranslation('remoteProjects');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, loginWithPopup, loginWithRedirect, isLoading: authLoading } = useAuth0();
  const { user } = useUserContext();
  const [invite, setInvite] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const autoAcceptStarted = useRef(false);

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

  const ensureLoggedIn = async () => {
    if (!token) return;
    const returnTo = `/${i18n.language}/projects/invites/${token}`;
    setPendingProjectInviteToken(token);
    setAuthReturnTo(returnTo);

    // Prefer popup so we never leave this page (avoids Auth0 → `/` round-trip).
    try {
      await loginWithPopup();
      return;
    } catch {
      // Popup blocked / in-app browser — fall back to redirect
      await loginWithRedirect({
        appState: { returnTo }
      });
    }
  };

  const handleAccept = async () => {
    if (!token) return;
    if (!isAuthenticated) {
      await ensureLoggedIn();
      return;
    }
    setAccepting(true);
    setError(null);
    try {
      const res = await acceptInviteByToken(token);
      clearPendingProjectInvite();
      await queryClient.invalidateQueries({ queryKey: ['remoteProjects'] });
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

  // After login (popup or redirect), finish accept once Studioz session exists.
  useEffect(() => {
    if (autoAcceptStarted.current || loading || authLoading || accepting) return;
    if (!token || !isAuthenticated || !user?._id || !invite) return;

    const projectId =
      typeof invite.project === 'object' && invite.project?._id
        ? invite.project._id
        : typeof invite.projectId === 'string'
          ? invite.projectId
          : null;

    // Already accepted (e.g. prior attempt) — go to the project
    if (invite.status === 'accepted' && projectId) {
      autoAcceptStarted.current = true;
      clearPendingProjectInvite();
      navigate(`/${i18n.language}/projects/${projectId}`);
      return;
    }

    if (invite.status !== 'pending') return;
    if (user.email && invite.email && user.email.toLowerCase() !== invite.email.toLowerCase()) {
      return;
    }
    autoAcceptStarted.current = true;
    void handleAccept();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when invite + Studioz user are ready
  }, [token, isAuthenticated, invite, user?._id, user?.email, loading, authLoading, accepting]);

  if (loading || authLoading) {
    return (
      <div className="project-invite-page project-invite-page--status">
        <div className="project-invite-page__panel" aria-busy="true">
          <div className="project-invite-page__spinner" />
          <p className="project-invite-page__status-text">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error && !invite) {
    return (
      <div className="project-invite-page project-invite-page--status">
        <div className="project-invite-page__panel">
          <p className="project-invite-page__kicker">{t('collaborators.acceptTitle')}</p>
          <h1 className="project-invite-page__title">{t('collaborators.inviteNotFound')}</h1>
          <p className="project-invite-page__error">{error}</p>
          <div className="project-invite-page__actions">
            <Button className="button--primary" onClick={() => navigate(`/${i18n.language}/projects`)}>
              {t('myProjects')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const projectTitle = invite?.project?.title || t('collaborators.aProject');
  const inviterName =
    typeof invite?.invitedBy === 'object' ? invite.invitedBy?.name : t('collaborators.someone');
  const emailMismatch =
    Boolean(user?.email && invite?.email && user.email.toLowerCase() !== invite.email.toLowerCase());

  return (
    <div className="project-invite-page">
      <div className="project-invite-page__glow" aria-hidden="true" />
      <div className="project-invite-page__panel">
        <p className="project-invite-page__kicker">{t('collaborators.acceptTitle')}</p>
        <h1 className="project-invite-page__title">{projectTitle}</h1>
        <p className="project-invite-page__body">
          {t('collaborators.acceptBody', { inviter: inviterName })}
        </p>

        {invite?.email ? (
          <div className="project-invite-page__meta">
            <span className="project-invite-page__meta-label">{t('collaborators.sentToLabel')}</span>
            <span className="project-invite-page__meta-value" dir="ltr">
              {invite.email}
            </span>
            {emailMismatch ? (
              <p className="project-invite-page__hint">{t('collaborators.emailMismatchHint')}</p>
            ) : null}
          </div>
        ) : null}

        {error ? <p className="project-invite-page__error">{error}</p> : null}

        <div className="project-invite-page__actions">
          <Button
            className="button--primary"
            onClick={handleAccept}
            disabled={accepting || (invite?.status !== 'pending' && invite?.status !== 'accepted')}
          >
            {accepting
              ? t('common.sending')
              : isAuthenticated
                ? t('collaborators.accept')
                : t('collaborators.loginToAccept')}
          </Button>
          <Button className="button--secondary" onClick={() => navigate(`/${i18n.language}/projects`)}>
            {t('common.cancel', { defaultValue: 'Cancel' })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectInviteAcceptPage;
