import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    text: 'Izjemno hiter odziv! Ko mi je na avtocesti odpovedal avto, so bili pri meni v manj kot 30 minutah. Profesionalna ekipa, priporočam vsem.',
    author: 'Marko P.',
    location: 'Ajdovščina',
    rating: 5,
  },
  {
    id: 2,
    text: 'Že več let zaupam servisu Štucin. Vedno korektni, pošteni in znajo svetovati. Cene so poštene, delo pa kvalitetno opravljeno.',
    author: 'Ana K.',
    location: 'Nova Gorica',
    rating: 5,
  },
  {
    id: 3,
    text: 'Sredi noči sem ostal brez goriva. En klic in v pol ure so bili pri meni s kanistrom. Res človeški pristop, hvala!',
    author: 'Luka M.',
    location: 'Vipava',
    rating: 5,
  },
  {
    id: 4,
    text: 'Vulkanizerstvo hitro in korektno. Naročil sem nove zimske pnevmatike, montaža je bila opravljena v manj kot eni uri.',
    author: 'Jože T.',
    location: 'Postojna',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Stranke o nas
          </h2>
          <p className="text-muted-foreground text-lg">
            Zaupanje, ki smo si ga pridobili z leti
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Testimonial Card */}
          <div className="relative bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden">
            {/* Quote Icon */}
            <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/10" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                    <span key={i} className="text-tow-accent text-xl">★</span>
                  ))}
                </div>
                
                {/* Text */}
                <blockquote className="text-xl md:text-2xl text-foreground font-medium leading-relaxed mb-8">
                  "{testimonials[currentIndex].text}"
                </blockquote>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-display font-bold text-primary text-lg">
                      {testimonials[currentIndex].author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonials[currentIndex].author}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[currentIndex].location}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-3 rounded-full bg-muted hover:bg-primary/10 transition-colors"
              aria-label="Prejšnje mnenje"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-6 bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  aria-label={`Pojdi na mnenje ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={next}
              className="p-3 rounded-full bg-muted hover:bg-primary/10 transition-colors"
              aria-label="Naslednje mnenje"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
