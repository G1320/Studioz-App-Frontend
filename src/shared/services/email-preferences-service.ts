import { httpService } from './http-service';

export interface EmailPreferences {
  enabled: boolean;
  bookingConfirmations: boolean;
  bookingReminders: boolean;
  bookingCancellations: boolean;
  paymentReceipts: boolean;
  payoutNotifications: boolean;
  subscriptionUpdates: boolean;
  promotionalEmails: boolean;
  reviewRequests: boolean;
}

/**
 * Get user's email preferences
 */
export const getEmailPreferences = async (userId: string): Promise<EmailPreferences> => {
  const response = await httpService.get<EmailPreferences>(`/users/${userId}/email-preferences`);
  return response;
};

/**
 * Update user's email preferences
 */
export const updateEmailPreferences = async (
  userId: string,
  preferences: Partial<EmailPreferences>
): Promise<EmailPreferences> => {
  const response = await httpService.put<EmailPreferences>(`/users/${userId}/email-preferences`, {
    preferences
  });
  return response;
};

/**
 * Disable all email notifications
 */
export const disableAllEmails = async (userId: string): Promise<EmailPreferences> => {
  return updateEmailPreferences(userId, { enabled: false });
};

/**
 * Enable all email notifications
 */
export const enableAllEmails = async (userId: string): Promise<EmailPreferences> => {
  return updateEmailPreferences(userId, {
    enabled: true,
    bookingConfirmations: true,
    bookingReminders: true,
    bookingCancellations: true,
    paymentReceipts: true,
    payoutNotifications: true,
    subscriptionUpdates: true,
    promotionalEmails: true,
    reviewRequests: true
  });
};

export const emailPreferencesService = {
  getEmailPreferences,
  updateEmailPreferences,
  disableAllEmails,
  enableAllEmails
};

export default emailPreferencesService;
