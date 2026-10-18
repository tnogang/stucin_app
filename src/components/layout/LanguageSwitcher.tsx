import { Globe } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Language } from '@/i18n/translations';

const languages = [
  { code: 'sl' as Language, label: 'SLO', flag: '🇸🇮' },
  { code: 'it' as Language, label: 'ITA', flag: '🇮🇹' },
  { code: 'en' as Language, label: 'ENG', flag: '🇬🇧' },
];

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const isItalianPath =
    location.pathname === '/it' || location.pathname.startsWith('/it/');
  const slovenianPath = isItalianPath
    ? location.pathname.replace(/^\/it/, '') || '/'
    : location.pathname;

  const handleSelect = (code: Language) => {
    if (code === 'it') {
      // Italian lives on its own URLs for SEO (hreflang pairs)
      if (!isItalianPath) {
        navigate(`/it${location.pathname === '/' ? '' : location.pathname}`);
      }
      setLanguage('it');
      return;
    }
    // Leaving Italian: go back to the Slovenian URL equivalent
    if (isItalianPath) {
      navigate(slovenianPath);
    }
    setLanguage(code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="font-semibold">
            {languages.find(l => l.code === language)?.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={language === lang.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
