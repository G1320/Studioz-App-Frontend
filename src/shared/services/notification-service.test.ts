import { beforeEach, describe, expect, it, vi } from 'vitest';

const getMock = vi.fn();
const patchMock = vi.fn();
const deleteMock = vi.fn();

vi.mock('./http-service', () => ({
  httpService: {
    get: (...args: unknown[]) => getMock(...args),
    patch: (...args: unknown[]) => patchMock(...args),
    delete: (...args: unknown[]) => deleteMock(...args),
    put: vi.fn(),
    post: vi.fn()
  }
}));

import {
  archiveAllReadNotifications,
  archiveNotification,
  deleteNotification,
  getNotifications,
  restoreNotification
} from './notification-service';

describe('notification-service archive APIs', () => {
  beforeEach(() => {
    getMock.mockReset();
    patchMock.mockReset();
    deleteMock.mockReset();
  });

  it('requests active notifications by default and archived when requested', async () => {
    getMock.mockResolvedValue([]);

    await getNotifications({ limit: 20 });
    expect(getMock).toHaveBeenCalledWith('/notifications?limit=20');

    await getNotifications({ archived: true, limit: 20 });
    expect(getMock).toHaveBeenCalledWith('/notifications?archived=true&limit=20');

    await getNotifications({ archived: false, category: 'bookings' });
    expect(getMock).toHaveBeenCalledWith('/notifications?archived=false&category=bookings');
  });

  it('calls archive, archive-read, restore, and delete endpoints', async () => {
    patchMock.mockResolvedValue({ _id: 'n1' });
    deleteMock.mockResolvedValue({ message: 'ok' });

    await archiveNotification('n1');
    expect(patchMock).toHaveBeenCalledWith('/notifications/n1/archive');

    await archiveAllReadNotifications();
    expect(patchMock).toHaveBeenCalledWith('/notifications/archive-read');

    await restoreNotification('n1');
    expect(patchMock).toHaveBeenCalledWith('/notifications/n1/restore');

    await deleteNotification('n1');
    expect(deleteMock).toHaveBeenCalledWith('/notifications/n1');
  });
});
