/**
 * Utility functions to detect bots and crawlers
 * Prevents location permission popups and geolocation API calls for crawlers
 */

/**
 * Check if the current user agent is a bot/crawler
 * Detects common search engine crawlers and bots
 */
export const isBot = (): boolean => {
  if (typeof window === 'undefined' || !window.navigator) {
    return true; // Server-side or no navigator = assume bot
  }

  const userAgent = window.navigator.userAgent.toLowerCase();

  // Common bot/crawler patterns
  const botPatterns = [
    // Google crawlers
    'googlebot',
    'google-inspectiontool',
    'google page speed',
    'google structured data testing tool',

    // Other major search engines
    'bingbot',
    'slurp', // Yahoo
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'sogou',
    'exabot',
    'facebot',
    'ia_archiver',

    // Social media crawlers
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'pinterest',

    // SEO tools
    'ahrefsbot',
    'semrushbot',
    'mj12bot',
    'dotbot',
    'megaindex',

    // Generic bot patterns
    'bot',
    'crawler',
    'spider',
    'scraper',
    'crawling',
    'headless',
    'phantom',
    'selenium',
    'webdriver',
    'wget',
    'curl',
    'python-requests',
    'http',
    'scrapy',

    // Monitoring tools
    'pingdom',
    'uptimerobot',
    'monitor',

    // Pre-rendering services
    'prerender',
    'prerender.io',
    'browsershot'
  ];

  // Check if user agent matches any bot pattern
  const isBotUserAgent = botPatterns.some((pattern) => userAgent.includes(pattern));

  // Additional checks for headless browsers
  const isHeadless =
    !window.navigator.webdriver === false || // webdriver property exists
    window.navigator.plugins.length === 0 || // No plugins (common in headless)
    !('chrome' in window) || // Chrome-specific checks (using 'in' operator for type safety)
    window.outerHeight === 0 || // Window dimensions
    window.outerWidth === 0;

  // Check for common bot indicators in the environment
  const hasBotIndicators =
    !window.navigator.geolocation || // No geolocation API (common in bots)
    typeof (window.navigator as any).getBattery === 'undefined' || // Missing APIs (getBattery is experimental)
    !window.navigator.mediaDevices; // Missing media devices

  // Return true if any bot indicator is present
  // But be lenient - only flag as bot if multiple indicators or explicit bot pattern
  return isBotUserAgent || (isHeadless && hasBotIndicators);
};

/**
 * Check if geolocation API is available and not a bot
 * Use this before calling any geolocation methods
 */
export const canUseGeolocation = (): boolean => {
  if (isBot()) {
    return false;
  }

  if (typeof window === 'undefined' || !window.navigator) {
    return false;
  }

  return 'geolocation' in window.navigator;
};

/**
 * Check if the request is from a search engine crawler
 * More specific than isBot() - only returns true for known search engines
 */
export const isSearchEngineCrawler = (): boolean => {
  if (typeof window === 'undefined' || !window.navigator) {
    return true;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();

  const searchEnginePatterns = [
    'googlebot',
    'google-inspectiontool',
    'bingbot',
    'slurp', // Yahoo
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'sogou',
    'exabot'
  ];

  return searchEnginePatterns.some((pattern) => userAgent.includes(pattern));
};
