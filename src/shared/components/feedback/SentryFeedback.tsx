/**
 * SentryFeedback Component
 * Controls when the Sentry feedback widget appears
 * - Only shows after user has been on site for X minutes
 * - Only shows on certain pages (not on landing, checkout, etc.)
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';

// Pages where feedback button should NOT appear
const EXCLUDED_PATHS = [
  '/', // Landing page
  '/checkout',
  '/cart',
  '/login',
  '/signup',
  '/admin'
];

// Delay before showing feedback (in milliseconds)
const SHOW_DELAY_MS = 2 * 60 * 1000; // 2 minutes

export const SentryFeedback = () => {
  const location = useLocation();
  const widgetRef = useRef<ReturnType<ReturnType<typeof Sentry.getFeedback>['createWidget']> | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only run in production
    if (import.meta.env.VITE_NODE_ENV !== 'production') {
      return;
    }

    const feedback = Sentry.getFeedback();
    if (!feedback) return;

    // Check if current path is excluded
    const currentPath = location.pathname;
    const isExcluded = EXCLUDED_PATHS.some(path => {
      // Handle language prefix (e.g., /en/, /he/)
      const pathWithoutLang = currentPath.replace(/^\/(en|he)/, '');
      return pathWithoutLang === path || pathWithoutLang === '' || currentPath === path;
    });

    // Remove widget if on excluded page
    if (isExcluded) {
      if (widgetRef.current) {
        widgetRef.current.removeFromDom();
        widgetRef.current = null;
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // If widget already exists on allowed page, keep it
    if (widgetRef.current) {
      return;
    }

    // Set timer to show widget after delay
    timerRef.current = setTimeout(() => {
      if (!widgetRef.current) {
        widgetRef.current = feedback.createWidget();
      }
    }, SHOW_DELAY_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [location.pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (widgetRef.current) {
        widgetRef.current.removeFromDom();
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default SentryFeedback;
