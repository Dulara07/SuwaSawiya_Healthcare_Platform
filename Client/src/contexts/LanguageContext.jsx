import React, { useState, createContext, useContext } from 'react';
import { MOCK_TRANSLATIONS } from '../data/mockData';

export const LanguageContext = createContext(undefined);
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const changeLanguage = (lang) => setLanguage(lang);
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
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p];
      } else {
        return path;
      }
    }
    return typeof cur === 'string' ? cur : path;
  };
  return { language, setLanguage: changeLanguage, t };
}
