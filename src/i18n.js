// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)                // loads translation files from /public/locales
  .use(LanguageDetector)       // detects language (localStorage, navigator ...)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en','hi'],
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    react: { useSuspense: true }, // wrap app in Suspense
    interpolation: { escapeValue: false }
  });

export default i18n;
