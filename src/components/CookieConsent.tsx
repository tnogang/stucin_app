import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Never show the banner to the prerender bot
    if (navigator.userAgent.includes('ReactSnap')) return;
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-16 lg:bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[60] glass-card rounded-2xl p-5 shadow-2xl border border-border"
        >
          <button onClick={decline} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cookie className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-foreground text-sm mb-1">
                {t.cookies?.title || 'Piškotki'}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                {t.cookies?.description || 'Ta spletna stran uporablja piškotke za boljšo uporabniško izkušnjo.'}{' '}
                <Link to="/zasebnost" className="text-primary hover:underline">
                  {t.cookies?.learnMore || 'Več o piškotkih'}
                </Link>
              </p>
              <div className="flex gap-2">
                <Button onClick={accept} size="sm" className="btn-emergency text-primary-foreground rounded-full text-xs px-4">
                  {t.cookies?.accept || 'Sprejmi'}
                </Button>
                <Button onClick={decline} variant="outline" size="sm" className="rounded-full text-xs px-4">
                  {t.cookies?.decline || 'Zavrni'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
