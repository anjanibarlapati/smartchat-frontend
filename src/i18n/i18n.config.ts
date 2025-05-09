import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as enStart from './translations/english/start.json';
import * as enAuth from './translations/english/auth.json';
import * as teStart from './translations/telugu/start.json';
import * as teAuth from './translations/telugu/auth.json';

const resources = {
  en: {
    start: enStart,
    auth: enAuth,
  },
  te: {
    start: teStart,
    auth: teAuth,
  },
};

i18next.use(initReactI18next).init({
  debug: true,
  lng: 'en',
  fallbackLng: 'en',
  resources: resources,
  ns: ['start', 'auth'],
});

export default i18next;
