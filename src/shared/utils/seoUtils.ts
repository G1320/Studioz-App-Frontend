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
 * The subcategory parameter is the JSON key (e.g., "music_production"), not the English value
 */
const getCategoryDisplayName = (subcategoryKey: string, lang: 'en' | 'he'): string => {
  // Clean the key - remove any URL encoding and normalize
  const cleanKey = decodeURIComponent(subcategoryKey).trim();
  
  const categories = lang === 'he' ? categoriesHe : categoriesEn;
  const subCategories = categories.subCategories?.musicAndPodcast || {};
  
  // The subcategoryKey is the JSON key, so look it up directly
  const displayName = subCategories[cleanKey as keyof typeof subCategories];
  
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
  const key = cleanCityName
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');
  
  return cities[key as keyof typeof cities] || cleanCityName;
};

/**
 * Generates dynamic, SEO-friendly page titles based on the current route
 */
export const getPageTitle = ({ basePath, currentLang, category, subcategory, city }: SEOContext): string => {
  const brandName = 'Studioz.co.il';

  // Home page
  if (basePath === '/' || basePath === '') {
    return currentLang === 'he'
      ? `השכרת אולפנים ושירותים בישראל | ${brandName}`
      : `Studio Rentals & Services in Israel | ${brandName}`;
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
      const categoryDisplay = category === 'music' 
        ? (currentLang === 'he' ? 'מוזיקה' : 'Music')
        : category;
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
      return currentLang === 'he' 
        ? `אולפנים - ${filtersText} | ${brandName}` 
        : `${filtersText} Studios | ${brandName}`;
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

  // Default fallback
  return currentLang === 'he' ? `אולפנים ושירותים להשכרה | ${brandName}` : `Studio Rentals & Services | ${brandName}`;
};

/**
 * Generates dynamic, SEO-friendly meta descriptions based on the current route
 * Optional - Google can generate its own, but having control is better for CTR
 */
export const getMetaDescription = ({ basePath, currentLang, category, subcategory, city }: SEOContext): string => {
  // Home page
  if (basePath === '/' || basePath === '') {
    return currentLang === 'he'
      ? 'השכרת אולפנים מקצועיים בישראל - אולפני מוזיקה, פודקאסט, הקלטות, צילום ווידאו. מצאו את האולפן המושלם עבורכם עם ציוד מקצועי ומחירים תחרותיים.'
      : 'Rent professional studios in Israel - music studios, podcast studios, recording studios, photo studios, and video studios. Find the perfect studio with professional equipment and competitive prices.';
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
      const categoryDisplay = category === 'music' 
        ? (currentLang === 'he' ? 'מוזיקה' : 'Music')
        : category;
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
        ? `אולפני ${filtersText} להשכרה בישראל. מצאו אולפן מקצועי עם ציוד מתקדם ומחירים נוחים. הזמינו עכשיו!`
        : `${filtersText} studios for rent in Israel. Find professional studios with advanced equipment and affordable prices. Book now!`;
    }
    
    return currentLang === 'he'
      ? 'אולפנים להשכרה בישראל - אולפני מוזיקה, הקלטות, פודקאסט, צילום ווידאו. ציוד מקצועי, מחירים תחרותיים, הזמנה קלה.'
      : 'Studio rentals in Israel - music studios, recording studios, podcast studios, photo and video studios. Professional equipment, competitive prices, easy booking.';
  }

  // Services listing pages
  if (basePath.startsWith('/services')) {
    return currentLang === 'he'
      ? 'שירותי אולפן להשכרה בישראל - מיקס, מאסטרינג, עריכה, הפקה. שירותים מקצועיים במחירים נוחים.'
      : 'Studio services for rent in Israel - mixing, mastering, editing, production. Professional services at affordable prices.';
  }

  // Studio details page
  if (basePath.startsWith('/studio/')) {
    return currentLang === 'he'
      ? 'פרטי אולפן מקצועי להשכרה. צפו בתמונות, ציוד, מחירים וזמינות. הזמינו את האולפן המושלם עבורכם.'
      : 'Professional studio rental details. View photos, equipment, prices, and availability. Book the perfect studio for you.';
  }

  // Wishlists
  if (basePath.startsWith('/wishlists')) {
    return currentLang === 'he'
      ? 'נהלו את רשימות המשאלות שלכם - שמרו אולפנים ושירותים מועדפים להזמנה מאוחרת יותר.'
      : 'Manage your wishlists - save favorite studios and services for later booking.';
  }

  // Default fallback
  return currentLang === 'he'
    ? 'השכרת אולפנים ושירותים מקצועיים בישראל. מצאו את האולפן המושלם עבורכם.'
    : 'Professional studio and service rentals in Israel. Find the perfect studio for you.';
};
