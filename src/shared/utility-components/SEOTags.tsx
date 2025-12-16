// components/utility/SEOTags.tsx
import { Helmet } from 'react-helmet-async';
import { getPageTitle, getMetaDescription } from '@shared/utils/seoUtils';

export const SEOTags = ({ path, search = '' }: { path: string; search?: string }) => {
  const lang = path.split('/')[1] || 'en';
  const currentLang = lang === 'he' ? 'he' : 'en';

  // Remove language prefix to get the base path
  // Handle edge cases: '/', '/en', '/he', '/en/studios', etc.
  let basePath = path;
  if (path.startsWith(`/${lang}`)) {
    basePath = path.replace(`/${lang}`, '') || '/';
  }

  // Ensure basePath starts with / if it's not empty
  if (basePath && !basePath.startsWith('/')) {
    basePath = `/${basePath}`;
  }
  if (!basePath || basePath === '') {
    basePath = '/';
  }

  // Canonical should be self-referential per language to allow both locales to index
  const canonicalPath = basePath === '/' ? `/${currentLang}` : `/${currentLang}${basePath}`;

  // SEO Keywords for meta tags - English
  const seoKeywordsEn = [
    'studio rental',
    'music studio',
    'podcast studio',
    'recording studio',
    'mixing studio',
    'mastering studio',
    'photo studio',
    'video studio',
    'sound studio',
    'audio studio',
    'music production studio',
    'vocal recording studio',
    'instrument recording studio',
    'band rehearsal studio',
    'film production studio',
    'post production studio',
    'sound design studio',
    'foley studio',
    'voiceover studio',
    'dubbing studio',
    'remote production services',
    'studio booking',
    'studio reservation',
    'studio hire',
    'studio rental Israel',
    'music studio Tel Aviv',
    'recording studio Jerusalem',
    'podcast studio rental',
    'mixing services',
    'mastering services',
    'audio engineering services',
    'studio equipment rental',
    'professional recording studio',
    'home studio',
    'commercial studio',
    'studio space rental',
    'creative studio space',
    'music production services',
    'audio post production',
    'sound mixing',
    'audio mastering',
    'music recording',
    'podcast recording',
    'video production',
    'photo shoot studio',
    'video shoot studio',
    'studio for rent',
    'affordable studio rental',
    'professional studio',
    'studio with equipment',
    'studio reviews',
    'studio ratings',
    'best recording studio',
    'top music studio',
    'music studio sessions near me',
    'music studio for rent near me',
    'music production israel'
  ].join(', ');

  // SEO Keywords for meta tags - Hebrew
  const seoKeywordsHe = [
    'השכרת אולפן',
    'אולפן מוזיקה',
    'אולפן הקלטות',
    'אולפני הקלטות',
    'אולפני פודקאסט',
    'אולפן פודקאסט',
    'אולפן הקלטות',
    'אולפן מיקס',
    'אולפן מאסטרינג',
    'אולפן צילום',
    'אולפן וידאו',
    'אולפן סאונד',
    'אולפן אודיו',
    'אולפן הפקת מוזיקה',
    'אולפן הקלטת קול',
    'אולפן הקלטת כלים',
    'אולפן חזרות להקה',
    'אולפן הפקת סרטים',
    'אולפן פוסט פרודקשן',
    'אולפן עיצוב סאונד',
    'אולפן פולי',
    'אולפן דיבוב',
    'שירותי הפקה מרחוק',
    'הזמנת אולפן',
    'השכרת אולפן ישראל',
    'אולפן מוזיקה תל אביב',
    'אולפן הקלטות ירושלים',
    'השכרת אולפן פודקאסט',
    'שירותי מיקס',
    'שירותי מאסטרינג',
    'שירותי הנדסת אודיו',
    'השכרת ציוד אולפן',
    'אולפן הקלטות מקצועי',
    'אולפן ביתי',
    'אולפן מסחרי',
    'השכרת חלל אולפן',
    'חלל אולפן יצירתי',
    'שירותי הפקת מוזיקה',
    'שירותי הפקת מוזיקלית',
    'פוסט פרודקשן וקריינות',
    'מיקס סאונד',
    'מאסטרינג אודיו',
    'הקלטת מוזיקה',
    'הקלטת פודקאסט',
    'הפקת וידאו',
    'אולפן צילום',
    'אולפן צילום וידאו',
    'אולפן להשכרה',
    'השכרת אולפן במחיר נוח',
    'השכרת אולפן לפי שעה',
    'אולפן מקצועי',
    'אולפן עם ציוד',
    'ביקורות אולפן',
    'דירוגי אולפן',
    'אולפן הקלטות הטוב ביותר',
    'אולפן מוזיקה מוביל'
  ].join(', ');

  const seoKeywords = currentLang === 'he' ? seoKeywordsHe : seoKeywordsEn;

  // Structured Data (JSON-LD) for better SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Studioz',
    description:
      currentLang === 'he'
        ? 'גלו והזמינו אולפני הקלטה, פודקאסט, צילום ווידאו בכל רחבי ישראל. השוו חללים, ציוד ומחירים והזמינו את האולפן המושלם בדקות.'
        : 'Discover and book recording, podcast, photo and video studios across Israel. Compare spaces, gear and prices and reserve the perfect studio in minutes.',
    url: 'https://studioz.co.il',
    telephone: '+972-XX-XXX-XXXX',
    email: 'info@studioz.online',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
      addressLocality: currentLang === 'he' ? 'ישראל' : 'Israel'
    },
    sameAs: [],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '100'
    },
    priceRange: '$$',
    areaServed: {
      '@type': 'Country',
      name: currentLang === 'he' ? 'ישראל' : 'Israel'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: currentLang === 'he' ? 'השכרת אולפנים ושירותים' : 'Studio Rentals and Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: currentLang === 'he' ? 'השכרת אולפן מוזיקה' : 'Music Studio Rental',
            description:
              currentLang === 'he'
                ? 'השכרת אולפן הפקת מוזיקה והקלטות מקצועי'
                : 'Professional music production and recording studio rental'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: currentLang === 'he' ? 'השכרת אולפן פודקאסט' : 'Podcast Studio Rental',
            description:
              currentLang === 'he'
                ? 'השכרת אולפן הקלטת פודקאסט עם ציוד מקצועי'
                : 'Podcast recording studio rental with professional equipment'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: currentLang === 'he' ? 'השכרת אולפן צילום' : 'Photo Studio Rental',
            description: currentLang === 'he' ? 'השכרת אולפן צילום מקצועי' : 'Professional photo shoot studio rental'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: currentLang === 'he' ? 'השכרת אולפן וידאו' : 'Video Studio Rental',
            description:
              currentLang === 'he' ? 'השכרת אולפן הפקת וידאו וסרטים' : 'Video production and film studio rental'
          }
        }
      ]
    }
  };

  // Construct alternate language paths
  const enPath = basePath === '/' ? '/en' : `/en${basePath}`;
  const hePath = basePath === '/' ? '/he' : `/he${basePath}`;

  // Extract filters from URL and decode them
  const pathParts = basePath.split('/').filter(Boolean);
  const category = pathParts[0] === 'studios' ? decodeURIComponent(pathParts[1] || '') : '';
  const subcategory = pathParts[0] === 'studios' && pathParts[2] ? decodeURIComponent(pathParts[2]) : '';

  // Extract city from query parameters (URLSearchParams.get() already decodes, but we'll ensure it's clean)
  const searchParams = new URLSearchParams(search);
  const cityParam = searchParams.get('city');
  const city = cityParam ? decodeURIComponent(cityParam) : undefined;

  // Generate SEO content using utility functions
  const seoContext = {
    basePath,
    currentLang: currentLang as 'en' | 'he',
    category: category || undefined,
    subcategory: subcategory || undefined,
    city: city
  };
  const pageTitle = getPageTitle(seoContext);
  const metaDescription = getMetaDescription(seoContext);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={`https://studioz.co.il${canonicalPath}`} />
      <link rel="alternate" href={`https://studioz.co.il${enPath}`} hrefLang="en" />
      <link rel="alternate" href={`https://studioz.co.il${hePath}`} hrefLang="he" />
      <link rel="alternate" href="https://studioz.co.il/en" hrefLang="x-default" />
      <meta name="keywords" content={seoKeywords} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </Helmet>
  );
};
