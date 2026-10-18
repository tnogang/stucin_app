import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SeoHreflang from '@/components/SeoHreflang';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const categories = [
  'Vse',
  'Avtopralnica',
  'Poslovni prostori',
  'Kleparstvo in ličarstvo',
  'Najem vozil',
  'Rally',
  'Servis vozil',
  'Vulkanizerstvo',
  'Zgodovina',
  'Drugi prevozi',
];

// Placeholder images - in production these would be real images
const galleryItems = [
  { id: 1, category: 'Servis vozil', title: 'Servis vozila', placeholder: true },
  { id: 2, category: 'Avtopralnica', title: 'Pranje vozila', placeholder: true },
  { id: 3, category: 'Rally', title: 'Rally sezona 2010', placeholder: true },
  { id: 4, category: 'Kleparstvo in ličarstvo', title: 'Kleparska dela', placeholder: true },
  { id: 5, category: 'Poslovni prostori', title: 'Novi poslovni prostori', placeholder: true },
  { id: 6, category: 'Najem vozil', title: 'Vozni park', placeholder: true },
  { id: 7, category: 'Vulkanizerstvo', title: 'Menjava pnevmatik', placeholder: true },
  { id: 8, category: 'Zgodovina', title: 'Začetki podjetja', placeholder: true },
  { id: 9, category: 'Drugi prevozi', title: 'Prevoz vozil', placeholder: true },
  { id: 10, category: 'Rally', title: 'Rally sezona 2009', placeholder: true },
  { id: 11, category: 'Servis vozil', title: 'Diagnostika', placeholder: true },
  { id: 12, category: 'Avtopralnica', title: 'Poliranje', placeholder: true },
];

export default function Galerija() {
  const [activeCategory, setActiveCategory] = useState('Vse');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = activeCategory === 'Vse' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const goToPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };
  
  const goToNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  return (
    <>
      <Helmet>
        <title>Galerija | Avtovleka Štucin</title>
        <meta name="description" content="Galerija fotografij Avtovleka Štucin. Oglejte si naše delo, vozila, poslovne prostore in zgodovino podjetja." />
      </Helmet>
      <SeoHreflang path="/galerija" />

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
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Galerija
              </h1>
              <p className="text-white/70 text-lg md:text-xl">
                Oglejte si naše delo in zgodovino podjetja
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter */}
        <section className="py-8 border-b border-border sticky top-16 bg-background/95 backdrop-blur-sm z-30">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => openLightbox(index)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-muted"
                  >
                    {/* Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <div className="text-center p-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">📷</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium">Odpri</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredItems.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">V tej kategoriji ni fotografij.</p>
              </div>
            )}
          </div>
        </section>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white"
              >
                <X className="w-8 h-8" />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-4 p-2 text-white/70 hover:text-white"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 p-2 text-white/70 hover:text-white"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              <div 
                className="max-w-4xl w-full aspect-video bg-muted rounded-xl flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <p className="text-white font-display font-bold text-2xl mb-2">
                    {filteredItems[lightboxIndex].title}
                  </p>
                  <p className="text-white/60">
                    {filteredItems[lightboxIndex].category}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </>
  );
}
