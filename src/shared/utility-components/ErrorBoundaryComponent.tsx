import { Component, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

interface Props {
  children: ReactNode;
}

interface ErrorFallbackProps {
  onReset: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ onReset }) => {
  const { t, i18n } = useTranslation('common');
  const currLang = i18n.language || 'en';

  const handleReturnHome = () => {
    onReset();
    // Use a full page navigation to fully reset the app state after a fatal error
    window.location.assign(`/${currLang}`);
  };

  return (
    <div className="error-boundary">
      <div className="error-boundary__container">
        <div className="error-boundary__icon-wrapper">
          <ErrorOutlineIcon className="error-boundary__icon" />
        </div>
        <h1 className="error-boundary__title">{t('errors.boundary.title')}</h1>
        <p className="error-boundary__message">{t('errors.boundary.message')}</p>
        <button onClick={handleReturnHome} className="error-boundary__button">
          <HomeIcon className="error-boundary__button-icon" />
          <span>{t('errors.boundary.return_home')}</span>
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
    // Auto-reload for chunk loading errors
    if (error.message?.includes('Failed to fetch dynamically imported module')) {
      window.location.reload();
    }

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}
