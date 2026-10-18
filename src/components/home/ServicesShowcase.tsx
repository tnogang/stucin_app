import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Truck, Wrench, CircleDot, Paintbrush } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import towTruckAction from '@/assets/tow-truck-action.webp';
import workshopEquipment from '@/assets/workshop-equipment.webp';
import tireEquipment from '@/assets/tire-equipment.webp';
import workshopPaint from '@/assets/workshop-paint.webp';

function ServiceCard({ service, index }: { service: { id: string; title: string; subtitle: string; description: string; icon: any; image: string; color: string }; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y, scale }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className={`group relative ${index % 2 === 1 ? 'lg:mt-20' : ''}`}
    >
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-card border border-border hover:border-primary/30 transition-all duration-500">
        {/* Image */}
        <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
          <motion.img
            src={service.image}
            alt={service.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Icon Badge */}
          <div className={`absolute top-4 left-4 md:top-6 md:left-6 w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-${service.color}/20 backdrop-blur-xl border border-white/10 flex items-center justify-center`}>
            <service.icon className={`w-5 h-5 md:w-7 md:h-7 text-${service.color}`} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <span className={`text-${service.color} text-xs md:text-sm font-semibold uppercase tracking-wider`}>
            {service.subtitle}
          </span>
          <h3 className="font-display font-bold text-xl md:text-2xl lg:text-3xl text-foreground mt-1 md:mt-2 mb-2 md:mb-4">
            {service.title}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const services = [
    {
      id: 'avtovleka',
      title: t.services.servicesList.towing.title,
      subtitle: t.services.servicesList.towing.subtitle,
      description: t.services.servicesList.towing.description,
      icon: Truck,
      image: towTruckAction,
      color: 'tow-accent',
    },
    {
      id: 'servis',
      title: t.services.servicesList.service.title,
      subtitle: t.services.servicesList.service.subtitle,
      description: t.services.servicesList.service.description,
      icon: Wrench,
      image: workshopEquipment,
      color: 'destructive',
    },
    {
      id: 'vulkanizerstvo',
      title: t.services.servicesList.tires.title,
      subtitle: t.services.servicesList.tires.subtitle,
      description: t.services.servicesList.tires.description,
      icon: CircleDot,
      image: tireEquipment,
      color: 'success',
    },
    {
      id: 'kleparstvo',
      title: t.services.servicesList.bodywork.title,
      subtitle: t.services.servicesList.bodywork.subtitle,
      description: t.services.servicesList.bodywork.description,
      icon: Paintbrush,
      image: workshopPaint,
      color: 'primary',
    },
  ];

  return (
    <section ref={containerRef} className="py-16 md:py-24 lg:py-40 bg-background relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] md:w-[600px] lg:w-[800px] h-[400px] md:h-[600px] lg:h-[800px] bg-gradient-radial from-tow-accent/5 to-transparent rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-10 md:mb-16 lg:mb-24"
        >
          <span className="inline-block px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-semibold mb-4 md:mb-6">
            {t.services.badge}
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-foreground mb-4 md:mb-6">
            {t.services.allFor}<br />
            <span className="text-primary">{t.services.vehicle}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg lg:text-xl">
            {t.services.subtitle}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 lg:gap-12">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
