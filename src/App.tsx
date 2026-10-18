import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import CookieConsent from "@/components/CookieConsent";
import { useLanguage } from "@/i18n/LanguageContext";
import Index from "./pages/Index";
import Storitve from "./pages/Storitve";
import ONas from "./pages/ONas";
import Galerija from "./pages/Galerija";
import Lokacija from "./pages/Lokacija";
import Kontakt from "./pages/Kontakt";
import Zasebnost from "./pages/Zasebnost";
import NotFound from "./pages/NotFound";

// Code-split the internal rent module (Supabase, jsPDF, Tesseract) out of the
// public site's initial bundle.
const RentRouter = lazy(() => import("./pages/rent/RentRouter"));

const queryClient = new QueryClient();

// react-snap sets this user agent when pre-rendering routes at build time
const isPrerender =
  typeof navigator !== 'undefined' && navigator.userAgent.includes('ReactSnap');

// Keeps the language in sync with the URL: /it/* pages are always Italian,
// navigating away from /it falls back to Slovenian.
function LanguageSync() {
  const location = useLocation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const isItalianPath =
      location.pathname === '/it' || location.pathname.startsWith('/it/');
    if (isItalianPath && language !== 'it') {
      setLanguage('it');
    } else if (!isItalianPath && language === 'it') {
      setLanguage('sl');
    }
  }, [location.pathname, language, setLanguage]);

  return null;
}

function AppContent() {
  const [loading, setLoading] = useState(!isPrerender);
  const location = useLocation();
  const [navigating, setNavigating] = useState(false);

  // Initial load
  useEffect(() => {
    if (isPrerender) return;
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  // Page transitions (skip inside the rent module — the loader is annoying there)
  useEffect(() => {
    if (isPrerender) return;
    if (location.pathname.startsWith('/rent')) return;
    setNavigating(true);
    const timer = setTimeout(() => setNavigating(false), 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <LanguageSync />
      <AnimatePresence mode="wait">
        {(loading || navigating) && <LoadingScreen key="loader" />}
      </AnimatePresence>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/storitve" element={<Storitve />} />
        <Route path="/storitve/*" element={<Storitve />} />
        <Route path="/o-nas" element={<ONas />} />
        <Route path="/galerija" element={<Galerija />} />
        <Route path="/lokacija" element={<Lokacija />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/zasebnost" element={<Zasebnost />} />
        {/* Italian locale mirrors */}
        <Route path="/it" element={<Index />} />
        <Route path="/it/storitve" element={<Storitve />} />
        <Route path="/it/o-nas" element={<ONas />} />
        <Route path="/it/galerija" element={<Galerija />} />
        <Route path="/it/lokacija" element={<Lokacija />} />
        <Route path="/it/kontakt" element={<Kontakt />} />
        <Route path="/it/zasebnost" element={<Zasebnost />} />
        <Route path="/rent/*" element={
          <Suspense fallback={<LoadingScreen />}>
            <RentRouter />
          </Suspense>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieConsent />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
