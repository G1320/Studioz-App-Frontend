import { useAuth0, User as Auth0User } from '@auth0/auth0-react';
import { useMemo } from 'react';
import { useUserContext } from '@core/contexts';

// Custom namespace for Auth0 custom claims (must match your Auth0 Action)
const AUTH0_ROLES_KEY = 'https://studioz.co.il/roles';

/**
 * Hook to check if the current user has admin privileges
 * Checks both Auth0 roles (from token) and database isAdmin flag
 * 
 * @returns Object containing isAdmin status and loading state
 */
export const useAdminAuth = () => {
  const { user: auth0User, isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { user: dbUser } = useUserContext();

  const { isAdmin, hasAdminRole } = useMemo(() => {
    // Check Auth0 roles from the token
    const auth0Roles: string[] = (auth0User as Auth0User & { [AUTH0_ROLES_KEY]?: string[] })?.[AUTH0_ROLES_KEY] || [];
    const hasAuth0AdminRole = Array.isArray(auth0Roles) && (auth0Roles.includes('admin') || auth0Roles.includes('Admin'));
    
    // Check database isAdmin flag
    const hasDbAdminFlag = dbUser?.isAdmin === true;
    
    // Check database role field
    const hasDbAdminRole = dbUser?.role === 'admin';

    return {
      // User is admin if they have the role in Auth0 OR in the database
      isAdmin: hasAuth0AdminRole || hasDbAdminFlag || hasDbAdminRole,
      hasAdminRole: hasAuth0AdminRole
    };
  }, [auth0User, dbUser]);

  return {
    isAdmin,
    hasAdminRole,
    isAuthenticated,
    isLoading: auth0Loading,
    user: dbUser
  };
};

export default useAdminAuth;
