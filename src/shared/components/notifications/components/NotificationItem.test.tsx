import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Notification from '@appTypes/notification';
import { NotificationItem } from './NotificationItem';

const markAsRead = vi.fn();
const archiveNotificationById = vi.fn();
const restoreNotificationById = vi.fn();
const deleteNotificationById = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, defaultValue?: string) => defaultValue || _key,
    i18n: { language: 'en' }
  })
}));

vi.mock('@core/contexts/NotificationContext', () => ({
  useNotificationContext: () => ({
    markAsRead,
    archiveNotificationById,
    restoreNotificationById,
    deleteNotificationById
  })
}));

vi.mock('@core/contexts/ReservationModalContext', () => ({
  useReservationModal: () => ({ openReservationModal: vi.fn() })
}));

vi.mock('@shared/hooks', () => ({
  useReservation: () => ({ data: undefined })
}));

vi.mock('@shared/components/drop-downs/PopupDropdown', () => ({
  usePopupDropdownClose: () => vi.fn()
}));

vi.mock('@shared/components/icons', () => ({
  ArchiveIcon: () => <span data-testid="archive-icon" />,
  UnarchiveIcon: () => <span data-testid="restore-icon" />,
  DeleteIcon: () => <span data-testid="delete-icon" />,
  NotificationIcon: () => <span />,
  CheckCircleIcon: () => <span />,
  CancelIcon: () => <span />,
  ClockIcon: () => <span />,
  EditIcon: () => <span />,
  CampaignIcon: () => <span />,
  MoneyIcon: () => <span />,
  StarIcon: () => <span />,
  CreditCardIcon: () => <span />,
  SyncDisabledIcon: () => <span />,
  BarChartIcon: () => <span />,
  EmailIcon: () => <span />,
  ErrorIcon: () => <span />
}));

const baseNotification: Notification = {
  _id: 'notif-1',
  userId: 'user-1',
  type: 'system_alert',
  category: 'system',
  title: 'System alert',
  message: 'Something happened',
  read: true,
  priority: 'medium',
  createdAt: new Date().toISOString()
};

describe('NotificationItem archive controls', () => {
  beforeEach(() => {
    markAsRead.mockReset();
    archiveNotificationById.mockReset();
    restoreNotificationById.mockReset();
    deleteNotificationById.mockReset();
  });

  it('archives an active notification', () => {
    render(
      <MemoryRouter>
        <NotificationItem notification={baseNotification} variant="active" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText('Archive notification'));
    expect(archiveNotificationById).toHaveBeenCalledWith('notif-1');
    expect(screen.queryByLabelText('Delete notification')).not.toBeInTheDocument();
  });

  it('restores and permanently deletes archived notifications', () => {
    render(
      <MemoryRouter>
        <NotificationItem
          notification={{ ...baseNotification, archivedAt: new Date().toISOString() }}
          variant="archived"
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText('Restore notification'));
    expect(restoreNotificationById).toHaveBeenCalledWith('notif-1');

    fireEvent.click(screen.getByLabelText('Delete notification'));
    expect(deleteNotificationById).toHaveBeenCalledWith('notif-1');
  });
});
