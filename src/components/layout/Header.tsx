import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/i18n/LanguageContext';
import logoAsistenca from '@/assets/logo-asistenca.png';
import logoDelavnica from '@/assets/logo-delavnica.png';

interface HeaderProps {
  activeMode?: 'tow' | 'service';
}

export default function Header({ activeMode = 'tow' }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.services, path: '/storitve' },
    { name: t.nav.about, path: '/o-nas' },
    { name: t.nav.location, path: '/lokacija' },
    { name: t.nav.contact, path: '/kontakt' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const currentLogo = activeMode === 'service' ? logoDelavnica : logoAsistenca;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-card py-2 shadow-lg'
            : 'bg-transparent py-3 md:py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo with subtle glow - Fixed proportions */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMode}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-white/95 rounded-lg px-2.5 py-1 md:px-3 md:py-1.5 shadow-md"
                >
                  <img 
                    src={currentLogo} 
                    alt="Štucin" 
                    className="h-6 md:h-7 lg:h-8 w-auto object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons + Language */}
            <div className="flex items-center gap-2 md:gap-3">
              <LanguageSwitcher />
              
              <a
                href="tel:+38651200404"
                className="hidden md:flex items-center gap-2 text-sm font-semibold text-foreground"
              >
                <Phone className="w-4 h-4 text-primary" />
                <span className="hidden lg:inline">{t.common.phone}</span>
              </a>
              
              <a href="tel:+38651200404" className="hidden sm:block">
                <Button className="btn-emergency text-primary-foreground rounded-full px-4 md:px-5 py-2 text-xs md:text-sm">
                  <Phone className="w-4 h-4 mr-1 md:mr-2" />
                  <span className="hidden md:inline">{t.hero.towing.cta}</span>
                  <span className="md:hidden">24/7</span>
                </Button>
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  <Menu className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden glass-card border-t mt-2"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                        location.pathname === link.path
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Avtovleka: 24/7</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Goriška cesta 6f, Vipava</span>
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass-card border-t shadow-lg">
        <div className="container mx-auto px-4 py-2 md:py-3">
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <a
              href="tel:+38651200404"
              className="flex-1 btn-emergency text-primary-foreground rounded-xl py-2.5 md:py-3 flex items-center justify-center gap-2 font-semibold text-sm md:text-base"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
              {t.hero.towing.cta}
            </a>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Goriška+cesta+6f,+5271+Vipava,+Slovenia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-secondary text-secondary-foreground rounded-xl py-2.5 md:py-3 flex items-center justify-center gap-2 font-semibold text-sm md:text-base"
            >
              <MapPin className="w-4 h-4 md:w-5 md:h-5" />
              {t.nav.location}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
