import { ReactNode } from 'react';
import { ErrorBoundaryComponent } from './ErrorBoundaryComponent';

export const ErrorBoundary = ({
  children,
  onGoHome
}: {
  children: ReactNode;
  onGoHome?: () => void;
}): JSX.Element => {
  return <ErrorBoundaryComponent onGoHome={onGoHome}>{children}</ErrorBoundaryComponent>;
};
