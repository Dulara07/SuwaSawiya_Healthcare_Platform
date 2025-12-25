import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';
export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  return <div className="relative group">
      <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 focus:outline-none" aria-label="Change Language">
        <Globe className="h-5 w-5" />
        <span className="text-sm font-medium uppercase">{language}</span>
      </button>
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
        <div className="py-1">
          <button onClick={() => setLanguage('en')} className={`block w-full text-left px-4 py-2 text-sm ${language === 'en' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>English</button>
          <button onClick={() => setLanguage('si')} className={`block w-full text-left px-4 py-2 text-sm ${language === 'si' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>සිංහල</button>
          <button onClick={() => setLanguage('ta')} className={`block w-full text-left px-4 py-2 text-sm ${language === 'ta' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>தமிழ்</button>
        </div>
      </div>
    </div>;
}
