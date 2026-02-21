import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ARIA live region that announces route changes to screen readers.
 * Required for SPA accessibility — screen readers don't detect client-side navigation.
 */
export const RouteAnnouncer: React.FC = () => {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // Small delay for Helmet to update document.title
    const timer = setTimeout(() => {
      const pageTitle = document.title || '';
      if (pageTitle) {
        setAnnouncement(pageTitle);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      className="visually-hidden"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {announcement}
    </div>
  );
};
