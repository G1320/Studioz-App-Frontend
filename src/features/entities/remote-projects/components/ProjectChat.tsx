import { useState, useEffect, useRef } from 'react';
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

// Demo messages for preview
const DEMO_MESSAGES: ProjectMessage[] = [
  {
    _id: 'msg-1',
    projectId: 'demo-1',
    senderId: { _id: 'customer-1', name: 'Daniel Cohen' },
    senderRole: 'customer',
    message: 'Hey! Just uploaded the tracks. Looking forward to hearing what you can do with them!',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    readAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 3600000).toISOString()
  },
  {
    _id: 'msg-2',
    projectId: 'demo-1',
    senderId: { _id: 'vendor-1', name: 'Pulse Studios' },
    senderRole: 'vendor',
    message:
      "Thanks Daniel! Got the files. Great recordings! I'll start working on the mix today. Any specific references for the drum sound you're going for?",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 7200000).toISOString(),
    readAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'msg-3',
    projectId: 'demo-1',
    senderId: { _id: 'customer-1', name: 'Daniel Cohen' },
    senderRole: 'customer',
    message:
      'Yeah! Check out "Let It Happen" by Tame Impala - love how punchy yet spacious the drums sound there. Also added a Spotify link to the project references.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 1800000).toISOString()
  },
  {
    _id: 'msg-4',
    projectId: 'demo-1',
    senderId: { _id: 'vendor-1', name: 'Pulse Studios' },
    senderRole: 'vendor',
    message:
      "Perfect reference! I know exactly what you mean. I'll aim for that warm analog feel with some tape saturation. Should have the first mix ready by tomorrow evening.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString()
  },
  {
    _id: 'msg-5',
    projectId: 'demo-1',
    senderId: { _id: 'customer-1', name: 'Daniel Cohen' },
    senderRole: 'customer',
    message: "Awesome, can't wait! 🎵",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 7200000).toISOString(),
    readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const ProjectChat: React.FC<ProjectChatProps> = ({
  projectId,
  currentUserId,
  currentUserRole: _currentUserRole,
  disabled = false
}) => {
  const { t } = useTranslation('remoteProjects');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [demoMessages, setDemoMessages] = useState<ProjectMessage[]>(DEMO_MESSAGES);

  // Check if this is a demo project
  const isDemoProject = projectId?.startsWith('demo-');

  const {
    messages: realMessages,
    isLoading,
    refetch
  } = useProjectMessages({
    projectId: isDemoProject ? '' : projectId
  });
  const sendMessageMutation = useSendMessageMutation();
  const markReadMutation = useMarkMessagesReadMutation();

  // Use demo or real messages
  const messages = isDemoProject ? demoMessages : realMessages;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when component mounts or new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const unreadMessages = messages.filter(
        (msg: ProjectMessage) => !msg.readAt && getSenderId(msg.senderId) !== currentUserId
      );
      if (unreadMessages.length > 0) {
        markReadMutation.mutate({
          projectId,
          userId: currentUserId,
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
      return msg.senderId.name;
    }
    return msg.senderRole === 'customer' ? t('customer') : t('vendor');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || disabled) return;

    // Handle demo mode - add message locally
    if (isDemoProject) {
      const demoMsg: ProjectMessage = {
        _id: `msg-demo-${Date.now()}`,
        projectId,
        senderId: { _id: currentUserId, name: 'You' },
        senderRole: 'vendor',
        message: newMessage.trim(),
        createdAt: new Date().toISOString()
      };
      setDemoMessages((prev) => [...prev, demoMsg]);
      setNewMessage('');
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        projectId,
        senderId: currentUserId,
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
    // In demo mode, vendor messages are "own" (we're viewing as studio)
    if (isDemoProject) {
      return msg.senderRole === 'vendor';
    }
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
              className={`project-chat__message ${
                isOwnMessage(msg) ? 'project-chat__message--own' : 'project-chat__message--other'
              }`}
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
    </div>
  );
};

export default ProjectChat;
