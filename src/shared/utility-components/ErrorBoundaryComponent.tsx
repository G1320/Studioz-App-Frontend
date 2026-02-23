import { Component, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { HomeIcon } from '@shared/components/icons';
import { isStaleAssetError, reloadOnStaleAsset } from '@shared/utils/staleAssetReload';

interface Props {
  children: ReactNode;
  onGoHome?: () => void;
}

export interface StudioZErrorBoundaryProps {
  /**
   * The error object or message to display (optional for preview)
   */
  error?: Error | string;
  /**
   * Callback function to reset the error state (e.g., try again)
   */
  resetErrorBoundary?: () => void;
  /**
   * Callback function to navigate home
   */
  onGoHome?: () => void;
  /**
   * Custom title override
   */
  title?: string;
  /**
   * Custom description override
   */
  description?: string;
}

export const StudioZErrorBoundary: React.FC<StudioZErrorBoundaryProps> = ({
  error,
  resetErrorBoundary,
  onGoHome,
  title = 'Oops! Something went wrong',
  description = "We encountered an unexpected error. Don't worry, our team has been notified."
}) => {
  const { t, i18n } = useTranslation('common');
  const currLang = i18n.language || 'en';

  const titleText = t('errors.boundary.title', { defaultValue: title });
  const descriptionText = t('errors.boundary.message', { defaultValue: description });
  const buttonText = t('errors.boundary.return_home', { defaultValue: 'Return Home' });

  const handleReturnHome = () => {
    resetErrorBoundary?.();
    if (onGoHome) {
      onGoHome();
      return;
    }
    // Full page navigation to fully reset the app state after a fatal error
    window.location.assign(`/${currLang}`);
  };

  const errorText = error ? (typeof error === 'string' ? error : error.message) : null;

  return (
    <div className="error-boundary">
      <div className="error-boundary__card" role="alert" aria-live="polite">
        {/* Top Glow Effect */}
        <div className="error-boundary__top-line" />
        <div className="error-boundary__top-glow" />

        {/* Icon Container */}
        <div className="error-boundary__icon-outer" aria-hidden="true">
          <div className="error-boundary__icon-inner">
            <span className="error-boundary__icon-bang">!</span>
          </div>
        </div>

        {/* Content */}
        <h1 className="error-boundary__title">{titleText}</h1>
        <p className="error-boundary__message">
          {descriptionText}
          {errorText && <span className="error-boundary__details">{errorText}</span>}
        </p>

        {/* Action Button */}
        <button onClick={handleReturnHome} className="error-boundary__button" type="button">
          <HomeIcon className="error-boundary__button-icon" />
          <span>{buttonText}</span>
        </button>
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
        <StudioZErrorBoundary
          error={this.state.error || undefined}
          onGoHome={this.props.onGoHome}
          resetErrorBoundary={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}
