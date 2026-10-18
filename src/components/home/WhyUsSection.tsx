import { motion } from 'framer-motion';
import { Zap, Award, Users, Clock } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

const partners = [
  { name: 'Zavarovalnica Triglav', short: 'TRIGLAV' },
  { name: 'TBS', short: 'TBS' },
  { name: 'Asistenca CORIS', short: 'CORIS' },
  { name: 'AMZS', short: 'AMZS' },
];

export default function WhyUsSection() {
  const { t } = useLanguage();

  const reasons = [
    {
      icon: Zap,
      title: t.whyUs.reasons.fast.title,
      description: t.whyUs.reasons.fast.description,
    },
    {
      icon: Award,
      title: t.whyUs.reasons.professional.title,
      description: t.whyUs.reasons.professional.description,
    },
    {
      icon: Users,
      title: t.whyUs.reasons.quality.title,
      description: t.whyUs.reasons.quality.description,
    },
    {
      icon: Clock,
      title: t.whyUs.reasons.available.title,
      description: t.whyUs.reasons.available.description,
    },
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 section-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 carbon-texture opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white mb-3 md:mb-4">
            {t.whyUs.title}
          </h2>
          <p className="text-white/70 text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-4">
            {t.whyUs.subtitle}
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-20">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group p-5 md:p-6 lg:p-8 rounded-xl md:rounded-2xl bg-gradient-to-br from-tow-muted to-tow-dark border border-white/10 hover:border-tow-accent/30 transition-all duration-300"
            >
              <div className="w-10 h-10 md:w-12 lg:w-14 md:h-12 lg:h-14 rounded-lg md:rounded-xl bg-tow-accent/20 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <reason.icon className="w-5 h-5 md:w-6 lg:w-7 md:h-6 lg:h-7 text-tow-accent" />
              </div>
              <h3 className="font-display font-bold text-lg md:text-xl text-white mb-2 md:mb-3">
                {reason.title}
              </h3>
              <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-white/50 text-xs md:text-sm font-medium mb-6 md:mb-8 uppercase tracking-wider">
            {t.whyUs.partners}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 lg:gap-12">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="px-4 md:px-6 py-2 md:py-3 rounded-lg bg-white/5 border border-white/10"
              >
                <span className="font-display font-bold text-white/80 text-sm md:text-lg">
                  {partner.short}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
