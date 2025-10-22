import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import ja from './locales/ja.json';
import bn from './locales/bn.json';

// Provide English, Japanese, and Bangla translations for navigation and page content
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    ja,
    bn,
  },
});

export default i18n;
