/**
 * SEO utility functions for generating dynamic titles and meta descriptions
 */

interface SEOContext {
  basePath: string;
  currentLang: 'en' | 'he';
}

/**
 * Generates dynamic, SEO-friendly page titles based on the current route
 */
export const getPageTitle = ({ basePath, currentLang }: SEOContext): string => {
  const brandName = 'Studioz.co.il';

  // Home page
  if (basePath === '/' || basePath === '') {
    return currentLang === 'he'
      ? `השכרת אולפנים ושירותים בישראל | ${brandName}`
      : `Studio Rentals & Services in Israel | ${brandName}`;
  }

  // Studios listing pages
  if (basePath.startsWith('/studios')) {
    const category = basePath.split('/').filter(Boolean)[1] || '';
    if (category) {
      return currentLang === 'he' ? `אולפנים - ${category} | ${brandName}` : `Studios - ${category} | ${brandName}`;
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
export const getMetaDescription = ({ basePath, currentLang }: SEOContext): string => {
  // Home page
  if (basePath === '/' || basePath === '') {
    return currentLang === 'he'
      ? 'השכרת אולפנים מקצועיים בישראל - אולפני מוזיקה, פודקאסט, הקלטות, צילום ווידאו. מצאו את האולפן המושלם עבורכם עם ציוד מקצועי ומחירים תחרותיים.'
      : 'Rent professional studios in Israel - music studios, podcast studios, recording studios, photo studios, and video studios. Find the perfect studio with professional equipment and competitive prices.';
  }

  // Studios listing pages
  if (basePath.startsWith('/studios')) {
    const category = basePath.split('/').filter(Boolean)[1] || '';
    if (category) {
      return currentLang === 'he'
        ? `אולפנים מסוג ${category} להשכרה בישראל. מצאו אולפן מקצועי עם ציוד מתקדם ומחירים נוחים. הזמינו עכשיו!`
        : `${category} studios for rent in Israel. Find professional studios with advanced equipment and affordable prices. Book now!`;
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
