import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components';
import { getMyAccessRequest, requestProjectAccess } from '@shared/services';
import './styles/_project-access-denied.scss';

const PENDING_POLL_MS = 30_000;

interface ProjectAccessDeniedProps {
  projectId: string;
  /** Called once the request is approved so the page can load the project. */
  onGranted: () => void;
}

/** Shown to signed-in people who open a private project link they're not part of. */
export const ProjectAccessDenied: React.FC<ProjectAccessDeniedProps> = ({ projectId, onGranted }) => {
  const { t, i18n } = useTranslation('remoteProjects');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const queryKey = ['myAccessRequest', projectId];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => getMyAccessRequest(projectId),
    refetchInterval: (query) =>
      query.state.data?.request?.status === 'pending' ? PENDING_POLL_MS : false
  });

  const hasAccess = data?.hasAccess === true || data?.request?.status === 'approved';
  useEffect(() => {
    if (hasAccess) onGranted();
  }, [hasAccess, onGranted]);

  const requestMutation = useMutation({
    mutationFn: () => requestProjectAccess(projectId, message.trim() || undefined),
    onSuccess: () => {
      setError(null);
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: unknown) => {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          t('accessRequests.requestFailed')
      );
    }
  });

  const request = data?.request;
  const retryAt = request?.canRequestAgainAt ? new Date(request.canRequestAgainAt) : null;
  const canRequest = !request || request.status !== 'pending';
  const deniedRecently = request?.status === 'denied' && retryAt !== null && retryAt.getTime() > Date.now();

  return (
    <div className="project-access-denied">
      <div className="project-access-denied__card">
        <Lock className="project-access-denied__icon" aria-hidden />
        <h1 className="project-access-denied__title">{t('accessRequests.deniedTitle')}</h1>

        {isLoading ? (
          <p className="project-access-denied__body">{t('common.loading')}</p>
        ) : request?.status === 'pending' ? (
          <p className="project-access-denied__body" role="status">
            {t('accessRequests.pendingBody', { date: new Date(request.createdAt).toLocaleDateString() })}
          </p>
        ) : deniedRecently ? (
          <p className="project-access-denied__body" role="status">
            {t('accessRequests.deniedBody', { date: retryAt.toLocaleString() })}
          </p>
        ) : (
          <>
            <p className="project-access-denied__body">{t('accessRequests.deniedHint')}</p>
            {canRequest ? (
              <form
                className="project-access-denied__form"
                onSubmit={(e) => {
                  e.preventDefault();
                  requestMutation.mutate();
                }}
              >
                <label className="project-access-denied__label" htmlFor="access-request-message">
                  {t('accessRequests.messageLabel')}
                </label>
                <textarea
                  id="access-request-message"
                  className="project-access-denied__message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('accessRequests.messagePlaceholder')}
                  maxLength={500}
                  rows={3}
                />
                {error ? <p className="project-access-denied__error">{error}</p> : null}
                <Button type="submit" className="button--primary" disabled={requestMutation.isPending}>
                  {requestMutation.isPending ? t('common.sending') : t('accessRequests.request')}
                </Button>
              </form>
            ) : null}
          </>
        )}

        <Button onClick={() => navigate(`/${i18n.language}/projects`)} className="button--secondary">
          {t('accessRequests.backToProjects')}
        </Button>
      </div>
    </div>
  );
};
