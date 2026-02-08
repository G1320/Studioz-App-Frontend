/**
 * Brevo Conversations Chat Widget Loader
 * Loads the Brevo chat widget script dynamically on specific pages
 */

import { isInAppBrowser } from './botDetection';

let isLoaded = false;

export const loadBrevoWidget = (): void => {
  // Prevent loading multiple times
  if (isLoaded || typeof window === 'undefined') return;

  // Skip in Facebook/Instagram in-app browsers to avoid webkit.messageHandlers TypeError
  if (isInAppBrowser()) return;

  // Check if script already exists
  if (document.getElementById('brevo-conversations-script')) {
    isLoaded = true;
    return;
  }

  const w = window as any;
  const d = document;

  // Initialize Brevo
  w.BrevoConversationsID = import.meta.env.VITE_BREVO_CONVERSATIONS_ID;
  w.BrevoConversations =
    w.BrevoConversations ||
    function (...args: any[]) {
      (w.BrevoConversations.q = w.BrevoConversations.q || []).push(args);
    };

  // Create and inject the Brevo script
  const script = d.createElement('script');
  script.id = 'brevo-conversations-script';
  script.async = true;
  script.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';

  // Set language based on HTML lang attribute when script loads
  script.onload = () => {
    const currentLang = d.documentElement.lang || 'he';
    const brevoLang = currentLang === 'he' ? 'he' : 'en';
    if (w.BrevoConversations) {
      w.BrevoConversations('set', 'language', brevoLang);
    }
  };

  if (d.head) {
    d.head.appendChild(script);
  }

  isLoaded = true;
};

export const unloadBrevoWidget = (): void => {
  const script = document.getElementById('brevo-conversations-script');
  if (script) {
    script.remove();
  }

  // Clean up Brevo globals
  if (typeof window !== 'undefined') {
    delete (window as any).BrevoConversationsID;
    delete (window as any).BrevoConversations;
  }

  isLoaded = false;
};
