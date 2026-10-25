import React, { createContext, useContext, useState, useEffect } from 'react';
import { sound } from '../lib/sound';

export type Language = 'es' | 'en';

interface LanguageContextType {
  lang: Language;
  isEn: boolean;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'es',
  isEn: false,
  setLang: () => {},
  toggleLang: () => {}
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('retro_os_lang');
        if (saved === 'en' || saved === 'es') {
          return saved;
        }
      } catch {}
    }
    return 'es';
  });

  const setLang = (next: Language) => {
    setLangState(next);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('retro_os_lang', next);
      } catch {}
    }
  };

  const toggleLang = () => {
    sound.playClick();
    setLang(lang === 'es' ? 'en' : 'es');
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.title =
        lang === 'en'
          ? 'Martín Alejandro Garbiso Ortíz | Retro OS Portfolio'
          : 'Martín Alejandro Garbiso Ortíz | Portfolio Retro OS';
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, isEn: lang === 'en', setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
