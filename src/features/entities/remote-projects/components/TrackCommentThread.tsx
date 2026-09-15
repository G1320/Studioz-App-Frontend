import { useEffect, useMemo, useRef, useState, type FC, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, CornerDownRight, MessageSquare, RotateCcw, X } from 'lucide-react';
import {
  buildTrackThread,
  formatPlaybackTime,
  hiFiAudioEngine,
  isTimedComment,
  messageDomId,
  useAudioCueComment,
  useHiFiAudioEngine
} from '@shared/audio';
import { useProjectMessages, useResolveMessageMutation, useSendMessageMutation } from '@shared/hooks';
import type { ProjectFile, ProjectMessage } from 'src/types/index';
import './styles/_track-comment-thread.scss';

interface TrackCommentThreadProps {
  projectId: string;
  file: ProjectFile;
  currentUserId: string;
  /** Whether the current user may add comments / replies. */
  canComment: boolean;
  /** Whether the current user may resolve / reopen comments. */
  canResolve: boolean;
}

const senderId = (sender: ProjectMessage['senderId']): string =>
  typeof sender === 'string' ? sender : sender._id;

/**
 * Collapsible, per-track review thread. Lives directly under the file's player.
 * Top-level comments can be time-coded; replies nest one level deep.
 */
export const TrackCommentThread: FC<TrackCommentThreadProps> = ({
  projectId,
  file,
  currentUserId,
  canComment,
  canResolve
}) => {
  const { t } = useTranslation('remoteProjects');
  const cueComment = useAudioCueComment();
  const { messages } = useProjectMessages({ projectId });
  const sendMutation = useSendMessageMutation();
  const resolveMutation = useResolveMessageMutation();
  const { currentTime, active } = useHiFiAudioEngine();

  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState<ProjectMessage | null>(null);
  const [showResolved, setShowResolved] = useState(false);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const thread = useMemo(() => buildTrackThread(messages, file._id), [messages, file._id]);
  const pendingCue = cueComment?.pendingCue?.fileId === file._id ? cueComment.pendingCue : null;
  const isActiveTrack = active?.fileId === file._id;

  // Focus the composer when a cue comment is started from the player.
  useEffect(() => {
    if (pendingCue) {
      setReplyTo(null);
      composerRef.current?.focus();
    }
  }, [pendingCue]);

  useEffect(() => {
    const messageId = cueComment?.highlightedMessageId;
    if (!messageId) return;
    const target = messages.find((message) => message._id === messageId);
    if (!target) return;
    const root = target.parentId
      ? messages.find((message) => message._id === String(target.parentId))
      : target;
    if (root?.resolvedAt && !showResolved) {
      setShowResolved(true);
      return;
    }
    requestAnimationFrame(() => {
      document.getElementById(messageDomId(messageId))?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    });
  }, [cueComment?.highlightedMessageId, messages, showResolved]);

  const visibleRoots = showResolved ? thread.roots : thread.roots.filter((r) => !r.resolvedAt);
  const resolvedCount = thread.roots.length - thread.openCount;

  const senderName = (msg: ProjectMessage): string => {
    if (typeof msg.senderId === 'object' && msg.senderId.name) return msg.senderId.name;
    return msg.senderRole.startsWith('customer') ? t('customer') : t('vendor');
  };

  const jumpTo = (msg: ProjectMessage) => {
    if (typeof msg.offsetSeconds !== 'number') return;
    void hiFiAudioEngine.playAt(
      {
        library: 'project',
        containerId: projectId,
        fileId: file._id,
        fileName: file.fileName,
        mimeType: file.mimeType,
        fileSize: file.fileSize
      },
      msg.offsetSeconds
    );
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !canComment || sendMutation.isPending) return;
    const offsetSeconds = replyTo
      ? replyTo.offsetSeconds
      : pendingCue?.offsetSeconds ?? (isActiveTrack ? currentTime : 0);
    try {
      await sendMutation.mutateAsync({
        projectId,
        message: text,
        fileId: file._id,
        parentId: replyTo?._id,
        offsetSeconds
      });
      setDraft('');
      setReplyTo(null);
      cueComment?.clearPendingCue();
    } catch (error) {
      console.error('Failed to post track comment:', error);
    }
  };

  const toggleResolved = (msg: ProjectMessage) => {
    resolveMutation.mutate({ projectId, messageId: msg._id, resolved: !msg.resolvedAt });
  };

  const renderMessage = (msg: ProjectMessage, isReply: boolean) => {
    const own = senderId(msg.senderId) === currentUserId;
    const highlighted = cueComment?.highlightedMessageId === msg._id;
    return (
      <div
        key={msg._id}
        id={messageDomId(msg._id)}
        className={[
          'track-thread__message',
          isReply ? 'track-thread__message--reply' : '',
          own ? 'track-thread__message--own' : '',
          msg.resolvedAt ? 'track-thread__message--resolved' : '',
          highlighted ? 'track-thread__message--highlighted' : ''
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="track-thread__message-header">
          {isReply && <CornerDownRight size={12} aria-hidden />}
          <span className="track-thread__sender">{senderName(msg)}</span>
          {isTimedComment(msg) && (
            <button type="button" className="track-thread__cue" onClick={() => jumpTo(msg)}>
              {formatPlaybackTime(msg.offsetSeconds ?? 0)}
            </button>
          )}
          <span className="track-thread__time">
            {msg.createdAt
              ? new Date(msg.createdAt).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : ''}
          </span>
          {msg.resolvedAt && !isReply && (
            <span className="track-thread__resolved-badge">
              <Check size={10} aria-hidden />
              {t('trackComments.resolved')}
            </span>
          )}
        </div>
        {isTimedComment(msg) ? (
          <button
            type="button"
            className="track-thread__body track-thread__body--jump"
            onClick={() => jumpTo(msg)}
            title={t('trackComments.jumpToTime', {
              time: formatPlaybackTime(msg.offsetSeconds ?? 0)
            })}
          >
            {msg.message}
          </button>
        ) : (
          <div className="track-thread__body">{msg.message}</div>
        )}
        {!isReply && (
          <div className="track-thread__message-actions">
            {canComment && (
              <button
                type="button"
                className="track-thread__action"
                onClick={() => {
                  cueComment?.clearPendingCue();
                  setReplyTo(msg);
                  composerRef.current?.focus();
                }}
              >
                {t('trackComments.reply')}
              </button>
            )}
            {canResolve && (
              <button
                type="button"
                className="track-thread__action"
                onClick={() => toggleResolved(msg)}
                disabled={resolveMutation.isPending}
              >
                {msg.resolvedAt ? (
                  <>
                    <RotateCcw size={12} aria-hidden /> {t('trackComments.reopen')}
                  </>
                ) : (
                  <>
                    <Check size={12} aria-hidden /> {t('trackComments.resolve')}
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const composerPlaceholder = replyTo
    ? t('trackComments.replyPlaceholder', { name: senderName(replyTo) })
    : pendingCue
      ? t('audioPlayer.typeCueComment')
      : t('trackComments.placeholder');

  return (
    <div className="track-thread" role="region" aria-label={t('trackComments.region', { name: file.fileName })}>
      <div className="track-thread__header">
        <MessageSquare size={14} aria-hidden />
        <span className="track-thread__title">
          {thread.total > 0 ? t('trackComments.count', { count: thread.total }) : t('trackComments.empty')}
        </span>
        {resolvedCount > 0 && (
          <button
            type="button"
            className="track-thread__filter"
            onClick={() => setShowResolved((v) => !v)}
            aria-pressed={showResolved}
          >
            {showResolved
              ? t('trackComments.hideResolved', { count: resolvedCount })
              : t('trackComments.showResolved', { count: resolvedCount })}
          </button>
        )}
        <button
          type="button"
          className="track-thread__close"
          onClick={() => cueComment?.closeThread()}
          aria-label={t('common.close')}
        >
          <X size={14} />
        </button>
      </div>

      <div className="track-thread__list">
        {visibleRoots.length === 0 ? (
          <p className="track-thread__hint">
            {thread.total === 0 ? t('trackComments.emptyHint') : t('trackComments.allResolved')}
          </p>
        ) : (
          visibleRoots.map((root) => (
            <div key={root._id} className="track-thread__group">
              {renderMessage(root, false)}
              {thread.repliesFor(root._id).map((reply) => renderMessage(reply, true))}
            </div>
          ))
        )}
      </div>

      {canComment && (
        <form className="track-thread__composer" onSubmit={submit}>
          {(replyTo || pendingCue) && (
            <div className="track-thread__context">
              <span>
                {replyTo
                  ? t('trackComments.replyingTo', { name: senderName(replyTo) })
                  : t('audioPlayer.commentingAt', {
                      time: formatPlaybackTime(pendingCue!.offsetSeconds),
                      file: file.fileName
                    })}
              </span>
              <button
                type="button"
                className="track-thread__context-clear"
                onClick={() => {
                  setReplyTo(null);
                  cueComment?.clearPendingCue();
                }}
                aria-label={t('common.cancel')}
              >
                <X size={12} />
              </button>
            </div>
          )}
          <div className="track-thread__composer-row">
            <textarea
              ref={composerRef}
              className="track-thread__input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={composerPlaceholder}
              rows={1}
              disabled={sendMutation.isPending}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void submit(e);
                }
              }}
            />
            {!replyTo && !pendingCue && isActiveTrack && (
              <button
                type="button"
                className="track-thread__stamp"
                onClick={() =>
                  cueComment?.beginCueComment({
                    library: 'project',
                    containerId: projectId,
                    fileId: file._id,
                    fileName: file.fileName,
                    mimeType: file.mimeType,
                    fileSize: file.fileSize,
                    offsetSeconds: currentTime
                  })
                }
                title={t('audioPlayer.commentAtTime', { time: formatPlaybackTime(currentTime) })}
              >
                @{formatPlaybackTime(currentTime)}
              </button>
            )}
            <button
              type="submit"
              className="track-thread__send"
              disabled={!draft.trim() || sendMutation.isPending}
            >
              {sendMutation.isPending ? t('common.sending') : t('send')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TrackCommentThread;
