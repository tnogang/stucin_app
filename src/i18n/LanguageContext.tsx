import { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.sl;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Italian content lives under /it — derive the initial language from the URL
  // so crawlers and first paint get the right locale immediately.
  const [language, setLanguage] = useState<Language>(() => {
    if (
      typeof window !== 'undefined' &&
      (window.location.pathname === '/it' || window.location.pathname.startsWith('/it/'))
    ) {
      return 'it';
    }
    return 'sl';
  });

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
