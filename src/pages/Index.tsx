import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import SeoHreflang from '@/components/SeoHreflang';
import { useLanguage } from '@/i18n/LanguageContext';
import HeroSection from '@/components/home/HeroSection';
import ScrollShowcase from '@/components/home/ScrollShowcase';
import TowingCapabilities from '@/components/home/TowingCapabilities';
import ServicesShowcase from '@/components/home/ServicesShowcase';
import ParallaxGallery from '@/components/home/ParallaxGallery';
import VanRentalSection from '@/components/home/VanRentalSection';
import FinalCTA from '@/components/home/FinalCTA';

const Index = () => {
  const { t } = useLanguage();
  return (
    <>
      <Helmet>
        <title>{t.pages.home.title}</title>
        <meta 
          name="description" 
          content={t.pages.home.description} 
        />
        <meta name="keywords" content="avtovleka Vipava, avtovleka Ajdovščina, pomoč na cesti 24/7, servis vozil Vipava, vulkanizerstvo Vipava" />
        
        {/* Open Graph */}
        <meta property="og:title" content={t.pages.home.title} />
        <meta property="og:description" content={t.pages.home.description} />
        <meta property="og:type" content="website" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://www.avtovleka-stucin.si",
            "name": "Avtovleka in popravila Štucin",
            "alternateName": "Martin Štucin s.p.",
            "description": "Avtovleka in pomoč na cesti 24/7, servis vozil, vulkanizerstvo, kleparstvo in ličarstvo v Vipavi.",
            "url": "https://www.avtovleka-stucin.si",
            "telephone": "+386 51 200 404",
            "email": "stucin.martin@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Goriška cesta 6f",
              "addressLocality": "Vipava",
              "postalCode": "5271",
              "addressCountry": "SI"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "45.8467",
              "longitude": "13.9631"
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "07:30",
                "closes": "16:30"
              }
            ],
            "areaServed": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": "45.8467",
                "longitude": "13.9631"
              },
              "geoRadius": "50000"
            },
            "priceRange": "$$",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Storitve",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Avtovleka 24/7",
                    "description": "Hitra pomoč na cesti vse dni v letu"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Servis vozil",
                    "description": "Redno in izredno servisiranje vseh vrst vozil"
                  }
                }
              ]
            }
          })}
        </script>
      </Helmet>
      <SeoHreflang path="/" />
      
      <Layout>
        <HeroSection />
        <ScrollShowcase />
        <TowingCapabilities />
        <ServicesShowcase />
        <ParallaxGallery />
        <VanRentalSection />
        <FinalCTA />
      </Layout>
    </>
  );
};

export default Index;
