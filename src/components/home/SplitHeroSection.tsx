import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, Wrench, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';

import towTruckImage from '@/assets/tow-truck-fleet.webp';
import workshopImage from '@/assets/workshop-service.webp';

const SplitHeroSection = () => {
  const [hoveredSide, setHoveredSide] = useState<'towing' | 'workshop' | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleTowingClick = () => {
    navigate('/storitve');
  };

  const handleWorkshopClick = () => {
    navigate('/storitve');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Mobile Layout - Vertical Stack */}
      <div className="flex flex-col md:hidden min-h-screen pt-16 pb-24">
        {/* TOWING - Mobile */}
        <motion.div
          className="relative flex-1 min-h-[50vh] overflow-hidden cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onClick={handleTowingClick}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${towTruckImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50" />
          
          <div className="relative h-full flex flex-col justify-end p-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-3 bg-primary/20 border border-primary/30 rounded-full backdrop-blur-sm w-fit">
              <Truck className="w-3 h-3 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide">
                {t.hero.towing.badge}
              </span>
            </div>

            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-2 text-foreground leading-tight">
              {t.hero.towing.title}
            </h2>

            <p className="text-base text-muted-foreground mb-4 font-medium">
              {t.hero.towing.subtitle}
            </p>

            <Button
              size="default"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl w-full sm:w-auto"
              asChild
            >
              <a href={`tel:${t.common.phone.replace(/\s/g, '')}`}>
                <Phone className="mr-2 h-4 w-4" />
                {t.hero.towing.cta}
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Divider - Mobile */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* WORKSHOP - Mobile */}
        <motion.div
          className="relative flex-1 min-h-[50vh] overflow-hidden cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onClick={handleWorkshopClick}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${workshopImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50" />
          
          <div className="relative h-full flex flex-col justify-end p-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-3 bg-destructive/20 border border-destructive/30 rounded-full backdrop-blur-sm w-fit">
              <Wrench className="w-3 h-3 text-destructive" />
              <span className="text-xs font-semibold text-destructive tracking-wide">
                {t.hero.workshop.badge}
              </span>
            </div>

            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-2 text-foreground leading-tight">
              {t.hero.workshop.title}
            </h2>

            <p className="text-base text-muted-foreground mb-4 font-medium">
              {t.hero.workshop.subtitle}
            </p>

            <Button
              size="default"
              variant="destructive"
              className="font-bold rounded-xl w-full sm:w-auto"
              onClick={(e) => { e.stopPropagation(); handleWorkshopClick(); }}
            >
              <Wrench className="mr-2 h-4 w-4" />
              {t.hero.workshop.cta}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Desktop Layout - Horizontal Split */}
      <div className="hidden md:flex absolute inset-0">
        {/* TOWING SIDE - Left */}
        <motion.div
          className="relative overflow-hidden cursor-pointer"
          initial={{ width: '50%' }}
          animate={{
            width: hoveredSide === 'towing' ? '60%' : hoveredSide === 'workshop' ? '40%' : '50%',
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setHoveredSide('towing')}
          onMouseLeave={() => setHoveredSide(null)}
          onClick={handleTowingClick}
        >
          {/* Background Image */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${towTruckImage})` }}
            animate={{
              scale: hoveredSide === 'towing' ? 1.05 : 1,
            }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Dark Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"
            animate={{
              opacity: hoveredSide === 'towing' ? 0.7 : 0.85,
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Content */}
          <div className="relative h-full flex flex-col justify-center px-8 lg:px-16 xl:px-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/20 border border-primary/30 rounded-full backdrop-blur-sm"
                animate={{
                  scale: hoveredSide === 'towing' ? 1.05 : 1,
                }}
              >
                <Truck className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary tracking-wide">
                  {t.hero.towing.badge}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                className="font-heading font-bold text-4xl lg:text-5xl xl:text-6xl mb-4 text-foreground leading-tight"
                animate={{
                  x: hoveredSide === 'towing' ? 0 : hoveredSide === 'workshop' ? -20 : 0,
                }}
              >
                {t.hero.towing.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg lg:text-xl text-muted-foreground mb-6 font-medium"
                animate={{
                  x: hoveredSide === 'towing' ? 0 : hoveredSide === 'workshop' ? -20 : 0,
                }}
              >
                {t.hero.towing.subtitle}
              </motion.p>

              {/* Description */}
              <AnimatePresence>
                {hoveredSide === 'towing' && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-base text-muted-foreground mb-8 max-w-lg"
                  >
                    {t.hero.towing.description}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* CTA Button */}
              <motion.div
                animate={{
                  scale: hoveredSide === 'towing' ? 1.05 : 1,
                }}
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base lg:text-lg px-6 lg:px-8 py-5 lg:py-6 rounded-xl group"
                  asChild
                >
                  <a href={`tel:${t.common.phone.replace(/\s/g, '')}`}>
                    <Phone className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                    {t.hero.towing.cta}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </motion.div>

              {/* Phone Number */}
              <motion.p
                className="mt-6 text-sm text-muted-foreground"
                animate={{
                  opacity: hoveredSide === 'towing' ? 1 : 0.6,
                }}
              >
                {t.common.phone}
              </motion.p>
            </motion.div>
          </div>

          {/* Side Indicator */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary/20 backdrop-blur-sm px-3 py-8 rounded-l-lg border-l-4 border-primary"
            animate={{
              opacity: hoveredSide === 'workshop' ? 0.3 : 1,
              x: hoveredSide === 'towing' ? -10 : 0,
            }}
          >
            <Truck className="w-6 h-6 text-primary" />
          </motion.div>
        </motion.div>

        {/* WORKSHOP SIDE - Right */}
        <motion.div
          className="relative overflow-hidden cursor-pointer"
          initial={{ width: '50%' }}
          animate={{
            width: hoveredSide === 'workshop' ? '60%' : hoveredSide === 'towing' ? '40%' : '50%',
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setHoveredSide('workshop')}
          onMouseLeave={() => setHoveredSide(null)}
          onClick={handleWorkshopClick}
        >
          {/* Background Image */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${workshopImage})` }}
            animate={{
              scale: hoveredSide === 'workshop' ? 1.05 : 1,
            }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Dark Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-bl from-black/80 via-black/60 to-black/80"
            animate={{
              opacity: hoveredSide === 'workshop' ? 0.7 : 0.85,
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Content */}
          <div className="relative h-full flex flex-col justify-center px-8 lg:px-16 xl:px-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-destructive/20 border border-destructive/30 rounded-full backdrop-blur-sm"
                animate={{
                  scale: hoveredSide === 'workshop' ? 1.05 : 1,
                }}
              >
                <Wrench className="w-4 h-4 text-destructive" />
                <span className="text-sm font-semibold text-destructive tracking-wide">
                  {t.hero.workshop.badge}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                className="font-heading font-bold text-4xl lg:text-5xl xl:text-6xl mb-4 text-foreground leading-tight"
                animate={{
                  x: hoveredSide === 'workshop' ? 0 : hoveredSide === 'towing' ? 20 : 0,
                }}
              >
                {t.hero.workshop.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg lg:text-xl text-muted-foreground mb-6 font-medium"
                animate={{
                  x: hoveredSide === 'workshop' ? 0 : hoveredSide === 'towing' ? 20 : 0,
                }}
              >
                {t.hero.workshop.subtitle}
              </motion.p>

              {/* Description */}
              <AnimatePresence>
                {hoveredSide === 'workshop' && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-base text-muted-foreground mb-8 max-w-lg"
                  >
                    {t.hero.workshop.description}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* CTA Button */}
              <motion.div
                animate={{
                  scale: hoveredSide === 'workshop' ? 1.05 : 1,
                }}
              >
                <Button
                  size="lg"
                  variant="destructive"
                  className="font-bold text-base lg:text-lg px-6 lg:px-8 py-5 lg:py-6 rounded-xl group"
                  onClick={handleWorkshopClick}
                >
                  <Wrench className="mr-2 h-5 w-5" />
                  {t.hero.workshop.cta}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Side Indicator */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-destructive/20 backdrop-blur-sm px-3 py-8 rounded-r-lg border-r-4 border-destructive"
            animate={{
              opacity: hoveredSide === 'towing' ? 0.3 : 1,
              x: hoveredSide === 'workshop' ? 10 : 0,
            }}
          >
            <Wrench className="w-6 h-6 text-destructive" />
          </motion.div>
        </motion.div>
      </div>

      {/* Center Divider - Desktop Only */}
      <motion.div
        className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/50 to-transparent"
        style={{ x: '-50%' }}
        animate={{
          opacity: hoveredSide ? 0.3 : 1,
          scaleY: hoveredSide ? 0.5 : 1,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Scroll Indicator - Desktop Only */}
      <motion.div
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full p-1"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full mx-auto"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplitHeroSection;
