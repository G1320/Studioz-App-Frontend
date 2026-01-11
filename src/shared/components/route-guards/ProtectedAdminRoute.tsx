import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@shared/hooks/auth';
import { useTranslation } from 'react-i18next';
import './styles/_protected-route.scss';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard component that only allows admin users to access the route
 * Redirects non-admins to the home page
 */
export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { isAdmin, isAuthenticated, isLoading } = useAdminAuth();
  const { i18n } = useTranslation();
  const location = useLocation();

  // Show nothing while loading (you could add a spinner here)
  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={`/${i18n.language}`} state={{ from: location }} replace />;
  }

  // Redirect to home if not admin
  if (!isAdmin) {
    return <Navigate to={`/${i18n.language}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
