import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Phone, MapPin, Clock, Award, Users, Truck } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import towTruckFleet from '@/assets/tow-truck-fleet.webp';
import workshopService from '@/assets/workshop-service.webp';
import mechanicWork from '@/assets/mechanic-work.webp';

export default function ScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [150, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const stats = [
    { icon: Clock, value: '24/7', label: t.scrollShowcase.stats.availability },
    { icon: Truck, value: '20+', label: t.scrollShowcase.stats.experience },
    { icon: Users, value: '5000+', label: t.scrollShowcase.stats.customers },
    { icon: Award, value: '100%', label: t.scrollShowcase.stats.reliability },
  ];

  return (
    <section ref={containerRef} className="relative py-24 md:py-32 lg:py-48 overflow-hidden section-dark">
      {/* Background Pattern */}
      <div className="absolute inset-0 carbon-texture opacity-30" />
      
      {/* Floating Images - Hidden on mobile for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <motion.div
          style={{ y: y1 }}
          className="absolute -left-20 top-20 w-64 lg:w-80 h-72 lg:h-96 rounded-3xl overflow-hidden opacity-40 rotate-[-8deg]"
        >
          <img src={towTruckFleet} alt="Vozni park avtovleke Štucin" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </motion.div>
        
        <motion.div
          style={{ y: y2 }}
          className="absolute -right-10 top-40 w-56 lg:w-72 h-64 lg:h-80 rounded-3xl overflow-hidden opacity-30 rotate-[5deg]"
        >
          <img src={workshopService} alt="Servis vozil v delavnici Štucin" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </motion.div>
        
        <motion.div
          style={{ y: y3 }}
          className="absolute left-1/4 bottom-0 w-48 lg:w-64 h-56 lg:h-72 rounded-3xl overflow-hidden opacity-25 rotate-[3deg]"
        >
          <img src={mechanicWork} alt="Mehanik pri delu na vozilu" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </motion.div>
      </div>

      <motion.div 
        style={{ opacity, scale }}
        className="container mx-auto px-4 relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-tow-accent/10 border border-tow-accent/20 text-tow-accent text-sm font-semibold mb-4 md:mb-6">
            {t.scrollShowcase.badge}
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-4 md:mb-6">
            {t.scrollShowcase.title}<br />
            <span className="text-gradient">{t.scrollShowcase.titleHighlight}</span>
          </h2>
          <p className="text-white/60 text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4">
            {t.scrollShowcase.description}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-tow-accent/20 to-transparent rounded-2xl md:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-tow-muted to-tow-dark border border-white/5 hover:border-tow-accent/30 transition-colors">
                <div className="w-10 h-10 md:w-12 lg:w-14 md:h-12 lg:h-14 rounded-xl md:rounded-2xl bg-tow-accent/10 flex items-center justify-center mb-3 md:mb-4 lg:mb-6 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-5 h-5 md:w-6 lg:w-7 md:h-6 lg:h-7 text-tow-accent" />
                </div>
                <div className="font-display font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white mb-1 md:mb-2">
                  {stat.value}
                </div>
                <div className="text-white/50 font-medium text-xs md:text-sm">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
        >
          <a href="tel:+38651200404" className="group w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 md:gap-4 px-6 md:px-8 py-4 md:py-5 rounded-full bg-gradient-to-r from-tow-accent to-yellow-500 text-black font-bold text-base md:text-lg shadow-xl shadow-tow-accent/30"
            >
              <Phone className="w-5 h-5 md:w-6 md:h-6" />
              <span>{t.common.phone}</span>
            </motion.div>
          </a>
          <a href="/lokacija" className="group w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 md:gap-4 px-6 md:px-8 py-4 md:py-5 rounded-full bg-white/5 border border-white/10 text-white font-medium text-base md:text-lg hover:bg-white/10 transition-colors"
            >
              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-tow-accent" />
              <span>{t.scrollShowcase.findUs}</span>
            </motion.div>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
