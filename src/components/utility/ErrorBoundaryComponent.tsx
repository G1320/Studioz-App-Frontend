import { Component, type ReactNode } from 'react';
import { PropagateLoader } from 'react-spinners';

interface Props {
  children: ReactNode;
}

export class ErrorBoundaryComponent extends Component<Props, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    if (error.message?.includes('Failed to fetch dynamically imported module')) {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return <PropagateLoader color="#fff" className="loader" />;
    }
    return this.props.children;
  }
}
