import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Phone, MapPin, Clock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';

export default function FinalCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative py-32 md:py-48 overflow-hidden section-dark">
      {/* Background Elements */}
      <div className="absolute inset-0 carbon-texture opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-tow-accent/10 to-transparent rounded-full blur-3xl" />
      
      <motion.div style={{ y, opacity }} className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6"
          >
            {t.finalCta.title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg md:text-xl mb-10 leading-relaxed max-w-lg mx-auto"
          >
            {t.finalCta.subtitle}
          </motion.p>

          {/* Contact Info Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid sm:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto"
          >
            <a href="tel:+38651200404" className="flex items-center gap-4 group glass-card p-4 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-tow-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5 text-tow-accent" />
              </div>
              <div className="text-left">
                <div className="text-white/50 text-sm">{t.finalCta.phone24}</div>
                <div className="text-white font-semibold text-lg">+386 51 200 404</div>
              </div>
            </a>
            
            <a href="mailto:stucin.martin@gmail.com" className="flex items-center gap-4 group glass-card p-4 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-white/50 text-sm">{t.finalCta.email}</div>
                <div className="text-white font-semibold">stucin.martin@gmail.com</div>
              </div>
            </a>
            
            <Link to="/lokacija" className="flex items-center gap-4 group glass-card p-4 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-success" />
              </div>
              <div className="text-left">
                <div className="text-white/50 text-sm">{t.finalCta.location}</div>
                <div className="text-white font-semibold">Goriška cesta 6f, 5271 Vipava</div>
              </div>
            </Link>
            
            <div className="flex items-center gap-4 glass-card p-4 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-destructive" />
              </div>
              <div className="text-left">
                <div className="text-white/50 text-sm">{t.finalCta.workshop}</div>
                <div className="text-white font-semibold">{t.finalCta.workshopHours}</div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="tel:+38651200404">
              <Button size="lg" className="btn-emergency text-white rounded-full px-10 py-7 text-lg animate-pulse-glow w-full sm:w-auto">
                <Phone className="w-6 h-6 mr-3" />
                {t.hero.towing.cta}
              </Button>
            </a>
            <Link to="/kontakt">
              <Button size="lg" variant="outline" className="rounded-full px-10 py-7 text-lg border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                {t.nav.contact}
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
