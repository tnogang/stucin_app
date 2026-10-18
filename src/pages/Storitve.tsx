import { Helmet } from 'react-helmet-async';
import SeoHreflang from '@/components/SeoHreflang';
import { motion } from 'framer-motion';
import { 
  Truck, Wrench, Car, Droplets, Paintbrush, Warehouse, 
  Recycle, AlertTriangle, CircleDot 
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Storitve() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Truck,
      title: t.pages.services.list.towing.title,
      description: t.pages.services.list.towing.description,
      accent: 'tow',
      badge: t.pages.services.list.towing.badge,
    },
    {
      icon: AlertTriangle,
      title: t.pages.services.list.rescue.title,
      description: t.pages.services.list.rescue.description,
      accent: 'tow',
    },
    {
      icon: Wrench,
      title: t.pages.services.list.service.title,
      description: t.pages.services.list.service.description,
      accent: 'service',
    },
    {
      icon: CircleDot,
      title: t.pages.services.list.tires.title,
      description: t.pages.services.list.tires.description,
      accent: 'default',
    },
    {
      icon: Paintbrush,
      title: t.pages.services.list.bodywork.title,
      description: t.pages.services.list.bodywork.description,
      accent: 'default',
    },
    {
      icon: Droplets,
      title: t.pages.services.list.washing.title,
      description: t.pages.services.list.washing.description,
      accent: 'default',
    },
    {
      icon: Car,
      title: t.pages.services.list.rental.title,
      description: t.pages.services.list.rental.description,
      accent: 'default',
    },
    {
      icon: Warehouse,
      title: t.pages.services.list.storage.title,
      description: t.pages.services.list.storage.description,
      accent: 'default',
    },
    {
      icon: Recycle,
      title: t.pages.services.list.disposal.title,
      description: t.pages.services.list.disposal.description,
      accent: 'default',
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t.pages.services.title} | Avtovleka Štucin | Vipava</title>
        <meta name="description" content={t.pages.services.description} />
      </Helmet>
      <SeoHreflang path="/storitve" />

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
                {t.pages.services.title}
              </h1>
              <p className="text-white/70 text-base md:text-lg lg:text-xl px-4">
                {t.pages.services.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 md:py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <div
                    className={`group flex items-start gap-4 md:gap-6 p-4 md:p-6 rounded-xl md:rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                      service.accent === 'tow'
                        ? 'bg-gradient-to-br from-tow-dark to-tow-muted hover:shadow-xl hover:shadow-tow-accent/20'
                        : service.accent === 'service'
                        ? 'bg-gradient-to-br from-primary to-primary/80 hover:shadow-xl hover:shadow-primary/30'
                        : 'bg-card border border-border hover:border-primary/30 hover:shadow-lg'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                        service.accent === 'tow'
                          ? 'bg-tow-accent/20'
                          : service.accent === 'service'
                          ? 'bg-white/20'
                          : 'bg-primary/10'
                      }`}
                    >
                      <service.icon
                        className={`w-5 h-5 md:w-7 md:h-7 ${
                          service.accent === 'tow'
                            ? 'text-tow-accent'
                            : service.accent === 'service'
                            ? 'text-white'
                            : 'text-primary'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2 flex-wrap">
                        <h2
                          className={`font-display font-bold text-base md:text-xl ${
                            service.accent === 'tow' || service.accent === 'service'
                              ? 'text-white'
                              : 'text-foreground'
                          }`}
                        >
                          {service.title}
                        </h2>
                        {service.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-tow-accent text-white text-xs font-bold">
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs md:text-sm leading-relaxed ${
                          service.accent === 'tow'
                            ? 'text-white/70'
                            : service.accent === 'service'
                            ? 'text-white/80'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
