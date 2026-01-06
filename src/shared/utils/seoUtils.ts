/**
 * SEO utility functions for generating dynamic titles and meta descriptions
 */

import categoriesEn from '@core/i18n/locales/en/categories.json';
import categoriesHe from '@core/i18n/locales/he/categories.json';
import citiesEn from '@core/i18n/locales/en/cities.json';
import citiesHe from '@core/i18n/locales/he/cities.json';

interface SEOContext {
  basePath: string;
  currentLang: 'en' | 'he';
  category?: string;
  subcategory?: string;
  city?: string;
}

/**
 * Get translated category/subcategory name
 * The subcategory parameter can be either the JSON key (e.g., "music_production") or the English display name
 */
const getCategoryDisplayName = (subcategoryKey: string, lang: 'en' | 'he'): string => {
  // Clean the key - remove any URL encoding and normalize
  const cleanKey = decodeURIComponent(subcategoryKey).trim();

  // Get both English and Hebrew categories
  const englishSubCategories = categoriesEn.subCategories?.musicAndPodcast || {};
  const hebrewSubCategories = categoriesHe.subCategories?.musicAndPodcast || {};
  const targetSubCategories = lang === 'he' ? hebrewSubCategories : englishSubCategories;

  // First, try direct lookup by key (e.g., "podcast_recording")
  let displayName = targetSubCategories[cleanKey as keyof typeof targetSubCategories];

  // If not found, the cleanKey might be an English display name (e.g., "Podcast Recording")
  // Try to find the key by matching the English value
  if (!displayName) {
    for (const [key, englishValue] of Object.entries(englishSubCategories)) {
      if (englishValue === cleanKey) {
        // Found the key, now get the translated value
        displayName = targetSubCategories[key as keyof typeof targetSubCategories];
        break;
      }
    }
  }

  // If still not found, return the clean key (fallback)
  return displayName || cleanKey;
};

/**
 * Get translated city name
 */
const getCityDisplayName = (cityName: string, lang: 'en' | 'he'): string => {
  // Clean the city name - remove any URL encoding
  const cleanCityName = decodeURIComponent(cityName).trim();

  const cities = lang === 'he' ? citiesHe : citiesEn;

  // Convert city name to key format (e.g., "Tel Aviv-Yafo" -> "tel_aviv_yafo")
  const key = cleanCityName.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');

  return cities[key as keyof typeof cities] || cleanCityName;
};

/**
 * Generates dynamic, SEO-friendly page titles based on the current route
 */
export const getPageTitle = ({ basePath, currentLang, category, subcategory, city }: SEOContext): string => {
  const brandName = 'Studioz.co.il';

  // Landing page (root)
  if (basePath === '/' || basePath === '') {
    return currentLang === 'he'
      ? `השכרת אולפנים בישראל | ${brandName}`
      : `Studio Rentals & Services in Israel | ${brandName}`;
  }

  // Discover page
  if (basePath === '/discover' || basePath.startsWith('/discover')) {
    return currentLang === 'he'
      ? `גלו אולפנים מובילים | ${brandName}`
      : `Discover Top Studios & Services | ${brandName}`;
  }

  // Studios listing pages
  if (basePath.startsWith('/studios')) {
    const parts: string[] = [];

    // Add subcategory (most specific)
    if (subcategory) {
      const subcategoryDisplay = getCategoryDisplayName(subcategory, currentLang);
      parts.push(subcategoryDisplay);
    }
    // Add category if no subcategory
    else if (category) {
      const categoryDisplay = category === 'music' ? (currentLang === 'he' ? 'מוזיקה' : 'Music') : category;
      parts.push(categoryDisplay);
    }

    // Add city if present
    if (city) {
      const cityDisplay = getCityDisplayName(city, currentLang);
      parts.push(cityDisplay);
    }

    // Build title
    if (parts.length > 0) {
      const filtersText = parts.join(' - ');
      return currentLang === 'he' ? `אולפנים - ${filtersText} | ${brandName}` : `${filtersText} Studios | ${brandName}`;
    }

    return currentLang === 'he' ? `אולפנים להשכרה בישראל | ${brandName}` : `Studio Rentals in Israel | ${brandName}`;
  }

  // Services listing pages
  if (basePath.startsWith('/services')) {
    return currentLang === 'he' ? `שירותי אולפן להשכרה | ${brandName}` : `Studio Services for Rent | ${brandName}`;
  }

  // Studio details page
  if (basePath.startsWith('/studio/')) {
    return currentLang === 'he' ? `פרטי אולפן | ${brandName}` : `Studio Details | ${brandName}`;
  }

  // Wishlists
  if (basePath.startsWith('/wishlists')) {
    return currentLang === 'he' ? `רשימות משאלות | ${brandName}` : `Wishlists | ${brandName}`;
  }

  // For Owners page
  if (basePath.startsWith('/for-owners')) {
    return currentLang === 'he' ? `הצטרפו כמארחים | ${brandName}` : `List Your Studio | ${brandName}`;
  }

  // Default fallback
  return currentLang === 'he' ? `אולפנים להשכרה | ${brandName}` : `Studio Rentals & Services | ${brandName}`;
};

/**
 * Generates dynamic, SEO-friendly meta descriptions based on the current route
 * Optional - Google can generate its own, but having control is better for CTR
 */
export const getMetaDescription = ({ basePath, currentLang, category, subcategory, city }: SEOContext): string => {
  // Landing page (root)
  if (basePath === '/' || basePath === '') {
    return currentLang === 'he'
      ? 'השכרת אולפנים מקצועיים בישראל – מוזיקה, פודקאסט, הקלטות, צילום ווידאו בכל הערים. השוו חללים, ציוד ומחירים, צפו בזמינות בזמן אמת והזמינו את האולפן המושלם בדקות.'
      : 'Rent professional studios in Israel—music, podcast, recording, photo, and video across all cities. Compare spaces, gear, prices, check live availability, and book the perfect studio in minutes.';
  }

  // Discover page
  if (basePath === '/discover' || basePath.startsWith('/discover')) {
    return currentLang === 'he'
      ? 'גלו את האולפנים והשירותים הטובים ביותר בישראל. הקלטות, מיקס, מאסטרינג, פודקאסטים ועוד – הכל במקום אחד עם זמינות בזמן אמת והזמנה מהירה.'
      : 'Discover the best studios and services in Israel. Recording, mixing, mastering, podcasts and more—all in one place with real-time availability and fast booking.';
  }

  // Studios listing pages
  if (basePath.startsWith('/studios')) {
    const parts: string[] = [];

    // Add subcategory (most specific)
    if (subcategory) {
      const subcategoryDisplay = getCategoryDisplayName(subcategory, currentLang);
      parts.push(subcategoryDisplay);
    }
    // Add category if no subcategory
    else if (category) {
      const categoryDisplay = category === 'music' ? (currentLang === 'he' ? 'מוזיקה' : 'Music') : category;
      parts.push(categoryDisplay);
    }

    // Add city if present
    if (city) {
      const cityDisplay = getCityDisplayName(city, currentLang);
      parts.push(cityDisplay);
    }

    // Build description
    if (parts.length > 0) {
      const filtersText = parts.join(' ');
      return currentLang === 'he'
        ? `אולפני ${filtersText} להשכרה בישראל עם ציוד מתקדם, חדרים אקוסטיים, חנייה נגישה וזמינות בזמן אמת. השוו מחירים, קראו ביקורות והזמינו אונליין בדקות.`
        : `${filtersText} studios for rent in Israel with pro gear, treated rooms, easy access, real-time availability, reviews, and fast online booking.`;
    }

    return currentLang === 'he'
      ? 'אולפני מוזיקה, הקלטות, פודקאסט, צילום ווידאו להשכרה בכל רחבי ישראל. ציוד מקצועי, חדרים אקוסטיים, מחירים שקופים, זמינות מיידית והזמנה מקוונת.'
      : 'Music, recording, podcast, photo, and video studios for rent across Israel. Pro equipment, treated rooms, transparent pricing, instant availability, and easy online booking.';
  }

  // Services listing pages
  if (basePath.startsWith('/services')) {
    return currentLang === 'he'
      ? 'שירותי אולפן בישראל: מיקס, מאסטרינג, עריכה והפקה עם טכנאי סאונד מנוסים. מחירים שקופים, זמינות מהירה ותיאום אונליין.'
      : 'Studio services in Israel: mixing, mastering, editing, and production with experienced engineers. Transparent pricing, fast availability, and easy scheduling.';
  }

  // Studio details page
  if (basePath.startsWith('/studio/')) {
    return currentLang === 'he'
      ? 'פרטי אולפן מקצועי להשכרה: תמונות, רשימת ציוד מלאה, מחירים, חנייה וזמינות בלייב. הזמינו את האולפן המושלם עבורכם בדקות.'
      : 'Professional studio rental details: photos, full equipment list, pricing, parking, and live availability. Book the perfect studio in minutes.';
  }

  // Wishlists
  if (basePath.startsWith('/wishlists')) {
    return currentLang === 'he'
      ? 'נהלו את רשימות המשאלות שלכם - שמרו אולפנים ושירותים מועדפים להזמנה מאוחרת יותר.'
      : 'Manage your wishlists - save favorite studios and services for later booking.';
  }

  // For Owners page
  if (basePath.startsWith('/for-owners')) {
    return currentLang === 'he'
      ? 'הצטרפו ל-Studioz והתחילו להרוויח מהסטודיו שלכם. פרסמו את הסטודיו שלכם תוך דקות והתחברו עם יוצרים מקצועיים.'
      : 'Join Studioz and start earning from your studio. List your studio in minutes and connect with professional creators looking for the perfect location.';
  }

  // Default fallback
  return currentLang === 'he'
    ? 'השכרת אולפנים ושירותים מקצועיים בישראל. מצאו את האולפן המושלם עבורכם.'
    : 'Professional studio and service rentals in Israel. Find the perfect studio for you.';
};
