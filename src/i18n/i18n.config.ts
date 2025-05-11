import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import * as enAuth from './translations/english/auth.json';
import * as enHome from './translations/english/home.json';
import * as enStart from './translations/english/start.json';
import * as teAuth from './translations/telugu/auth.json';
import * as teHome from './translations/telugu/home.json';
import * as teStart from './translations/telugu/start.json';


export const resources = {
  en: {
    start: enStart,
    auth: enAuth,
    home: enHome,
  },
  te: {
    start: teStart,
    auth: teAuth,
    home: teHome,
  },
};

const locales = RNLocalize.getLocales();
const languageTag = locales.find((locale) => Object.keys(resources).includes(locale.languageCode))?.languageCode || 'en';

i18next.use(initReactI18next).init({
  debug: true,
  lng: languageTag,
  fallbackLng: 'en',
  resources: resources,
  ns: ['start', 'auth', 'home'],
  interpolation: {
    escapeValue: false,
  },
});

export  {i18next};
