import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Truck, Shield, Weight, Phone, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import towTruckLoading from '@/assets/tow-truck-loading.webp';

export default function TowingCapabilities() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const capabilities = [
    {
      icon: Truck,
      title: t.towingCapabilities.capabilities.towing.title,
      value: t.towingCapabilities.capabilities.towing.value,
      description: t.towingCapabilities.capabilities.towing.description,
      gradient: 'from-tow-accent/20 to-tow-accent/5',
      iconColor: 'text-tow-accent',
      valueColor: 'text-tow-accent',
      borderColor: 'border-tow-accent/20 hover:border-tow-accent/50',
    },
    {
      icon: Shield,
      title: t.towingCapabilities.capabilities.rescue.title,
      value: t.towingCapabilities.capabilities.rescue.value,
      description: t.towingCapabilities.capabilities.rescue.description,
      gradient: 'from-emergency/20 to-emergency/5',
      iconColor: 'text-emergency',
      valueColor: 'text-emergency',
      borderColor: 'border-emergency/20 hover:border-emergency/50',
    },
    {
      icon: Weight,
      title: t.towingCapabilities.capabilities.trucks.title,
      value: t.towingCapabilities.capabilities.trucks.value,
      description: t.towingCapabilities.capabilities.trucks.description,
      gradient: 'from-primary/20 to-primary/5',
      iconColor: 'text-primary',
      valueColor: 'text-primary',
      borderColor: 'border-primary/20 hover:border-primary/50',
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 overflow-hidden section-dark">
      {/* Parallax background image */}
      <motion.div 
        className="absolute inset-0 opacity-15"
        style={{ y: bgY }}
      >
        <img src={towTruckLoading} alt="Nalaganje vozila na vlečno vozilo Štucin" loading="lazy" decoding="async" className="w-full h-[120%] object-cover" />
      </motion.div>
      <div className="absolute inset-0 carbon-texture opacity-30" />
      
      {/* Animated gradient orbs */}
      <motion.div 
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 -left-20 w-96 h-96 bg-tow-accent/5 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 -right-20 w-96 h-96 bg-emergency/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-tow-accent/10 border border-tow-accent/20 text-tow-accent text-sm font-semibold mb-4 md:mb-6"
          >
            {t.towingCapabilities.badge}
          </motion.span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-4 md:mb-6">
            {t.towingCapabilities.title}<br />
            <span className="text-gradient">{t.towingCapabilities.titleHighlight}</span>
          </h2>
          <p className="text-white/60 text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4">
            {t.towingCapabilities.subtitle}
          </p>
        </motion.div>

        {/* Capability Cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 60, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className={`relative p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br ${cap.gradient} border ${cap.borderColor} transition-all duration-500 backdrop-blur-sm overflow-hidden`}>
                {/* Animated shine effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.8 }}
                />
                
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <cap.icon className={`w-7 h-7 md:w-8 md:h-8 ${cap.iconColor}`} />
                </div>
                
                <h3 className="font-display font-bold text-lg md:text-xl text-white mb-2">
                  {cap.title}
                </h3>
                
                <motion.div 
                  className={`font-display font-black text-4xl md:text-5xl lg:text-6xl ${cap.valueColor} mb-3 md:mb-4`}
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.15, type: "spring" }}
                >
                  {cap.value}
                </motion.div>
                
                <p className="text-white/60 text-sm md:text-base leading-relaxed">
                  {cap.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insurance Partners Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-tow-muted via-tow-dark to-tow-muted border border-white/10 p-6 md:p-8 lg:p-10 mb-10 md:mb-12"
        >
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-tow-accent/5 to-transparent -skew-x-12"
          />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div>
              <h3 className="font-display font-bold text-lg md:text-xl text-white mb-1">
                {t.towingCapabilities.insurancePartners}
              </h3>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {t.towingCapabilities.insuranceList.map((partner, idx) => (
                <motion.div
                  key={partner}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="px-5 md:px-6 py-2.5 md:py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm md:text-base hover:bg-white/10 hover:border-tow-accent/30 transition-all duration-300"
                >
                  {partner}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
          <a href="/storitve" className="group w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 md:gap-4 px-6 md:px-8 py-4 md:py-5 rounded-full bg-white/5 border border-white/10 text-white font-medium text-base md:text-lg hover:bg-white/10 transition-colors"
            >
              <span>{t.services.pageTitle || t.services.title}</span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-tow-accent" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
