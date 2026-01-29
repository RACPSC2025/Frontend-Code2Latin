import React, { createContext, useState, useContext } from 'react';
import i18n from '../lib/i18n';

import * as dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/en';

// Create a Language Context
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(i18n.language);
  dayjs.locale(i18n.language);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    dayjs.locale(lang);
    setLanguage(i18n.language);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the Language Context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
