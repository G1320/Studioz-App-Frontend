import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowBackIcon } from '@shared/components/icons';
import './styles/_index.scss';

interface BackButtonProps {
  className?: string;
  onClick?: () => void;
}

/**
 * Normalizes a pathname to its base route form
 * Removes subcategory paths, query params, and hash
 * Examples:
 * - /he/studios/music/Sound%20Design → /he/studios/music
 * - /he/studios/music/Sound%20Design?city=Haifa → /he/studios/music
 * - /he/edit-studio/123?step=categories → /he/edit-studio/123
 */
const normalizeRoute = (pathname: string): string => {
  const parts = pathname.split('/').filter(Boolean);
  
  // Handle language prefix
  if (parts.length === 0) return '/';
  const lang = parts[0];
  if (parts.length === 1) return `/${lang}`;
  
  // Normalize studios routes: /:lang/studios/music/:subcategory → /:lang/studios/music
  if (parts[1] === 'studios' && parts.length > 3) {
    // /:lang/studios/music/:subcategory → /:lang/studios/music
    return `/${lang}/studios/${parts[2]}`;
  }
  
  // Normalize services routes: /:lang/services/music/:subCategory → /:lang/services/music
  if (parts[1] === 'services' && parts.length > 3) {
    return `/${lang}/services/${parts[2]}`;
  }
  
  // For other routes, keep up to the main route (remove dynamic segments after ID)
  // /:lang/edit-studio/:studioId → /:lang/edit-studio/:studioId (keep as is, but remove query/hash)
  // /:lang/studio/:studioId → /:lang/studio/:studioId
  // /:lang/wishlists/:wishlistId → /:lang/wishlists/:wishlistId
  
  // For routes with IDs, keep the base route
  // /:lang/edit-studio/123 → /:lang/edit-studio/123 (but we'll normalize in comparison)
  
  // Return the normalized path (up to main route segments)
  // For most routes, this means keeping up to 3 parts: /:lang/:section/:id
  if (parts.length <= 3) {
    return `/${parts.join('/')}`;
  }
  
  // For longer paths, keep the base structure
  // This handles edge cases
  return `/${parts.slice(0, 3).join('/')}`;
};

export const BackButton: React.FC<BackButtonProps> = ({ className = '', onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const normalizedHistoryRef = useRef<string[]>([]);
  const currentNormalizedRef = useRef<string>(normalizeRoute(location.pathname));
  const isInitialMountRef = useRef(true);

  // Track normalized route changes (ignoring subcategories, query params, and hash)
  useEffect(() => {
    const currentNormalized = normalizeRoute(location.pathname);
    const previousNormalized = currentNormalizedRef.current;

    // Skip on initial mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      currentNormalizedRef.current = currentNormalized;
      return;
    }

    // Only add to history if normalized route actually changed
    if (currentNormalized !== previousNormalized) {
      // Add previous normalized route to history if it's different and not already the last entry
      if (previousNormalized) {
        const lastHistoryEntry = normalizedHistoryRef.current[normalizedHistoryRef.current.length - 1];
        if (lastHistoryEntry !== previousNormalized) {
          normalizedHistoryRef.current.push(previousNormalized);
          // Keep only last 20 routes to avoid memory issues
          if (normalizedHistoryRef.current.length > 20) {
            normalizedHistoryRef.current.shift();
          }
        }
      }
      currentNormalizedRef.current = currentNormalized;
    }
  }, [location.pathname]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const currentNormalized = normalizeRoute(location.pathname);
      const history = normalizedHistoryRef.current;
      
      // Find the most recent normalized route in history that's different from current
      // This handles cases where user navigated within same route (subcategories, query params, form steps)
      let previousNormalized: string | null = null;
      for (let i = history.length - 1; i >= 0; i--) {
        if (history[i] !== currentNormalized) {
          previousNormalized = history[i];
          break;
        }
      }

      // If we found a previous different normalized route, navigate to it
      // Otherwise, navigate to home page
      if (previousNormalized) {
        navigate(previousNormalized);
      } else {
        const currentLang = i18n.language || 'en';
        navigate(`/${currentLang}`);
      }
    }
  };

  return (
    <button
      className={`back-button ${className}`}
      onClick={handleClick}
      aria-label="Go back"
      type="button"
    >
      <ArrowBackIcon aria-hidden="true" />
    </button>
  );
};

