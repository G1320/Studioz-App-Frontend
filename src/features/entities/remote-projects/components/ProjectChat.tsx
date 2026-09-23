import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useProjectMessages, useSendMessageMutation, useMarkMessagesReadMutation } from '@shared/hooks';
import { formatPlaybackTime, isTrackComment, useAudioCueComment } from '@shared/audio';
import { ProjectMessage, SenderRole } from 'src/types/index';
import './styles/_project-chat.scss';

interface ProjectChatProps {
  projectId: string;
  currentUserId: string;
  currentUserRole: SenderRole | 'customer' | 'vendor';
  disabled?: boolean;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

const getSenderId = (sender: string | { _id: string }): string => {
  return typeof sender === 'string' ? sender : sender._id;
};

export const ProjectChat: React.FC<ProjectChatProps> = ({
  projectId,
  currentUserId,
  currentUserRole: _currentUserRole,
  disabled = false,
  collapsed = false,
  onToggleCollapsed
}) => {
  const { t } = useTranslation('remoteProjects');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const cueComment = useAudioCueComment();

  const { messages: allMessages, isLoading, refetch } = useProjectMessages({ projectId });
  // Track-bound comments are shown in each file's thread; the chat stays general.
  const messages = useMemo(() => allMessages.filter((m) => !isTrackComment(m)), [allMessages]);
  const trackCommentCount = allMessages.length - messages.length;
  const unreadCount = messages.filter(
    (message) => !message.readAt && getSenderId(message.senderId) !== currentUserId
  ).length;
  const sendMessageMutation = useSendMessageMutation();
  const { mutate: markMessagesRead } = useMarkMessagesReadMutation();

  useEffect(() => {
    const messageId = cueComment?.highlightedMessageId;
    if (collapsed && messageId && messages.some((message) => message._id === messageId)) {
      onToggleCollapsed?.();
    }
  }, [collapsed, cueComment?.highlightedMessageId, messages, onToggleCollapsed]);

  useEffect(() => {
    if (collapsed) return;
    const el = messagesEndRef.current;
    if (el?.parentElement) {
      el.parentElement.scrollTop = el.parentElement.scrollHeight;
    }
  }, [collapsed, messages]);

  useEffect(() => {
    if (collapsed) return;
    const messageId = cueComment?.highlightedMessageId;
    if (!messageId || !messages.some((message) => message._id === messageId)) return;
    requestAnimationFrame(() => {
      document.getElementById(`project-message-${messageId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    });
  }, [collapsed, cueComment?.highlightedMessageId, messages]);

  useEffect(() => {
    if (!collapsed && messages.length > 0) {
      const unreadMessages = messages.filter(
        (msg: ProjectMessage) => !msg.readAt && getSenderId(msg.senderId) !== currentUserId
      );
      if (unreadMessages.length > 0) {
        markMessagesRead({
          projectId,
          messageIds: unreadMessages.map((m: ProjectMessage) => m._id)
        });
      }
    }
  }, [collapsed, currentUserId, markMessagesRead, messages, projectId]);

  const getSenderName = (msg: ProjectMessage): string => {
    if (typeof msg.senderId === 'object' && msg.senderId.name) {
      const base = msg.senderId.name;
      if (msg.senderRole === 'customer_collaborator' || msg.senderRole === 'vendor_collaborator') {
        return `${base} (${t('collaborators.badge')})`;
      }
      return base;
    }
    if (msg.senderRole === 'customer_collaborator') return t('collaborators.customerCollaborator');
    if (msg.senderRole === 'vendor_collaborator') return t('collaborators.vendorCollaborator');
    return msg.senderRole === 'customer' ? t('customer') : t('vendor');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || disabled) return;

    try {
      await sendMessageMutation.mutateAsync({
        projectId,
        message: newMessage.trim()
      });
      setNewMessage('');
      refetch();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatTime = (dateStr: string | undefined): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOwnMessage = (msg: ProjectMessage): boolean => {
    return getSenderId(msg.senderId) === currentUserId;
  };

  return (
    <div className={`project-chat${collapsed ? ' project-chat--collapsed' : ''}`}>
      {collapsed ? (
        <button
          type="button"
          className="project-chat__collapsed-toggle"
          onClick={onToggleCollapsed}
          aria-label={t('expandProjectChat')}
          aria-expanded={false}
        >
          <MessageSquare aria-hidden />
          <span className="project-chat__collapsed-label">{t('projectChat')}</span>
          {unreadCount > 0 && <span className="project-chat__unread-count">{unreadCount}</span>}
          <PanelRightOpen className="project-chat__panel-icon" aria-hidden />
        </button>
      ) : (
        <>
          <div className="project-chat__header">
            <div className="project-chat__header-copy">
              <h3 className="project-chat__title">
                <MessageSquare aria-hidden />
                {t('projectChat')}
              </h3>
              {trackCommentCount > 0 && (
                <span className="project-chat__track-hint" title={t('trackComments.chatHintTitle')}>
                  {t('trackComments.chatHint', { count: trackCommentCount })}
                </span>
              )}
            </div>
            {onToggleCollapsed && (
              <button
                type="button"
                className="project-chat__collapse-button"
                onClick={onToggleCollapsed}
                aria-label={t('collapseProjectChat')}
                aria-expanded={true}
              >
                <PanelRightClose aria-hidden />
              </button>
            )}
          </div>

          <div className="project-chat__messages">
            {isLoading ? (
              <div className="project-chat__loading">{t('common.loading')}</div>
            ) : messages.length === 0 ? (
              <div className="project-chat__empty">{t('noMessages')}</div>
            ) : (
              messages.map((msg: ProjectMessage) => (
                <div
                  key={msg._id}
                  id={`project-message-${msg._id}`}
                  className={`project-chat__message ${
                    isOwnMessage(msg) ? 'project-chat__message--own' : 'project-chat__message--other'
                  } ${cueComment?.highlightedMessageId === msg._id ? 'project-chat__message--highlighted' : ''}`}
                >
                  <div className="project-chat__message-header">
                    <span className="project-chat__message-sender">{getSenderName(msg)}</span>
                    <span className="project-chat__message-time">{formatTime(msg.createdAt)}</span>
                  </div>
                  <div className="project-chat__message-content">{msg.message}</div>
                  {msg.readAt && isOwnMessage(msg) && <span className="project-chat__message-read">{t('read')}</span>}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {cueComment?.pendingCue && (
            <div className="project-chat__pending-cue">
              <span>
                {t('trackComments.pendingInThread', {
                  time: formatPlaybackTime(cueComment.pendingCue.offsetSeconds),
                  file: cueComment.pendingCue.fileName
                })}
              </span>
            </div>
          )}

          <form className="project-chat__input-form" onSubmit={handleSendMessage}>
            <textarea
              className="project-chat__input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('typeMessage')}
              disabled={disabled || sendMessageMutation.isPending}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button
              type="submit"
              className="project-chat__send-button"
              disabled={!newMessage.trim() || disabled || sendMessageMutation.isPending}
            >
              {sendMessageMutation.isPending ? t('common.sending') : t('send')}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ProjectChat;
