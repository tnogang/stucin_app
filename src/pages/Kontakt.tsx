import { Helmet } from 'react-helmet-async';
import SeoHreflang from '@/components/SeoHreflang';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Kontakt() {
  const { t } = useLanguage();

  const workingHours = [
    { service: t.pages.contact.hours.towing.service, hours: t.pages.contact.hours.towing.hours, highlight: true, subtext: undefined as string | undefined },
    { service: t.pages.contact.hours.workshop.service, hours: t.pages.contact.hours.workshop.hours, highlight: false, subtext: t.pages.contact.hours.workshop.subtext },
    { service: t.pages.contact.hours.carwash.service, hours: t.pages.contact.hours.carwash.hours, highlight: false, subtext: t.pages.contact.hours.carwash.subtext },
  ];

  return (
    <>
      <Helmet>
        <title>{t.pages.contact.title} | Avtovleka Štucin</title>
        <meta name="description" content={t.pages.contact.description} />
      </Helmet>
      <SeoHreflang path="/kontakt" />

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
                {t.pages.contact.title}
              </h1>
              <p className="text-white/70 text-base md:text-lg lg:text-xl px-4">
                {t.pages.contact.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-12 md:py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
              {/* Quick Contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-6"
              >
                <h3 className="font-display font-bold text-lg md:text-xl text-foreground mb-4 md:mb-6">
                  {t.pages.contact.directContact}
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a href="tel:+38651200404" className="flex items-start gap-3 md:gap-4 group">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-tow-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-tow-accent/20 transition-colors">
                        <Phone className="w-4 h-4 md:w-5 md:h-5 text-tow-accent" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">{t.pages.contact.phone}</p>
                        <p className="font-display font-bold text-base md:text-lg text-foreground group-hover:text-tow-accent transition-colors">
                          +386 51 200 404
                        </p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="mailto:stucin.martin@gmail.com" className="flex items-start gap-3 md:gap-4 group">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">{t.pages.contact.emailLabel}</p>
                        <p className="font-display font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors break-all">
                          stucin.martin@gmail.com
                        </p>
                      </div>
                    </a>
                  </li>
                  <li className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">{t.pages.contact.businessPremises}</p>
                      <p className="font-semibold text-sm md:text-base text-foreground">Goriška cesta 6f, 5271 Vipava</p>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">{t.pages.contact.mailingAddress}</p>
                    </div>
                  </li>
                </ul>
              </motion.div>

              {/* Working Hours */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-6"
              >
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  <h3 className="font-display font-bold text-lg md:text-xl text-foreground">
                    {t.pages.contact.workingHours}
                  </h3>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {workingHours.map((item) => (
                    <div
                      key={item.service}
                      className={`flex items-center justify-between p-2 md:p-3 rounded-lg md:rounded-xl ${
                        item.highlight ? 'bg-tow-accent/10 border border-tow-accent/20' : 'bg-muted/50'
                      }`}
                    >
                      <div>
                        <p className={`font-semibold text-sm md:text-base ${item.highlight ? 'text-tow-accent' : 'text-foreground'}`}>
                          {item.service}
                        </p>
                        {item.subtext && (
                          <p className="text-xs text-muted-foreground">{item.subtext}</p>
                        )}
                      </div>
                      <p className={`font-medium text-xs md:text-sm ${item.highlight ? 'text-tow-accent' : 'text-muted-foreground'}`}>
                        {item.hours}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Emergency CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-br from-tow-dark to-tow-muted rounded-xl md:rounded-2xl p-4 md:p-6 text-center"
              >
                <p className="text-white/70 mb-3 md:mb-4 text-sm md:text-base">{t.pages.contact.emergencyCta}</p>
                <a href="tel:+38651200404">
                  <Button size="lg" className="btn-emergency text-white rounded-full px-6 md:px-8 animate-pulse-glow">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    {t.pages.contact.callNow}
                  </Button>
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}