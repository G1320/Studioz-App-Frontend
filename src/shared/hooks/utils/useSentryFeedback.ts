import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook to open Sentry feedback form with translations
 * Uses dynamic import to support lazy-loaded Sentry
 */
export const useSentryFeedback = () => {
  const { t } = useTranslation('common');

  const openFeedback = useCallback(async () => {
    // Dynamic import - Sentry may already be loaded or will load now
    const Sentry = await import('@sentry/react');
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
