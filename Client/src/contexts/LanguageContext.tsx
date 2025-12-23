import React, { useState, createContext, useContext } from 'react';
import { Language } from '../types';
import { MOCK_TRANSLATIONS } from '../data/mockData';
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export function LanguageProvider({
  children
}: {
  children: ReactNode;
}) {
  const [language, setLanguage] = useState<Language>('en');
  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = MOCK_TRANSLATIONS[language];
    for (const key of keys) {
      if (current[key] === undefined) {
        // Fallback to English if translation missing
        let fallback: any = MOCK_TRANSLATIONS['en'];
        for (const k of keys) fallback = fallback?.[k];
        return fallback || path;
      }
      current = current[key];
    }
    return typeof current === 'string' ? current : path;
  };
  return <LanguageContext.Provider value={{
    language,
    setLanguage,
    t
  }}>
      {children}
    </LanguageContext.Provider>;
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}