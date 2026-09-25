import { Component, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { EmailIcon, HomeIcon, RefreshIcon } from '@shared/components/icons';
import { isStaleAssetError, reloadOnStaleAsset } from '@shared/utils/staleAssetReload';

interface Props {
  children: ReactNode;
  onGoHome?: () => void;
}

export interface StudiozErrorBoundaryProps {
  error?: Error | string;
  resetErrorBoundary?: () => void;
  onGoHome?: () => void;
  title?: string;
  description?: string;
}

export const StudiozErrorBoundary: React.FC<StudiozErrorBoundaryProps> = ({
  error,
  resetErrorBoundary,
  onGoHome,
  title = 'This page couldn’t load',
  description = 'Something went wrong while loading this view. You can try again, or return home and continue from there.'
}) => {
  const { t, i18n } = useTranslation('common');
  const currLang = i18n.language || 'en';
  const isRtl = i18n.language === 'he';

  const kicker = t('errors.boundary.kicker', { defaultValue: 'System status' });
  const titleText = t('errors.boundary.title', { defaultValue: title });
  const descriptionText = t('errors.boundary.message', { defaultValue: description });
  const detailsLabel = t('errors.boundary.details_label', { defaultValue: 'Technical details' });
  const tryAgainText = t('errors.boundary.try_again', { defaultValue: 'Try again' });
  const homeText = t('errors.boundary.return_home', { defaultValue: 'Go to home' });
  const supportPrefix = t('errors.boundary.support_prefix', { defaultValue: 'Need help?' });
  const supportLink = t('errors.boundary.support_link', { defaultValue: 'Contact support' });

  const handleTryAgain = () => {
    resetErrorBoundary?.();
  };

  const handleReturnHome = () => {
    resetErrorBoundary?.();
    if (onGoHome) {
      onGoHome();
      return;
    }
    window.location.assign(`/${currLang}`);
  };

  const errorText = error ? (typeof error === 'string' ? error : error.message) : null;

  return (
    <div className="error-boundary" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="error-boundary__panel" role="alert" aria-live="polite">
        <p className="error-boundary__kicker">{kicker}</p>
        <h1 className="error-boundary__title">{titleText}</h1>
        <p className="error-boundary__message">{descriptionText}</p>

        {errorText ? (
          <div className="error-boundary__meta">
            <span className="error-boundary__meta-label">{detailsLabel}</span>
            <code className="error-boundary__meta-value">{errorText}</code>
          </div>
        ) : null}

        <div className="error-boundary__actions">
          {resetErrorBoundary ? (
            <button type="button" className="error-boundary__button error-boundary__button--primary" onClick={handleTryAgain}>
              <RefreshIcon className="error-boundary__button-icon" aria-hidden />
              <span>{tryAgainText}</span>
            </button>
          ) : null}
          <button type="button" className="error-boundary__button error-boundary__button--secondary" onClick={handleReturnHome}>
            <HomeIcon className="error-boundary__button-icon" aria-hidden />
            <span>{homeText}</span>
          </button>
        </div>

        <p className="error-boundary__support">
          {supportPrefix}{' '}
          <a href="mailto:admin@studioz.co.il" className="error-boundary__support-link">
            <EmailIcon className="error-boundary__support-icon" aria-hidden />
            {supportLink}
          </a>
        </p>
      </div>
    </div>
  );
};

export class ErrorBoundaryComponent extends Component<Props, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): { hasError: boolean; error: Error } {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    if (isStaleAssetError(error) && reloadOnStaleAsset()) {
      return;
    }

    console.error('ErrorBoundary caught an error:', error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <StudiozErrorBoundary
          error={this.state.error || undefined}
          onGoHome={this.props.onGoHome}
          resetErrorBoundary={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}
