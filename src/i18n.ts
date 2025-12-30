import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en.json';
import de from './translations/de.json';
import it from './translations/it.json';
import sp from './translations/sp.json';

const resources = {
  EN: {
    translation: en,
  },
  DE: {
    translation: de,
  },
  IT: {
    translation: it,
  },
  SP: {
    translation: sp,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    // Set initial language from storage or default
    lng: localStorage.getItem('app_lang') || 'EN',
    fallbackLng: 'EN',
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
  });

export default i18n;