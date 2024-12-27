import { ReactNode } from 'react';
import { ErrorBoundaryComponent } from './ErrorBoundaryComponent';

export const ErrorBoundary = ({ children }: { children: ReactNode }): JSX.Element => {
  return <ErrorBoundaryComponent>{children}</ErrorBoundaryComponent>;
};
