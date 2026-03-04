import React, { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  getPushPublicKey,
  subscribePush,
  unsubscribePush,
  ChannelPreferences
} from '@shared/services/notification-service';
import { NOTIFICATION_CATEGORIES, NotificationCategory } from '@appTypes/notification';
import '../styles/notification-preferences.scss';

const CATEGORY_ICONS: Record<string, string> = {
  bookings: '📅',
  payments: '💰',
  reviews: '⭐',
  billing: '💳',
  system: '⚙️',
  activity: '🔔'
};

/** Convert a URL-safe base64 string to Uint8Array for applicationServerKey */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const NotificationPreferences: React.FC = () => {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['notificationPreferences'],
    queryFn: getNotificationPreferences
  });

  const registerPushSubscription = useCallback(async (): Promise<boolean> => {
    try {
      setPushError(null);

      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setPushError('Push notifications are not supported in this browser');
        return false;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setPushError('Notification permission was denied');
        return false;
      }

      const { publicKey } = await getPushPublicKey();
      const registration = await navigator.serviceWorker.register('/sw-push.js');
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource
      });

      const raw = subscription.toJSON();
      await subscribePush({
        endpoint: raw.endpoint!,
        keys: { p256dh: raw.keys!.p256dh!, auth: raw.keys!.auth! }
      });

      return true;
    } catch (err: any) {
      console.error('Push subscription error:', err);
      setPushError(err.message || 'Failed to enable push notifications');
      return false;
    }
  }, []);

  const unregisterPushSubscription = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration('/sw-push.js');
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await unsubscribePush(subscription.endpoint);
          await subscription.unsubscribe();
        }
      }
    } catch (err) {
      console.error('Push unsubscribe error:', err);
    }
  }, []);

  const handleToggle = async (category: NotificationCategory, channel: keyof ChannelPreferences) => {
    if (!preferences || channel === 'inApp') return; // inApp is always on

    setSaving(true);
    try {
      const currentCategoryPrefs = preferences.perCategory[category];
      const updatedPerCategory = {
        ...preferences.perCategory,
        [category]: {
          ...currentCategoryPrefs,
          [channel]: !currentCategoryPrefs[channel]
        }
      };

      const updated = await updateNotificationPreferences({
        perCategory: updatedPerCategory
      });
      queryClient.setQueryData(['notificationPreferences'], updated);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleGlobalToggle = async (channel: 'email' | 'push') => {
    if (!preferences) return;

    setSaving(true);
    try {
      const newValue = !preferences.channels[channel];

      // Handle push subscription lifecycle
      if (channel === 'push') {
        if (newValue) {
          const success = await registerPushSubscription();
          if (!success) {
            setSaving(false);
            return; // Don't toggle if registration failed
          }
        } else {
          await unregisterPushSubscription();
        }
        setPushError(null);
      }

      const updated = await updateNotificationPreferences({
        channels: {
          ...preferences.channels,
          [channel]: newValue
        }
      });
      queryClient.setQueryData(['notificationPreferences'], updated);
    } catch (error) {
      console.error('Error updating global channel:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleQuietHoursToggle = async () => {
    if (!preferences) return;

    setSaving(true);
    try {
      const updated = await updateNotificationPreferences({
        quietHours: {
          ...preferences.quietHours,
          enabled: !preferences.quietHours.enabled
        }
      });
      queryClient.setQueryData(['notificationPreferences'], updated);
    } catch (error) {
      console.error('Error toggling quiet hours:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleQuietHoursChange = async (field: 'start' | 'end', value: string) => {
    if (!preferences) return;

    setSaving(true);
    try {
      const updated = await updateNotificationPreferences({
        quietHours: {
          ...preferences.quietHours,
          [field]: value
        }
      });
      queryClient.setQueryData(['notificationPreferences'], updated);
    } catch (error) {
      console.error('Error updating quiet hours:', error);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="notif-prefs__loading">{t('common.loading', 'Loading...')}</div>;
  }

  if (!preferences) return null;

  return (
    <div className="notif-prefs">
      {/* Global Channel Toggles */}
      <div className="notif-prefs__global">
        <div className="notif-prefs__global-row">
          <span className="notif-prefs__global-label">
            {t('notifications.prefs.emailNotifications', 'Email notifications')}
          </span>
          <button
            className={`notif-prefs__toggle ${preferences.channels.email ? 'notif-prefs__toggle--on' : ''}`}
            onClick={() => handleGlobalToggle('email')}
            disabled={saving}
          >
            <span className="notif-prefs__toggle-knob" />
          </button>
        </div>
        <div className="notif-prefs__global-row">
          <span className="notif-prefs__global-label">
            {t('notifications.prefs.pushNotifications', 'Push notifications')}
          </span>
          <button
            className={`notif-prefs__toggle ${preferences.channels.push ? 'notif-prefs__toggle--on' : ''}`}
            onClick={() => handleGlobalToggle('push')}
            disabled={saving}
          >
            <span className="notif-prefs__toggle-knob" />
          </button>
        </div>
        {pushError && <p className="notif-prefs__push-error">{pushError}</p>}
      </div>

      {/* Per-Category Grid */}
      <div className="notif-prefs__grid">
        <div className="notif-prefs__grid-header">
          <span className="notif-prefs__grid-header-cell notif-prefs__grid-header-cell--category">
            {t('notifications.prefs.category', 'Category')}
          </span>
          <span className="notif-prefs__grid-header-cell">{t('notifications.prefs.inApp', 'In-App')}</span>
          <span className="notif-prefs__grid-header-cell">{t('notifications.prefs.email', 'Email')}</span>
          <span className="notif-prefs__grid-header-cell">{t('notifications.prefs.push', 'Push')}</span>
        </div>

        {NOTIFICATION_CATEGORIES.map(({ key }) => {
          const catPrefs = preferences.perCategory[key];
          return (
            <div key={key} className="notif-prefs__grid-row">
              <span className="notif-prefs__grid-cell notif-prefs__grid-cell--category">
                <span className="notif-prefs__category-icon">{CATEGORY_ICONS[key]}</span>
                {t(`notifications.categories.${key}`, key)}
              </span>
              <span className="notif-prefs__grid-cell">
                <button
                  className="notif-prefs__checkbox notif-prefs__checkbox--on notif-prefs__checkbox--disabled"
                  disabled
                  title={t('notifications.prefs.inAppAlwaysOn', 'In-app notifications are always on')}
                >
                  ✓
                </button>
              </span>
              <span className="notif-prefs__grid-cell">
                <button
                  className={`notif-prefs__checkbox ${catPrefs.email && preferences.channels.email ? 'notif-prefs__checkbox--on' : ''}`}
                  onClick={() => handleToggle(key, 'email')}
                  disabled={saving || !preferences.channels.email}
                >
                  {catPrefs.email && preferences.channels.email ? '✓' : ''}
                </button>
              </span>
              <span className="notif-prefs__grid-cell">
                <button
                  className={`notif-prefs__checkbox ${catPrefs.push && preferences.channels.push ? 'notif-prefs__checkbox--on' : ''}`}
                  onClick={() => handleToggle(key, 'push')}
                  disabled={saving || !preferences.channels.push}
                >
                  {catPrefs.push && preferences.channels.push ? '✓' : ''}
                </button>
              </span>
            </div>
          );
        })}
      </div>

      {/* Quiet Hours */}
      <div className="notif-prefs__quiet">
        <div className="notif-prefs__quiet-header">
          <div>
            <span className="notif-prefs__quiet-title">{t('notifications.prefs.quietHours', 'Quiet hours')}</span>
            <span className="notif-prefs__quiet-desc">
              {t('notifications.prefs.quietHoursDesc', 'Suppress non-critical notifications during set hours')}
            </span>
          </div>
          <button
            className={`notif-prefs__toggle ${preferences.quietHours.enabled ? 'notif-prefs__toggle--on' : ''}`}
            onClick={handleQuietHoursToggle}
            disabled={saving}
          >
            <span className="notif-prefs__toggle-knob" />
          </button>
        </div>

        {preferences.quietHours.enabled && (
          <div className="notif-prefs__quiet-times">
            <label className="notif-prefs__quiet-field">
              <span>{t('notifications.prefs.from', 'From')}</span>
              <input
                type="time"
                value={preferences.quietHours.start}
                onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                className="notif-prefs__time-input"
              />
            </label>
            <label className="notif-prefs__quiet-field">
              <span>{t('notifications.prefs.to', 'To')}</span>
              <input
                type="time"
                value={preferences.quietHours.end}
                onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                className="notif-prefs__time-input"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
