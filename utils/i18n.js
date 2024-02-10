import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    'en-US': {
      translation: require('@/public/locales/en-US/common.json'),
    },
    'es-US': {
      translation: require('@/public/locales/es-US/common.json'),
    },
  },
  lng: 'en-US', // Set default language
  fallbackLng: 'en-US', // Fallback language
});

export default i18n;