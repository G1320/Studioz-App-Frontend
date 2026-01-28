import { useState, useEffect, useRef } from 'react';
import { Button } from '@shared/components';
import { useTranslation } from 'react-i18next';
import { useProjectMessages, useSendMessageMutation, useMarkMessagesReadMutation } from '@shared/hooks';
import { ProjectMessage } from 'src/types/index';
import './styles/_project-chat.scss';

interface ProjectChatProps {
  projectId: string;
  currentUserId: string;
  currentUserRole: 'customer' | 'vendor';
  disabled?: boolean;
}

export const ProjectChat: React.FC<ProjectChatProps> = ({
  projectId,
  currentUserId,
  currentUserRole: _currentUserRole,
  disabled = false,
}) => {
  const { t } = useTranslation('common');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');

  const { messages, isLoading, refetch } = useProjectMessages({ projectId });
  const sendMessageMutation = useSendMessageMutation();
  const markReadMutation = useMarkMessagesReadMutation();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when component mounts or new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const unreadMessages = messages.filter(
        (msg: ProjectMessage) =>
          !msg.readAt && getSenderId(msg.senderId) !== currentUserId
      );
      if (unreadMessages.length > 0) {
        markReadMutation.mutate({
          projectId,
          userId: currentUserId,
          messageIds: unreadMessages.map((m: ProjectMessage) => m._id),
        });
      }
    }
  }, [messages, currentUserId, projectId]);

  const getSenderId = (sender: string | { _id: string }): string => {
    return typeof sender === 'string' ? sender : sender._id;
  };

  const getSenderName = (msg: ProjectMessage): string => {
    if (typeof msg.senderId === 'object' && msg.senderId.name) {
      return msg.senderId.name;
    }
    return msg.senderRole === 'customer'
      ? t('remoteProjects.customer', 'Customer')
      : t('remoteProjects.studio', 'Studio');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || disabled) return;

    try {
      await sendMessageMutation.mutateAsync({
        projectId,
        senderId: currentUserId,
        message: newMessage.trim(),
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
      minute: '2-digit',
    });
  };

  const isOwnMessage = (msg: ProjectMessage): boolean => {
    return getSenderId(msg.senderId) === currentUserId;
  };

  return (
    <div className="project-chat">
      <h3 className="project-chat__title">
        {t('remoteProjects.messages', 'Messages')}
      </h3>

      <div className="project-chat__messages">
        {isLoading ? (
          <div className="project-chat__loading">
            {t('common.loading', 'Loading...')}
          </div>
        ) : messages.length === 0 ? (
          <div className="project-chat__empty">
            {t('remoteProjects.noMessages', 'No messages yet. Start the conversation!')}
          </div>
        ) : (
          messages.map((msg: ProjectMessage) => (
            <div
              key={msg._id}
              className={`project-chat__message ${
                isOwnMessage(msg)
                  ? 'project-chat__message--own'
                  : 'project-chat__message--other'
              }`}
            >
              <div className="project-chat__message-header">
                <span className="project-chat__message-sender">
                  {getSenderName(msg)}
                </span>
                <span className="project-chat__message-time">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
              <div className="project-chat__message-content">{msg.message}</div>
              {msg.readAt && isOwnMessage(msg) && (
                <span className="project-chat__message-read">
                  {t('remoteProjects.read', 'Read')}
                </span>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="project-chat__input-form" onSubmit={handleSendMessage}>
        <textarea
          className="project-chat__input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t('remoteProjects.typeMessage', 'Type your message...')}
          disabled={disabled || sendMessageMutation.isPending}
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />
        <Button
          type="submit"
          className="button--primary"
          disabled={!newMessage.trim() || disabled || sendMessageMutation.isPending}
        >
          {sendMessageMutation.isPending
            ? t('common.sending', 'Sending...')
            : t('remoteProjects.send', 'Send')}
        </Button>
      </form>
    </div>
  );
};

export default ProjectChat;
