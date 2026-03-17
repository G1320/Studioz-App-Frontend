import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import posthog, { PostHog } from 'posthog-js';
import { useLocation } from 'react-router-dom';

const PostHogContext = createContext<PostHog | null>(null);

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;
const IS_PRODUCTION = import.meta.env.VITE_NODE_ENV === 'production';

interface PostHogProviderProps {
  children: ReactNode;
}

export const PostHogProvider: React.FC<PostHogProviderProps> = ({ children }) => {
  const initialized = useRef(false);
  const location = useLocation();

  useEffect(() => {
    if (!IS_PRODUCTION || !POSTHOG_KEY || initialized.current) return;

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
    });

    initialized.current = true;
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    posthog.capture('$pageview', {
      $current_url: window.location.href,
    });
  }, [location.pathname, location.search]);

  return (
    <PostHogContext.Provider value={initialized.current ? posthog : null}>
      {children}
    </PostHogContext.Provider>
  );
};

export const usePostHog = (): PostHog | null => useContext(PostHogContext);
