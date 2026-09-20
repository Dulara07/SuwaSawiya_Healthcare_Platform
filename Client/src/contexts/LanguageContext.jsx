import React, { useState, createContext, useContext } from 'react';
import { MOCK_TRANSLATIONS } from '../data/mockData';

export const LanguageContext = createContext(undefined);
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = window.localStorage.getItem('suwasawiya-language');
    return Object.prototype.hasOwnProperty.call(MOCK_TRANSLATIONS, savedLanguage) ? savedLanguage : 'en';
  });
  const changeLanguage = (lang) => {
    if (!Object.prototype.hasOwnProperty.call(MOCK_TRANSLATIONS, lang)) return;
    setLanguage(lang);
    window.localStorage.setItem('suwasawiya-language', lang);
  };
  return <LanguageContext.Provider value={{ language, changeLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  const { language, changeLanguage } = context;
  const t = (path) => {
    const parts = path.split('.');
    let cur = MOCK_TRANSLATIONS[language] || {};
    let fallback = MOCK_TRANSLATIONS.en || {};
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p];
      } else {
        cur = undefined;
        break;
      }
      if (fallback && Object.prototype.hasOwnProperty.call(fallback, p)) {
        fallback = fallback[p];
      } else {
        fallback = undefined;
      }
    }
    return typeof cur === 'string' ? cur : typeof fallback === 'string' ? fallback : path;
  };
  return { language, setLanguage: changeLanguage, t };
}
