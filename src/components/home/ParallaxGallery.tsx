import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import towTruckFleet from '@/assets/tow-trucks-fleet.webp';
import workshopMechanics from '@/assets/workshop-mechanics.webp';
import towTruckAction from '@/assets/tow-truck-action.webp';
import workshopEquipment from '@/assets/workshop-equipment.webp';
import mechanicWork from '@/assets/mechanic-work.webp';
import tireEquipment from '@/assets/tire-equipment.webp';

const images = [
  { src: towTruckFleet, alt: 'Vozni park avtovleke Štucin Vipava' },
  { src: workshopMechanics, alt: 'Mehaniki delavnice Štucin pri delu' },
  { src: towTruckAction, alt: 'Avtovleka Štucin v akciji' },
  { src: workshopEquipment, alt: 'Oprema avtoservisa Štucin' },
  { src: mechanicWork, alt: 'Servis vozila pri Štucin' },
  { src: tireEquipment, alt: 'Vulkanizerska oprema Štucin' },
];

export default function ParallaxGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Create different parallax speeds for each row
  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <section ref={containerRef} className="py-8 md:py-12 lg:py-16 overflow-hidden bg-muted/20">
      {/* Row 1 - moves left */}
      <motion.div 
        style={{ x: x1 }}
        className="flex gap-3 md:gap-4 lg:gap-6 mb-3 md:mb-4 lg:mb-6"
      >
        {[...images.slice(0, 3), ...images.slice(0, 3)].map((image, index) => (
          <div 
            key={index}
            className="relative flex-shrink-0 w-48 h-32 sm:w-64 sm:h-44 md:w-80 md:h-52 lg:w-96 lg:h-64 rounded-xl md:rounded-2xl overflow-hidden"
          >
            <img 
              src={image.src} 
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ))}
      </motion.div>

      {/* Row 2 - moves right */}
      <motion.div 
        style={{ x: x2 }}
        className="flex gap-3 md:gap-4 lg:gap-6"
      >
        {[...images.slice(3), ...images.slice(3)].map((image, index) => (
          <div 
            key={index}
            className="relative flex-shrink-0 w-48 h-32 sm:w-64 sm:h-44 md:w-80 md:h-52 lg:w-96 lg:h-64 rounded-xl md:rounded-2xl overflow-hidden"
          >
            <img 
              src={image.src} 
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
