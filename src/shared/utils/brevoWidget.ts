/**
 * Brevo Conversations Chat Widget Loader
 * Loads the Brevo chat widget script dynamically
 * Widget launcher is hidden - use openBrevoChat() to open programmatically
 */

let isLoaded = false;
let isReady = false;
let readyCallbacks: (() => void)[] = [];

/**
 * Load the Brevo widget script (launcher hidden, chat available on demand)
 */
export const loadBrevoWidget = (): void => {
  // Prevent loading multiple times
  if (isLoaded || typeof window === 'undefined') return;

  // Check if script already exists
  if (document.getElementById('brevo-conversations-script')) {
    isLoaded = true;
    return;
  }

  const w = window as any;
  const d = document;

  // Initialize Brevo with hidden launcher
  w.BrevoConversationsID = import.meta.env.VITE_BREVO_CONVERSATIONS_ID;
  
  // Pre-configure to hide the floating button
  w.BrevoConversationsSetup = {
    startHidden: true,
    hideLauncherIcon: true
  };
  
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

  // Configure after script loads
  script.onload = () => {
    const currentLang = d.documentElement.lang || 'he';
    const brevoLang = currentLang === 'he' ? 'he' : 'en';
    
    if (w.BrevoConversations) {
      // Set language
      w.BrevoConversations('set', 'language', brevoLang);
      // Hide the launcher button
      w.BrevoConversations('hide');
      
      // Mark as ready and call any waiting callbacks
      isReady = true;
      readyCallbacks.forEach(cb => cb());
      readyCallbacks = [];
    }
  };

  if (d.head) {
    d.head.appendChild(script);
  }

  isLoaded = true;
};

/**
 * Open the Brevo chat widget programmatically
 * Will load the widget first if not already loaded
 */
export const openBrevoChat = (): void => {
  const w = window as any;
  
  const showChat = () => {
    if (w.BrevoConversations) {
      // Show the chat window (try multiple API methods for compatibility)
      w.BrevoConversations('show');
      w.BrevoConversations('openChat', true);
    }
  };
  
  // If already ready, open immediately
  if (isReady && w.BrevoConversations) {
    showChat();
    return;
  }
  
  // Load widget if not loaded
  if (!isLoaded) {
    loadBrevoWidget();
  }
  
  // Queue the open action for when ready
  readyCallbacks.push(showChat);
};

/**
 * Check if Brevo widget is loaded and ready
 */
export const isBrevoReady = (): boolean => isReady;

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
  isReady = false;
  readyCallbacks = [];
};
