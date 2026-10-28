import { useEffect, useMemo, useRef, useState, type FC, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { CornerDownRight, MessageSquare, X } from 'lucide-react';
import {
  buildTrackThread,
  formatPlaybackTime,
  getMessageSenderName,
  hiFiAudioEngine,
  isGuestMessage,
  isTimedComment,
  useHiFiAudioEngine,
  type HiFiTrackIdentity
} from '@shared/audio';
import { sendSharedMessage } from '@shared/services';
import type { ProjectMessage } from 'src/types';
import './styles/_shared-track-comments.scss';

const GUEST_NAME_STORAGE_KEY = 'shareGuestName';

export function loadGuestName(): string {
  try {
    return localStorage.getItem(GUEST_NAME_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

function saveGuestName(name: string) {
  try {
    localStorage.setItem(GUEST_NAME_STORAGE_KEY, name);
  } catch {
    // Storage unavailable: the name is kept for this page only.
  }
}

interface SharedTrackCommentsProps {
  token: string;
  track: HiFiTrackIdentity;
  messages: ProjectMessage[];
  /** Offset requested from the player's "Comment at" button. */
  pendingOffset: number | null;
  onClearPending: () => void;
  onPosted: () => void;
}

/** Guest review thread on the public share page: every track comment on files the link covers. */
export const SharedTrackComments: FC<SharedTrackCommentsProps> = ({
  token,
  track,
  messages,
  pendingOffset,
  onClearPending,
  onPosted
}) => {
  const { t } = useTranslation('remoteProjects');
  const { active, currentTime } = useHiFiAudioEngine();
  const thread = useMemo(() => buildTrackThread(messages, track.fileId), [messages, track.fileId]);
  const [open, setOpen] = useState(false);
  const [guestName, setGuestName] = useState(loadGuestName);
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState<ProjectMessage | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (pendingOffset === null) return;
    setOpen(true);
    setReplyTo(null);
    requestAnimationFrame(() => composerRef.current?.focus());
  }, [pendingOffset]);

  const isActiveTrack = active?.library === 'share' && active.fileId === track.fileId;

  const senderName = (msg: ProjectMessage) => {
    const name = getMessageSenderName(msg);
    if (!name) return msg.senderRole.startsWith('customer') ? t('customer') : t('vendor');
    return isGuestMessage(msg) ? name : t('trackComments.teamName', { name });
  };

  const jumpTo = (msg: ProjectMessage) => {
    if (typeof msg.offsetSeconds === 'number') void hiFiAudioEngine.playAt(track, msg.offsetSeconds);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    const name = guestName.trim();
    if (!text || sending) return;
    if (!name) {
      setError(t('sharePage.nameRequired'));
      return;
    }
    setSending(true);
    setError(null);
    try {
      await sendSharedMessage(token, {
        guestName: name,
        message: text,
        ...(replyTo
          ? { parentId: replyTo._id }
          : {
              fileId: track.fileId,
              offsetSeconds: pendingOffset ?? (isActiveTrack ? currentTime : 0)
            })
      });
      saveGuestName(name);
      setDraft('');
      setReplyTo(null);
      onClearPending();
      onPosted();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          t('sharePage.commentFailed')
      );
    } finally {
      setSending(false);
    }
  };

  const renderMessage = (msg: ProjectMessage, isReply: boolean) => (
    <div
      key={msg._id}
      className={`shared-comments__message${isReply ? ' shared-comments__message--reply' : ''}`}
    >
      <div className="shared-comments__meta">
        {isReply && <CornerDownRight size={12} aria-hidden />}
        <span className="shared-comments__sender">{senderName(msg)}</span>
        {isTimedComment(msg) && !isReply && (
          <button type="button" className="shared-comments__cue" onClick={() => jumpTo(msg)}>
            {formatPlaybackTime(msg.offsetSeconds ?? 0)}
          </button>
        )}
      </div>
      <div className="shared-comments__body" dir="auto">
        {msg.message}
      </div>
      {!isReply && (
        <button
          type="button"
          className="shared-comments__reply"
          onClick={() => {
            onClearPending();
            setReplyTo(msg);
            composerRef.current?.focus();
          }}
        >
          {t('trackComments.reply')}
        </button>
      )}
    </div>
  );

  if (!open) {
    return (
      <button type="button" className="shared-comments__toggle" onClick={() => setOpen(true)}>
        <MessageSquare size={14} aria-hidden />
        {thread.total > 0 ? t('trackComments.count', { count: thread.total }) : t('sharePage.addComment')}
      </button>
    );
  }

  const stampOffset = pendingOffset ?? (isActiveTrack ? currentTime : 0);

  return (
    <div className="shared-comments" role="region" aria-label={t('trackComments.region', { name: track.fileName })}>
      <div className="shared-comments__header">
        <MessageSquare size={14} aria-hidden />
        <span>{thread.total > 0 ? t('trackComments.count', { count: thread.total }) : t('trackComments.empty')}</span>
        <button
          type="button"
          className="shared-comments__close"
          onClick={() => {
            setOpen(false);
            onClearPending();
          }}
          aria-label={t('common.close')}
        >
          <X size={14} />
        </button>
      </div>

      {thread.roots.length > 0 && (
        <div className="shared-comments__list">
          {thread.roots.map((root) => (
            <div key={root._id} className="shared-comments__group">
              {renderMessage(root, false)}
              {thread.repliesFor(root._id).map((reply) => renderMessage(reply, true))}
            </div>
          ))}
        </div>
      )}

      <form className="shared-comments__composer" onSubmit={submit}>
        <input
          type="text"
          className="shared-comments__name"
          value={guestName}
          maxLength={60}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder={t('sharePage.namePlaceholder')}
          aria-label={t('sharePage.namePlaceholder')}
          autoComplete="name"
        />
        <div className="shared-comments__context">
          {replyTo
            ? t('trackComments.replyingTo', { name: senderName(replyTo) })
            : t('sharePage.commentingAt', { time: formatPlaybackTime(stampOffset) })}
          {replyTo && (
            <button
              type="button"
              className="shared-comments__context-clear"
              onClick={() => setReplyTo(null)}
              aria-label={t('common.cancel')}
            >
              <X size={12} />
            </button>
          )}
        </div>
        <div className="shared-comments__row">
          <textarea
            ref={composerRef}
            dir="auto"
            className="shared-comments__input"
            value={draft}
            maxLength={2000}
            rows={2}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('trackComments.placeholder')}
            disabled={sending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void submit(e);
              }
            }}
          />
          <button type="submit" className="shared-comments__send" disabled={!draft.trim() || sending}>
            {sending ? t('common.sending') : t('send')}
          </button>
        </div>
        {error && <p className="shared-comments__error">{error}</p>}
      </form>
    </div>
  );
};

export default SharedTrackComments;
