// components/utility/SEOTags.tsx
import { Helmet } from 'react-helmet-async';

export const SEOTags = ({ path }: { path: string }) => {
  const lang = path.split('/')[1];

  const canonicalPath = path.replace(`/${lang}`, '');

  return (
    <Helmet>
      <link rel="canonical" href={`https://studioz.co.il${canonicalPath}`} />
      <link rel="alternate" href={`https://studioz.co.il/en${canonicalPath}`} hrefLang="en" />
      <link rel="alternate" href={`https://studioz.co.il/he${canonicalPath}`} hrefLang="he" />
      <link rel="alternate" href={`https://studioz.co.il${canonicalPath}`} hrefLang="x-default" />
    </Helmet>
  );
};
