import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotificationsPage from './NotificationsPage';
import Notification from '@appTypes/notification';

const getNotifications = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, defaultValue?: string) => defaultValue || _key,
    i18n: { language: 'en' }
  })
}));

vi.mock('@core/contexts/UserContext', () => ({
  useUserContext: () => ({ user: { _id: 'user-1' } })
}));

vi.mock('@core/contexts/NotificationContext', () => ({
  useNotificationContext: () => ({
    markAllAsRead: vi.fn(),
    archiveAllRead: vi.fn(),
    unreadCount: 1
  })
}));

vi.mock('@shared/services/notification-service', () => ({
  getNotifications: (...args: unknown[]) => getNotifications(...args)
}));

vi.mock('@shared/components', () => ({
  PageHeader: ({ title, children, meta }: any) => (
    <div>
      <h1>{title}</h1>
      {meta}
      {children}
    </div>
  )
}));

vi.mock('@shared/components/icons', () => ({
  NotificationsIcon: () => <span data-testid="notifications-icon" />
}));

vi.mock('@shared/components/notifications/components/NotificationItem', () => ({
  NotificationItem: ({ notification, variant }: { notification: Notification; variant?: string }) => (
    <div data-testid={`item-${notification._id}`} data-variant={variant}>
      {notification.title}
    </div>
  )
}));

const activeNotification: Notification = {
  _id: 'active-1',
  userId: 'user-1',
  type: 'system_alert',
  category: 'system',
  title: 'Active alert',
  message: 'Active',
  read: false,
  priority: 'medium',
  createdAt: '2026-01-01T00:00:00.000Z'
};

const archivedNotification: Notification = {
  _id: 'archived-1',
  userId: 'user-1',
  type: 'system_alert',
  category: 'system',
  title: 'Archived alert',
  message: 'Archived',
  read: true,
  priority: 'medium',
  archivedAt: '2026-01-02T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z'
};

function renderPage() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={client}>
      <NotificationsPage />
    </QueryClientProvider>
  );
}

describe('NotificationsPage archive view', () => {
  beforeEach(() => {
    getNotifications.mockReset();
    getNotifications.mockImplementation(async (options?: { archived?: boolean }) => {
      if (options?.archived) return [archivedNotification];
      return [activeNotification];
    });
  });

  it('loads active notifications and switches to archive', async () => {
    renderPage();

    expect(await screen.findByTestId('item-active-1')).toHaveAttribute('data-variant', 'active');
    expect(getNotifications).toHaveBeenCalledWith(
      expect.objectContaining({ archived: false })
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Archive' }));

    expect(await screen.findByTestId('item-archived-1')).toHaveAttribute('data-variant', 'archived');
    expect(getNotifications).toHaveBeenCalledWith(
      expect.objectContaining({ archived: true })
    );
  });
});
