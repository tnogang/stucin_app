import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Phone, Wrench, ChevronDown, Clock, MapPin, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLayoutMode } from '@/components/layout/Layout';
import heroTow1 from '@/assets/tow-trucks-fleet.webp';
import heroTow2 from '@/assets/tow-truck-action.webp';
import heroTow3 from '@/assets/tow-truck-fleet.webp';
import heroTow4 from '@/assets/tow-truck-loading.webp';
import heroService1 from '@/assets/workshop-mechanics.webp';
import heroService2 from '@/assets/workshop-equipment.webp';
import heroService3 from '@/assets/workshop-service.webp';
import heroService4 from '@/assets/mechanic-work.webp';

type ActiveSection = 'tow' | 'service';

const towImages = [heroTow1, heroTow2, heroTow3, heroTow4];
const serviceImages = [heroService1, heroService2, heroService3, heroService4];

export default function HeroSection() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('tow');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { setActiveMode } = useLayoutMode();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Reset image index when switching sections
  const handleSectionChange = useCallback((section: ActiveSection) => {
    setActiveSection(section);
    setCurrentImageIndex(0);
  }, []);

  useEffect(() => {
    setActiveMode(activeSection);
  }, [activeSection, setActiveMode]);

  const currentImages = activeSection === 'tow' ? towImages : serviceImages;

  const iconMap = {
    tow: [
      { icon: Clock, text: t.hero.towing.features[0] },
      { icon: Zap, text: t.hero.towing.features[1] },
      { icon: Shield, text: t.hero.towing.features[2] },
    ],
    service: [
      { icon: Wrench, text: t.hero.workshop.features[0] },
      { icon: Shield, text: t.hero.workshop.features[1] },
      { icon: MapPin, text: t.hero.workshop.features[2] },
    ],
  };

  return (
    <section ref={containerRef} className="relative min-h-[100svh] overflow-hidden">
      {/* Background Images with Parallax + Auto-rotation */}
      <motion.div 
        className="absolute inset-0"
        style={{ scale }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeSection}-${currentImageIndex}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={currentImages[currentImageIndex]}
              alt={activeSection === 'tow' ? 'Avtovleka Štucin — pomoč na cesti 24/7 v Vipavi' : 'Servis vozil Štucin Vipava'}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 ${
              activeSection === 'tow' 
                ? 'bg-gradient-to-r from-black/90 via-black/70 to-black/50' 
                : 'bg-gradient-to-r from-black/90 via-black/75 to-black/60'
            }`} />
            {activeSection === 'tow' && (
              <div className="absolute inset-0 carbon-texture opacity-20" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Image indicator dots */}
        <div className="absolute bottom-32 md:bottom-20 right-4 md:right-8 z-20 flex flex-col gap-2">
          {currentImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                idx === currentImageIndex 
                  ? 'bg-tow-accent scale-125 shadow-lg shadow-tow-accent/50' 
                  : 'bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Image ${idx + 1}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Split Toggle Buttons - Translated */}
      <div className="absolute top-20 md:top-28 left-1/2 -translate-x-1/2 z-20 w-full px-4 md:px-0 md:w-auto">
        <div className="glass-card rounded-full p-1 md:p-1.5 flex gap-1 justify-center max-w-xs md:max-w-none mx-auto">
          <button
            onClick={() => handleSectionChange('tow')}
            className={`px-3 md:px-6 py-2 md:py-2.5 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 ${
              activeSection === 'tow'
                ? 'bg-gradient-to-r from-tow-accent to-emergency text-white shadow-lg'
                : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            🚗 {t.hero.tabs.towing}
          </button>
          <button
            onClick={() => handleSectionChange('service')}
            className={`px-3 md:px-6 py-2 md:py-2.5 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 ${
              activeSection === 'service'
                ? 'btn-service text-white shadow-lg'
                : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            🔧 {t.hero.tabs.service}
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 container mx-auto px-4 min-h-[100svh] flex items-center pt-32 md:pt-24 pb-20 md:pb-8">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            {activeSection === 'tow' ? (
              <motion.div
                key="tow-content"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-tow-accent/20 border border-tow-accent/30 mb-4 md:mb-6"
                >
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-tow-accent animate-pulse" />
                  <span className="text-tow-accent font-semibold text-xs md:text-sm">{t.hero.towing.badge}</span>
                </motion.div>

                <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 md:mb-6 leading-tight">
                  {t.hero.towing.title}
                  <span className="block text-gradient bg-gradient-to-r from-tow-accent to-emergency">{t.hero.towing.titleHighlight}</span>
                </h1>

                <p className="text-base md:text-lg lg:text-xl text-white/80 mb-6 md:mb-8 max-w-xl leading-relaxed">
                  {t.hero.towing.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-3 md:gap-4 mb-8 md:mb-10">
                  {iconMap.tow.map((feature, i) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-1.5 md:gap-2 text-white/70"
                    >
                      <feature.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-tow-accent" />
                      <span className="text-xs md:text-sm font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 md:gap-4"
                >
                  <a href="tel:+38651200404" className="w-full sm:w-auto">
                    <Button size="lg" className="btn-emergency text-white rounded-full px-5 md:px-8 py-5 md:py-6 text-sm md:text-lg animate-pulse-glow w-full sm:w-auto">
                      <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      <span className="hidden sm:inline">{t.hero.towing.cta} </span>
                      <span>+386 51 200 404</span>
                    </Button>
                  </a>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="rounded-full px-5 md:px-8 py-5 md:py-6 text-sm md:text-lg border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                    onClick={() => handleSectionChange('service')}
                  >
                    <Wrench className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    {t.hero.towing.ctaSecondary}
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="service-content"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/10 border border-white/20 mb-4 md:mb-6"
                >
                  <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                  <span className="text-white font-semibold text-xs md:text-sm">{t.hero.workshop.badge}</span>
                </motion.div>

                <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 md:mb-6 leading-tight">
                  {t.hero.workshop.title}
                  <span className="block text-primary">{t.hero.workshop.titleHighlight}</span>
                </h1>

                <p className="text-base md:text-lg lg:text-xl text-white/80 mb-6 md:mb-8 max-w-xl leading-relaxed">
                  {t.hero.workshop.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-3 md:gap-4 mb-8 md:mb-10">
                  {iconMap.service.map((feature, i) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-1.5 md:gap-2 text-white/70"
                    >
                      <feature.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                      <span className="text-xs md:text-sm font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 md:gap-4"
                >
                  <a href="/kontakt" className="w-full sm:w-auto">
                    <Button size="lg" className="btn-service text-white rounded-full px-5 md:px-8 py-5 md:py-6 text-sm md:text-lg w-full sm:w-auto">
                      <Wrench className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      {t.hero.workshop.cta}
                    </Button>
                  </a>
                  <a href="tel:+38651200404" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="rounded-full px-5 md:px-8 py-5 md:py-6 text-sm md:text-lg border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                    >
                      <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      {t.hero.workshop.ctaSecondary}
                    </Button>
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-xs font-medium">{t.common.scrollDown}</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
