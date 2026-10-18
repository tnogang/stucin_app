import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Truck, Wrench, Car, Droplets, Paintbrush, Warehouse, 
  Recycle, AlertTriangle, Trophy, CircleDot 
} from 'lucide-react';

const services = [
  {
    icon: Truck,
    title: 'Avtovleka 24/7',
    description: 'Hitra pomoč na cesti, vse dni v letu',
    path: '/storitve/avtovleka',
    accent: 'tow',
    featured: true,
  },
  {
    icon: Wrench,
    title: 'Servis vozil',
    description: 'Redno in izredno servisiranje',
    path: '/storitve/servis',
    accent: 'service',
    featured: true,
  },
  {
    icon: CircleDot,
    title: 'Vulkanizerstvo',
    description: 'Menjava in prodaja pnevmatik',
    path: '/storitve/vulkanizerstvo',
    accent: 'default',
  },
  {
    icon: Droplets,
    title: 'Pranje in poliranje',
    description: 'Strokovno čiščenje in nega vozil',
    path: '/storitve/avtopralnica',
    accent: 'default',
  },
  {
    icon: Paintbrush,
    title: 'Kleparstvo in ličarstvo',
    description: 'Popravilo karoserije in barvanje',
    path: '/storitve/kleparstvo-licarstvo',
    accent: 'default',
  },
  {
    icon: Car,
    title: 'Rent a car',
    description: 'Izposoja osebnih in tovornih vozil',
    path: '/storitve/najem-vozil',
    accent: 'default',
  },
  {
    icon: Warehouse,
    title: 'Hramba vozil',
    description: '2000 m² varovanega prostora',
    path: '/storitve/hramba',
    accent: 'default',
  },
  {
    icon: Recycle,
    title: 'Odvoz vozil',
    description: 'Odvoz odsluženih vozil',
    path: '/storitve/odvoz',
    accent: 'default',
  },
  {
    icon: AlertTriangle,
    title: 'Reševanje vozil',
    description: 'Zahtevnejše intervencije',
    path: '/storitve/resevanje',
    accent: 'default',
  },
  {
    icon: Trophy,
    title: 'Rally',
    description: 'Naša dirkaška zgodovina',
    path: '/storitve/rally',
    accent: 'default',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function ServicesGrid() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Naše storitve
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Celoten spekter storitev za vaše vozilo – od nujne pomoči do rednega vzdrževanja
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {services.map((service) => (
            <motion.div
              key={service.path}
              variants={itemVariants}
              className={service.featured ? 'sm:col-span-1 xl:col-span-1' : ''}
            >
              <Link
                to={service.path}
                className={`group block h-full p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                  service.accent === 'tow'
                    ? 'bg-gradient-to-br from-tow-dark to-tow-muted text-white hover:shadow-xl hover:shadow-tow-accent/20'
                    : service.accent === 'service'
                    ? 'bg-gradient-to-br from-primary to-primary/80 text-white hover:shadow-xl hover:shadow-primary/30'
                    : 'bg-card border border-border hover:border-primary/30 hover:shadow-lg'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                    service.accent === 'tow'
                      ? 'bg-tow-accent/20'
                      : service.accent === 'service'
                      ? 'bg-white/20'
                      : 'bg-primary/10'
                  }`}
                >
                  <service.icon
                    className={`w-6 h-6 ${
                      service.accent === 'tow'
                        ? 'text-tow-accent'
                        : service.accent === 'service'
                        ? 'text-white'
                        : 'text-primary'
                    }`}
                  />
                </div>
                <h3
                  className={`font-display font-bold text-lg mb-2 ${
                    service.accent === 'default' ? 'text-foreground' : ''
                  }`}
                >
                  {service.title}
                </h3>
                <p
                  className={`text-sm ${
                    service.accent === 'tow'
                      ? 'text-white/70'
                      : service.accent === 'service'
                      ? 'text-white/80'
                      : 'text-muted-foreground'
                  }`}
                >
                  {service.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
