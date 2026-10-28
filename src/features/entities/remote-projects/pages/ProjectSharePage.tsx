import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BadgeCheck, Download, KeyRound, Loader2, Lock } from 'lucide-react';
import { Button } from '@shared/components';
import { RemoteAudioPlayer, StickyRemoteAudioBar } from '@shared/components/audio';
import { hiFiAudioEngine, type HiFiTrackIdentity } from '@shared/audio';
import { useUserContext } from '@core/contexts';
import {
  formatFileSize,
  getSharedFileDownloadUrl,
  getSharedMessages,
  getSharedProject,
  joinSharedProject,
  unlockSharedProject
} from '@shared/services';
import type { SharedProjectFile } from 'src/types';
import { isPlayableAudioExtension } from '@shared/constants/remoteProjectFileLimits';
import { setAuthReturnTo } from '@shared/utils/authReturnTo';
import { SharedTrackComments } from '../components/SharedTrackComments';
import './styles/_project-invite-page.scss';
import './styles/_project-share-page.scss';

const JOIN_INTENT_KEY = 'pendingShareJoinToken';
/** Guests have no realtime socket; poll so studio replies show up while the page is open. */
const GUEST_COMMENTS_POLL_MS = 20 * 1000;

function apiErrorMessage(err: unknown): string | undefined {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
}

export const ProjectSharePage: React.FC = () => {
  const { token = '' } = useParams<{ token: string }>();
  const { t, i18n } = useTranslation('remoteProjects');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, loginWithPopup, loginWithRedirect, isLoading: authLoading } = useAuth0();
  const { user } = useUserContext();
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [pendingComment, setPendingComment] = useState<{ fileId: string; offsetSeconds: number } | null>(null);
  const autoJoinStarted = useRef(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['sharedProject', token],
    queryFn: () => getSharedProject(token),
    enabled: !!token,
    retry: false,
    staleTime: 60 * 1000
  });
  const shared = data && !data.passwordRequired ? data : null;
  const canComment = shared?.shareLink.canComment === true;

  const { data: commentsData, refetch: refetchComments } = useQuery({
    queryKey: ['sharedMessages', token],
    queryFn: () => getSharedMessages(token),
    enabled: canComment,
    refetchInterval: GUEST_COMMENTS_POLL_MS
  });
  const comments = commentsData?.messages ?? [];

  useEffect(() => () => hiFiAudioEngine.stop(), []);

  const handleUnlock = async (e: FormEvent) => {
    e.preventDefault();
    if (!password || unlocking) return;
    setUnlocking(true);
    setUnlockError(null);
    try {
      await unlockSharedProject(token, password);
      setPassword('');
      await queryClient.invalidateQueries({ queryKey: ['sharedProject', token] });
    } catch (err: unknown) {
      setUnlockError(apiErrorMessage(err) || t('sharePage.wrongPassword'));
    } finally {
      setUnlocking(false);
    }
  };

  const handleDownload = async (file: SharedProjectFile) => {
    setDownloadingId(file._id);
    try {
      const { downloadUrl } = await getSharedFileDownloadUrl(token, file._id);
      const res = await fetch(downloadUrl, { mode: 'cors' });
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      const blobUrl = URL.createObjectURL(await res.blob());
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = file.fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download shared file:', err);
      alert(t('downloadFailed'));
    } finally {
      setDownloadingId(null);
    }
  };

  const join = async () => {
    setJoining(true);
    setJoinError(null);
    try {
      const res = await joinSharedProject(token);
      sessionStorage.removeItem(JOIN_INTENT_KEY);
      await queryClient.invalidateQueries({ queryKey: ['remoteProjects'] });
      navigate(`/${i18n.language}/projects/${res.projectId}`);
    } catch (err: unknown) {
      setJoinError(apiErrorMessage(err) || t('sharePage.joinFailed'));
    } finally {
      setJoining(false);
    }
  };

  const handleJoin = async () => {
    if (isAuthenticated && user?._id) {
      await join();
      return;
    }
    const returnTo = `/${i18n.language}/projects/share/${token}`;
    sessionStorage.setItem(JOIN_INTENT_KEY, token);
    setAuthReturnTo(returnTo);
    const uiLocales = i18n.language?.startsWith('he') ? 'he' : 'en';
    try {
      await loginWithPopup({ authorizationParams: { ui_locales: uiLocales } });
    } catch {
      await loginWithRedirect({ appState: { returnTo }, authorizationParams: { ui_locales: uiLocales } });
    }
  };

  // Finish a join the user started before signing in (popup or redirect).
  useEffect(() => {
    if (autoJoinStarted.current || authLoading || joining || !shared?.shareLink.requiresLogin) return;
    if (!isAuthenticated || !user?._id || sessionStorage.getItem(JOIN_INTENT_KEY) !== token) return;
    autoJoinStarted.current = true;
    void join();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when the Studioz session is ready
  }, [authLoading, isAuthenticated, user?._id, shared, token, joining]);

  if (isLoading) {
    return (
      <div className="project-invite-page project-invite-page--status">
        <div className="project-invite-page__panel" aria-busy="true">
          <div className="project-invite-page__spinner" />
          <p className="project-invite-page__status-text">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="project-invite-page project-invite-page--status">
        <div className="project-invite-page__panel">
          <p className="project-invite-page__kicker">{t('sharePage.kicker')}</p>
          <h1 className="project-invite-page__title">{t('sharePage.notFound')}</h1>
          <p className="project-invite-page__body">{t('sharePage.notFoundBody')}</p>
        </div>
      </div>
    );
  }

  if (data.passwordRequired) {
    return (
      <div className="project-invite-page project-invite-page--status">
        <form className="project-invite-page__panel project-share-page__unlock" onSubmit={handleUnlock}>
          <p className="project-invite-page__kicker">{data.shareLink.label || t('sharePage.kicker')}</p>
          <h1 className="project-invite-page__title">
            <KeyRound size={20} aria-hidden /> {t('sharePage.passwordTitle')}
          </h1>
          <p className="project-invite-page__body">{t('sharePage.passwordBody')}</p>
          <input
            type="password"
            className="project-share-page__password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('sharePage.passwordPlaceholder')}
            aria-label={t('sharePage.passwordPlaceholder')}
            autoComplete="current-password"
            autoFocus
          />
          {unlockError ? <p className="project-invite-page__error">{unlockError}</p> : null}
          <Button type="submit" className="button--primary" disabled={!password || unlocking}>
            {unlocking ? t('common.processing') : t('sharePage.unlock')}
          </Button>
        </form>
      </div>
    );
  }

  const { project, shareLink, files } = data;
  const studioName = project.studioName?.[i18n.language?.startsWith('he') ? 'he' : 'en'] || project.studioName?.en;
  const memberCapabilities = shareLink.capabilities.filter((c) => c === 'upload' || c === 'edit');

  return (
    <div className="project-share-page">
      <header className="project-share-page__header">
        {project.artworkUrl ? (
          <img className="project-share-page__artwork" src={project.artworkUrl} alt="" />
        ) : null}
        <div className="project-share-page__heading">
          <p className="project-invite-page__kicker">{shareLink.label || t('sharePage.kicker')}</p>
          <h1 className="project-share-page__title">{project.title}</h1>
          {studioName ? <p className="project-share-page__studio">{studioName}</p> : null}
          <p className="project-share-page__quality">
            <BadgeCheck size={14} aria-hidden /> {t('sharePage.originalQuality')}
          </p>
        </div>
      </header>

      {shareLink.requiresLogin && (
        <section className="project-share-page__join">
          <div>
            <h2 className="project-share-page__join-title">{t('sharePage.joinTitle')}</h2>
            <p className="project-share-page__join-body">
              {t('sharePage.joinBody', {
                role: t(`permissions.roles.${shareLink.role}.name`),
                abilities: memberCapabilities.map((c) => t(`permissions.capabilities.${c}.name`)).join(', ')
              })}
            </p>
            {joinError ? <p className="project-invite-page__error">{joinError}</p> : null}
          </div>
          <Button className="button--primary" onClick={handleJoin} disabled={joining || authLoading}>
            {joining
              ? t('common.processing')
              : isAuthenticated
                ? t('sharePage.join')
                : t('sharePage.loginToJoin')}
          </Button>
        </section>
      )}

      {shareLink.downloadsLocked && (
        <p className="project-share-page__lock-note">
          <Lock size={14} aria-hidden /> {t('sharePage.downloadsLocked')}
        </p>
      )}

      {files.length === 0 ? (
        <p className="project-share-page__empty">{t('noFiles')}</p>
      ) : (
        <ul className="project-share-page__files">
          {files.map((file, index) => {
            const playable = isPlayableAudioExtension(file.fileName);
            const displayName = file.fileName.replace(/\.[^/.]+$/, '') || file.fileName;
            const track: HiFiTrackIdentity = {
              library: 'share',
              containerId: token,
              fileId: file._id,
              fileName: file.fileName,
              mimeType: file.mimeType,
              fileSize: file.fileSize,
              artworkUrl: project.artworkUrl,
              contextLabel: project.title
            };
            return (
              <li key={file._id} className="project-share-page__file">
                <div className="project-share-page__file-row">
                  <span className="project-share-page__file-index" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className="project-share-page__file-name" title={file.fileName}>
                    {displayName}
                  </span>
                  <span className="project-share-page__file-size">{formatFileSize(file.fileSize)}</span>
                  {shareLink.canDownload && (
                    <button
                      type="button"
                      className="project-share-page__download"
                      onClick={() => handleDownload(file)}
                      disabled={!file.downloadable || downloadingId === file._id}
                      aria-label={file.downloadable ? t('download') : t('sharePage.downloadsLocked')}
                      title={file.downloadable ? t('download') : t('sharePage.downloadsLocked')}
                    >
                      {downloadingId === file._id ? (
                        <Loader2 size={16} className="project-share-page__spin" aria-hidden />
                      ) : file.downloadable ? (
                        <Download size={16} aria-hidden />
                      ) : (
                        <Lock size={16} aria-hidden />
                      )}
                    </button>
                  )}
                </div>
                {playable ? (
                  <RemoteAudioPlayer
                    library="share"
                    containerId={token}
                    file={file}
                    enableCues={false}
                    showThreadToggle={false}
                    artworkUrl={project.artworkUrl}
                    contextLabel={project.title}
                    onDownload={file.downloadable ? () => handleDownload(file) : undefined}
                    cueMessages={canComment ? comments : undefined}
                    onCommentAt={
                      canComment
                        ? (offsetSeconds) => setPendingComment({ fileId: file._id, offsetSeconds })
                        : undefined
                    }
                  />
                ) : (
                  <p className="project-share-page__not-playable">{t('sharePage.notPlayable')}</p>
                )}
                {canComment && playable && (
                  <SharedTrackComments
                    token={token}
                    track={track}
                    messages={comments}
                    pendingOffset={pendingComment?.fileId === file._id ? pendingComment.offsetSeconds : null}
                    onClearPending={() => setPendingComment(null)}
                    onPosted={() => void refetchComments()}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
      <StickyRemoteAudioBar />
    </div>
  );
};

export default ProjectSharePage;
