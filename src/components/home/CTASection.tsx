import { motion } from 'framer-motion';
import { Phone, MessageSquare, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="py-20 md:py-32 section-dark relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-tow-accent/20 via-transparent to-primary/10" />
      <div className="absolute inset-0 carbon-texture opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            Potrebujete pomoč na cesti?
          </h2>
          <p className="text-white/70 text-lg md:text-xl mb-10 leading-relaxed">
            Kličite nas kadarkoli – smo na voljo 24 ur na dan, vse dni v letu. 
            Ali pa nam pišite in vas bomo kontaktirali.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a href="tel:+38651200404">
              <Button size="lg" className="btn-emergency text-white rounded-full px-10 py-7 text-lg animate-pulse-glow">
                <Phone className="w-6 h-6 mr-3" />
                Pokliči +386 51 200 404
              </Button>
            </a>
            <Link to="/kontakt">
              <Button size="lg" variant="outline" className="rounded-full px-10 py-7 text-lg border-white/30 text-white hover:bg-white/10">
                <MessageSquare className="w-6 h-6 mr-3" />
                Pošlji povpraševanje
              </Button>
            </Link>
          </div>

          {/* Location Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10"
          >
            <MapPin className="w-5 h-5 text-tow-accent" />
            <span className="text-white/80">Goriška cesta 6f, 5271 Vipava</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
