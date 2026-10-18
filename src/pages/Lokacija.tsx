import { Helmet } from 'react-helmet-async';
import SeoHreflang from '@/components/SeoHreflang';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Lokacija() {
  const { t } = useLanguage();
  const googleMapsUrl = "https://www.google.com/maps/dir/?api=1&destination=Goriška+cesta+6f,+5271+Vipava,+Slovenia";

  return (
    <>
      <Helmet>
        <title>{t.pages.location.title} | Avtovleka Štucin | Vipava</title>
        <meta name="description" content={t.pages.location.description} />
      </Helmet>
      <SeoHreflang path="/lokacija" />

      <Layout>
        {/* Hero */}
        <section className="py-20 md:py-32 section-dark relative overflow-hidden">
          <div className="absolute inset-0 carbon-texture opacity-20" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-4 md:mb-6">
                {t.pages.location.title}
              </h1>
              <p className="text-white/70 text-base md:text-lg lg:text-xl mb-6 md:mb-8 px-4">
                {t.pages.location.description}
              </p>
              <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/10 border border-white/20">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-tow-accent" />
                <span className="text-white font-medium text-sm md:text-base">Goriška cesta 6f, 5271 Vipava</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Map & Info */}
        <section className="py-12 md:py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2 rounded-xl md:rounded-2xl overflow-hidden shadow-xl"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2788.5!2d13.963!3d45.847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477387c0d8e34f1b%3A0x1234567890abcdef!2sGori%C5%A1ka%20cesta%206f%2C%205271%20Vipava%2C%20Slovenia!5e0!3m2!1ssl!2ssi!4v1234567890123!5m2!1ssl!2ssi"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokacija Avtovleka Štucin"
                  className="w-full h-[300px] md:h-[400px] lg:h-[500px]"
                />
              </motion.div>

              {/* Info Cards */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-4 md:space-y-6"
              >
                {/* Address Card */}
                <div className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <h2 className="font-display font-bold text-base md:text-lg text-foreground">{t.pages.location.address}</h2>
                  </div>
                  <p className="text-foreground font-medium text-sm md:text-base mb-1">Goriška cesta 6f</p>
                  <p className="text-muted-foreground text-sm md:text-base mb-4">5271 Vipava, Slovenija</p>
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="btn-service text-white rounded-full w-full text-sm md:text-base">
                      <Navigation className="w-4 h-4 mr-2" />
                      {t.pages.location.openInMaps}
                    </Button>
                  </a>
                </div>

                {/* Contact Card */}
                <div className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-tow-accent/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 md:w-5 md:h-5 text-tow-accent" />
                    </div>
                    <h2 className="font-display font-bold text-base md:text-lg text-foreground">{t.pages.location.contactTitle}</h2>
                  </div>
                  <a href="tel:+38651200404" className="block mb-2 md:mb-3">
                    <p className="font-display font-bold text-lg md:text-xl text-tow-accent hover:underline">
                      +386 51 200 404
                    </p>
                  </a>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {t.pages.location.available}
                  </p>
                </div>

                {/* Hours Card */}
                <div className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                    </div>
                    <h2 className="font-display font-bold text-base md:text-lg text-foreground">{t.pages.location.workingHours}</h2>
                  </div>
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.pages.contact.hours.towing.service}</span>
                      <span className="font-semibold text-tow-accent">24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.pages.contact.hours.workshop.service}</span>
                      <span className="font-medium text-foreground">7:30–16:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.pages.contact.hours.carwash.service}</span>
                      <span className="font-medium text-foreground">7:30–16:30</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
