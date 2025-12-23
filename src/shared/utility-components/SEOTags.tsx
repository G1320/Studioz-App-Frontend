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

  // Structured Data (JSON-LD) for better SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Studioz',
    url: 'https://studioz.co.il',
    logo: {
      '@type': 'ImageObject',
      url: 'https://studioz.co.il/logo.png',
      width: 512,
      height: 512
    },
    sameAs: ['https://www.instagram.com/studioz', 'https://www.facebook.com/studioz'],
    areaServed: {
      '@type': 'Country',
      name: 'Israel'
    },
    priceRange: '$$'
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
      {/* Basic SEO */}
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={`https://studioz.co.il${canonicalPath}`} />
      <link rel="alternate" href={`https://studioz.co.il${enPath}`} hrefLang="en" />
      <link rel="alternate" href={`https://studioz.co.il${hePath}`} hrefLang="he" />
      <link rel="alternate" href={`https://studioz.co.il${enPath}`} hrefLang="x-default" />

      {/* Open Graph for richer previews (localized) */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={`https://studioz.co.il${canonicalPath}`} />
      <meta property="og:locale" content={currentLang === 'he' ? 'he_IL' : 'en_IL'} />
      <meta property="og:site_name" content="Studioz" />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </Helmet>
  );
};
