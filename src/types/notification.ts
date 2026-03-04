export type NotificationType =
  // Bookings
  | 'new_reservation'
  | 'reservation_confirmed'
  | 'reservation_cancelled'
  | 'reservation_expired'
  | 'reservation_modified'
  | 'reservation_reminder'
  // Payments
  | 'payout_completed'
  | 'payout_failed'
  // Reviews
  | 'new_review'
  // Billing
  | 'subscription_trial_ending'
  | 'subscription_payment_failed'
  | 'subscription_renewed'
  // System
  | 'calendar_sync_error'
  | 'platform_announcement'
  | 'weekly_summary'
  // Activity
  | 'customer_message'
  | 'availability_alert'
  // Legacy
  | 'system_alert';

export type NotificationCategory =
  | 'bookings'
  | 'payments'
  | 'reviews'
  | 'billing'
  | 'system'
  | 'activity';

export type NotificationPriority = 'low' | 'medium' | 'high';

export const NOTIFICATION_CATEGORIES: { key: NotificationCategory; label: string }[] = [
  { key: 'bookings', label: 'Bookings' },
  { key: 'payments', label: 'Payments' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'billing', label: 'Billing' },
  { key: 'system', label: 'System' },
  { key: 'activity', label: 'Activity' },
];

export default interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  data?: {
    reservationId?: string;
    itemId?: string;
    studioId?: string;
    [key: string]: any;
  };
  read: boolean;
  readAt?: string;
  priority: NotificationPriority;
  actionUrl?: string;
  expiresAt?: string;
  groupKey?: string;
  createdAt?: string;
  updatedAt?: string;
}
