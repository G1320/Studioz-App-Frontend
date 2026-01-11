import { Helmet } from 'react-helmet-async';
import { Studio, Item } from 'src/types/index';

interface StudioSchemaProps {
  studio: Studio;
  items: Item[];
  lang: 'en' | 'he';
}

/**
 * Generates rich structured data (JSON-LD) for studio pages
 * This helps Google understand the studio and its services for better indexing
 */
export const StudioSchema: React.FC<StudioSchemaProps> = ({ studio, items, lang }) => {
  if (!studio) return null;

  const studioName = studio.name?.[lang] || studio.name?.en || 'Studio';
  const studioDescription = studio.description?.[lang] || studio.description?.en || '';
  const studioUrl = `https://studioz.co.il/${lang}/studio/${studio._id}`;

  // Get studio image
  const studioImage = studio.coverImage || studio.galleryImages?.[0] || 'https://studioz.co.il/logo.png';

  // Calculate priceRange from actual item prices
  const getPriceRange = (): string | undefined => {
    const prices = items.map((item) => item.price).filter((p): p is number => p !== undefined && p > 0);
    if (prices.length === 0) return undefined;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = (minPrice + maxPrice) / 2;

    // ILS-based price ranges (approximate)
    if (avgPrice < 100) return '$';
    if (avgPrice < 300) return '$$';
    if (avgPrice < 600) return '$$$';
    return '$$$$';
  };

  // Build the offer catalog from items (single source of truth for services)
  const offerCatalog =
    items.length > 0
      ? {
          '@type': 'OfferCatalog',
          name: lang === 'he' ? 'שירותי האולפן' : 'Studio Services',
          itemListElement: items.map((item, index) => ({
            '@type': 'Offer',
            position: index + 1,
            itemOffered: {
              '@type': 'Service',
              name: item.name?.[lang] || item.name?.en || 'Service',
              description: item.description?.[lang] || item.description?.en || '',
              url: `https://studioz.co.il/${lang}/item/${item._id}`,
              image: item.imageUrl || 'https://studioz.co.il/logo.png'
            },
            price: item.price?.toString() || '0',
            priceCurrency: 'ILS',
            // Omit availability since it depends on calendar - Google doesn't require it
            ...(item.pricePer && {
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: item.price?.toString() || '0',
                priceCurrency: 'ILS',
                unitText: item.pricePer
              }
            })
          }))
        }
      : undefined;

  // Build optimized opening hours from studio availability
  // Groups days with identical hours together, handles 24/7 specially
  const buildOpeningHours = () => {
    if (!studio.studioAvailability?.days || !studio.studioAvailability?.times) {
      return [];
    }

    const allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Group days by their hours
    const hourGroups = new Map<string, string[]>();

    studio.studioAvailability.days.forEach((day, index) => {
      const time = studio.studioAvailability?.times?.[index];
      if (!time) return;

      const timeKey = `${time.start}-${time.end}`;
      const existing = hourGroups.get(timeKey) || [];
      existing.push(day);
      hourGroups.set(timeKey, existing);
    });

    // Check if it's 24/7 (all days, 00:00-23:59)
    const is24_7 =
      studio.studioAvailability.days.length === 7 &&
      studio.studioAvailability.times.every((t) => t.start === '00:00' && (t.end === '23:59' || t.end === '00:00'));

    if (is24_7) {
      return [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: allDays,
          opens: '00:00',
          closes: '23:59'
        }
      ];
    }

    // Convert grouped hours to schema format
    const specs: object[] = [];
    hourGroups.forEach((days, timeKey) => {
      const [opens, closes] = timeKey.split('-');
      specs.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days.length === 1 ? days[0] : days,
        opens,
        closes
      });
    });

    return specs;
  };

  const openingHoursSpecification = buildOpeningHours();

  // Build aggregate rating if available
  const aggregateRating =
    studio.averageRating && studio.reviewCount
      ? {
          '@type': 'AggregateRating',
          ratingValue: studio.averageRating.toFixed(1),
          reviewCount: studio.reviewCount,
          bestRating: '5',
          worstRating: '1'
        }
      : undefined;

  const priceRange = getPriceRange();

  // Main structured data - using MusicStudio as primary type
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MusicStudio',
    '@id': studioUrl,
    name: studioName,
    description: studioDescription,
    url: studioUrl,
    image: studioImage,
    ...(studio.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: studio.address,
        ...(studio.city && { addressLocality: studio.city }),
        addressCountry: 'IL'
      }
    }),
    ...(studio.lat &&
      studio.lng && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: studio.lat,
          longitude: studio.lng
        }
      }),
    ...(studio.phone && { telephone: studio.phone }),
    // sameAs as array for future-proofing (can add socials later)
    ...(studio.website && { sameAs: [studio.website] }),
    // areaServed for local SEO boost
    areaServed: {
      '@type': 'AdministrativeArea',
      name: studio.city || 'Israel'
    },
    ...(openingHoursSpecification.length > 0 && { openingHoursSpecification }),
    ...(aggregateRating && { aggregateRating }),
    ...(offerCatalog && { hasOfferCatalog: offerCatalog }),
    ...(priceRange && { priceRange }),
    paymentAccepted: ['Cash', 'Credit Card'],
    currenciesAccepted: 'ILS',
    // Amenities as amenityFeature
    ...(studio.amenities &&
      studio.amenities.length > 0 && {
        amenityFeature: studio.amenities.map((amenity) => ({
          '@type': 'LocationFeatureSpecification',
          name: amenity,
          value: true
        }))
      })
  };

  return (
    <Helmet>
      {/* MusicStudio schema with OfferCatalog for services */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>

      {/* Dynamic meta tags for the specific studio */}
      <title>{studioName} | Studioz</title>
      <meta name="description" content={studioDescription.slice(0, 160)} />
      <meta property="og:title" content={`${studioName} | Studioz`} />
      <meta property="og:description" content={studioDescription.slice(0, 160)} />
      <meta property="og:image" content={studioImage} />
      <meta property="og:url" content={studioUrl} />
      <meta property="og:type" content="business.business" />
      <link rel="canonical" href={studioUrl} />
    </Helmet>
  );
};

export default StudioSchema;
