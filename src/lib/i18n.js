// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en  from './englishTranslation';
import  es  from './spanishTranslation';

const resources = {
  en: {
    translation: en
  },
  es: {
    translation: es
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: process.env.NODE_ENV !== 'production' ? process.env.REACT_APP_DEFAULT_LANGUAGE : 'es', // Set the initial language
  interpolation: {
    escapeValue: false // React already escapes values, so this is not needed
  }
});

export default i18n;
