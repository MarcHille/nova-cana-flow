
import React, { createContext, useState, useEffect } from 'react';
import { Language, LanguageContextType } from './types';
import { translations } from './translations';

// Create context with default values
export const LanguageContext = createContext<LanguageContextType>({
  language: 'de',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('de');

  useEffect(() => {
    // Read saved language from localStorage if available
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'de' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage as Language);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
