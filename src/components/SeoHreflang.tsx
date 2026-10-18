import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/i18n/LanguageContext';

const BASE = 'https://www.avtovleka-stucin.si';

interface SeoHreflangProps {
  /** Slovenian path of the page, e.g. "/" or "/storitve" */
  path: string;
}

/**
 * Emits a self-referencing canonical plus hreflang alternates (sl / it /
 * x-default) for the current page. Place inside a page component next to its
 * existing Helmet block.
 */
export default function SeoHreflang({ path }: SeoHreflangProps) {
  const { language } = useLanguage();
  const slUrl = `${BASE}${path === '/' ? '/' : path}`;
  const itUrl = `${BASE}/it${path === '/' ? '' : path}`;
  const canonical = language === 'it' ? itUrl : slUrl;

  return (
    <Helmet>
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="sl" href={slUrl} />
      <link rel="alternate" hrefLang="it" href={itUrl} />
      <link rel="alternate" hrefLang="x-default" href={slUrl} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={language === 'it' ? 'it_IT' : 'sl_SI'} />
    </Helmet>
  );
}
