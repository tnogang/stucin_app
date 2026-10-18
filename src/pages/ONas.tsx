import { Helmet } from 'react-helmet-async';
import SeoHreflang from '@/components/SeoHreflang';
import { motion } from 'framer-motion';
import { Zap, Award, Users, Building2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/i18n/LanguageContext';

export default function ONas() {
  const { t } = useLanguage();

  const timeline = [
    t.pages.about.timeline.start,
    t.pages.about.timeline.expansion,
    t.pages.about.timeline.newPremises,
    t.pages.about.timeline.servicesExpansion,
    t.pages.about.timeline.modernization,
    t.pages.about.timeline.today,
  ];

  const values = [
    { icon: Zap, ...t.pages.about.values.fast },
    { icon: Award, ...t.pages.about.values.professional },
    { icon: Users, ...t.pages.about.values.quality },
  ];

  const partners = [
    t.pages.about.partnersList.triglav,
    t.pages.about.partnersList.tbs,
    t.pages.about.partnersList.coris,
    t.pages.about.partnersList.amzs,
  ];

  return (
    <>
      <Helmet>
        <title>{t.pages.about.title} | Avtovleka Štucin</title>
        <meta name="description" content={t.pages.about.description} />
      </Helmet>
      <SeoHreflang path="/o-nas" />

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
                {t.pages.about.title}
              </h1>
              <p className="text-white/70 text-base md:text-lg lg:text-xl px-4">
                {t.pages.about.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="py-12 md:py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 md:mb-16"
              >
                <Building2 className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-4" />
                <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-foreground mb-4 md:mb-6">
                  {t.pages.about.ourStory}
                </h2>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed px-4">
                  {t.pages.about.storyText}
                </p>
              </motion.div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />
                
                <div className="space-y-8 md:space-y-12">
                  {timeline.map((item, index) => (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={`flex flex-col md:flex-row items-center gap-4 md:gap-6 ${
                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      <div className={`flex-1 w-full ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                        <div className={`bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-6 ${
                          index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                        }`}>
                          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-display font-bold text-xs md:text-sm mb-2 md:mb-3">
                            {item.year}
                          </span>
                          <h3 className="font-display font-bold text-lg md:text-xl text-foreground mb-2">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground text-sm md:text-base">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      
                      <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg z-10 hidden md:block" />
                      
                      <div className="flex-1 hidden md:block" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Us */}
        <section className="py-12 md:py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 md:mb-12"
            >
              <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-foreground mb-4">
                {t.pages.about.whyChooseUs}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-card border border-border rounded-xl md:rounded-2xl p-6 md:p-8 text-center hover:border-primary/30 transition-colors"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <value.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-lg md:text-xl text-foreground mb-2 md:mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {value.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-12 md:py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 md:mb-12"
            >
              <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-foreground mb-4">
                {t.pages.about.partners}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                {t.pages.about.partnersDesc}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-4 md:p-6 text-center hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-display font-bold text-base md:text-lg text-foreground mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {partner.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
