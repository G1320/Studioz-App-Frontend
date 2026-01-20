import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/react';

/**
 * Hook to open Sentry feedback form with translations
 */
export const useSentryFeedback = () => {
  const { t } = useTranslation('common');

  const openFeedback = useCallback(async () => {
    const feedback = Sentry.getFeedback();
    if (!feedback) return;

    const form = await feedback.createForm({
      formTitle: t('footer.feedbackForm.title'),
      submitButtonLabel: t('footer.feedbackForm.submitButton'),
      cancelButtonLabel: t('footer.feedbackForm.cancelButton'),
      nameLabel: t('footer.feedbackForm.nameLabel'),
      namePlaceholder: t('footer.feedbackForm.namePlaceholder'),
      emailLabel: t('footer.feedbackForm.emailLabel'),
      emailPlaceholder: t('footer.feedbackForm.emailPlaceholder'),
      messageLabel: t('footer.feedbackForm.messageLabel'),
      messagePlaceholder: t('footer.feedbackForm.messagePlaceholder'),
      successMessageText: t('footer.feedbackForm.successMessage'),
    });
    
    form.appendToDom();
    form.open();
  }, [t]);

  return { openFeedback };
};
