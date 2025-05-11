/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App/App.tsx';
import {name as appName} from './app.json';
import './src/i18n/i18n.config.ts';
AppRegistry.registerComponent(appName, () => App);
