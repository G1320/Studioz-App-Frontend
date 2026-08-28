import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useProjectMessages, useSendMessageMutation, useMarkMessagesReadMutation } from '@shared/hooks';
import { useSocket } from '@core/contexts/SocketContext';
import {
  formatPlaybackTime,
  getMessageFileCue,
  getMessageFileId,
  hiFiAudioEngine,
  isTimedComment,
  useAudioCueComment
} from '@shared/audio';
import { ProjectMessage, SenderRole } from 'src/types/index';
import './styles/_project-chat.scss';

interface ProjectChatProps {
  projectId: string;
  currentUserId: string;
  currentUserRole: SenderRole | 'customer' | 'vendor';
  disabled?: boolean;
}

export const ProjectChat: React.FC<ProjectChatProps> = ({
  projectId,
  currentUserId,
  currentUserRole: _currentUserRole,
  disabled = false
}) => {
  const { t } = useTranslation('remoteProjects');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const cueComment = useAudioCueComment();

  const {
    messages,
    isLoading,
    refetch
  } = useProjectMessages({ projectId });
  const socket = useSocket();
  const sendMessageMutation = useSendMessageMutation();
  const markReadMutation = useMarkMessagesReadMutation();

  const refetchMessages = useCallback(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    if (!socket) return;

    const onProjectMessage = (payload: { projectId?: string }) => {
      if (payload?.projectId === projectId) {
        refetchMessages();
      }
    };

    socket.on('project:message', onProjectMessage);
    return () => {
      socket.off('project:message', onProjectMessage);
    };
  }, [socket, projectId, refetchMessages]);

  useEffect(() => {
    const el = messagesEndRef.current;
    if (el?.parentElement) {
      el.parentElement.scrollTop = el.parentElement.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      const unreadMessages = messages.filter(
        (msg: ProjectMessage) => !msg.readAt && getSenderId(msg.senderId) !== currentUserId
      );
      if (unreadMessages.length > 0) {
        markReadMutation.mutate({
          projectId,
          messageIds: unreadMessages.map((m: ProjectMessage) => m._id)
        });
      }
    }
  }, [messages, currentUserId, projectId]);

  const getSenderId = (sender: string | { _id: string }): string => {
    return typeof sender === 'string' ? sender : sender._id;
  };

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

  const handleJumpToCue = (msg: ProjectMessage) => {
    const file = getMessageFileCue(msg.fileId);
    const fileId = getMessageFileId(msg.fileId);
    if (!file || !fileId || typeof msg.offsetSeconds !== 'number') return;
    void hiFiAudioEngine.playAt(
      {
        library: 'project',
        containerId: projectId,
        fileId,
        fileName: file.fileName,
        mimeType: file.mimeType,
        fileSize: file.fileSize
      },
      msg.offsetSeconds
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || disabled) return;

    try {
      await sendMessageMutation.mutateAsync({
        projectId,
        message: newMessage.trim(),
        fileId: cueComment?.pendingCue?.fileId,
        offsetSeconds: cueComment?.pendingCue?.offsetSeconds
      });
      setNewMessage('');
      cueComment?.clearPendingCue();
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
    <div className="project-chat">
      <div className="project-chat__header">
        <h3 className="project-chat__title">{t('messages')}</h3>
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
              } ${
                cueComment?.highlightedMessageId === msg._id ? 'project-chat__message--highlighted' : ''
              }`}
            >
              <div className="project-chat__message-header">
                <span className="project-chat__message-sender">{getSenderName(msg)}</span>
                <span className="project-chat__message-time">{formatTime(msg.createdAt)}</span>
              </div>
              {isTimedComment(msg) && (
                <button
                  type="button"
                  className="project-chat__cue"
                  onClick={() => handleJumpToCue(msg)}
                >
                  {formatPlaybackTime(msg.offsetSeconds ?? 0)}
                  {getMessageFileCue(msg.fileId)?.fileName
                    ? ` · ${getMessageFileCue(msg.fileId)?.fileName}`
                    : ''}
                </button>
              )}
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
            {t('audioPlayer.commentingAt', {
              time: formatPlaybackTime(cueComment.pendingCue.offsetSeconds),
              file: cueComment.pendingCue.fileName
            })}
          </span>
          <button
            type="button"
            className="project-chat__pending-cue-clear"
            onClick={() => cueComment.clearPendingCue()}
            aria-label={t('common.cancel')}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <form className="project-chat__input-form" onSubmit={handleSendMessage}>
        <textarea
          ref={cueComment ? cueComment.composerRef : undefined}
          className="project-chat__input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            cueComment?.pendingCue ? t('audioPlayer.typeCueComment') : t('typeMessage')
          }
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
    </div>
  );
};

export default ProjectChat;
