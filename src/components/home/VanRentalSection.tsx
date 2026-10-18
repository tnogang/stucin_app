import { motion } from 'framer-motion';
import { Car, Truck, Users, Package, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';

export default function VanRentalSection() {
  const { t } = useLanguage();

  const vehicles = [
    {
      icon: Car,
      title: t.vanRental.vehicles.cars.title,
      description: t.vanRental.vehicles.cars.description,
      color: 'primary',
    },
    {
      icon: Users,
      title: t.vanRental.vehicles.passengerVans.title,
      description: t.vanRental.vehicles.passengerVans.description,
      color: 'tow-accent',
      badge: '9 🪑',
    },
    {
      icon: Package,
      title: t.vanRental.vehicles.cargoVans.title,
      description: t.vanRental.vehicles.cargoVans.description,
      color: 'destructive',
    },
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 md:mb-6">
            <Truck className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            <span className="text-primary font-semibold text-xs md:text-sm">{t.vanRental.badge}</span>
          </div>
          
          <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-foreground mb-3 md:mb-4">
            {t.vanRental.title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4">
            {t.vanRental.subtitle}
          </p>
        </motion.div>

        {/* Vehicle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group bg-card border border-border rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4 md:mb-6">
                <div className={`w-12 h-12 md:w-14 lg:w-16 md:h-14 lg:h-16 rounded-xl md:rounded-2xl bg-${vehicle.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <vehicle.icon className={`w-6 h-6 md:w-7 lg:w-8 md:h-7 lg:h-8 text-${vehicle.color}`} />
                </div>
                {vehicle.badge && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                    className="px-3 py-1 rounded-full bg-tow-accent/10 border border-tow-accent/30 text-tow-accent font-bold text-xs"
                  >
                    {vehicle.badge}
                  </motion.span>
                )}
              </div>
              
              <h3 className="font-display font-bold text-lg md:text-xl text-foreground mb-2 md:mb-3">
                {vehicle.title}
              </h3>
              
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {vehicle.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <a href="tel:+38641251215" className="w-full sm:w-auto">
              <Button size="lg" className="rounded-full px-6 md:px-8 py-5 md:py-6 text-sm md:text-lg w-full sm:w-auto">
                <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {t.vanRental.cta}
              </Button>
            </a>
            <a href="/kontakt" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="rounded-full px-6 md:px-8 py-5 md:py-6 text-sm md:text-lg w-full sm:w-auto">
                {t.vanRental.ctaSecondary}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </Button>
            </a>
          </div>
          <p className="mt-3 text-muted-foreground text-sm">
            {t.vanRental.phone}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
