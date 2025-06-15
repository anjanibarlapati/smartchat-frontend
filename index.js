import 'react-native-get-random-values';
/**
 * @format
 */
import './src/utils/fcmBackgroundHandler.ts';
import {AppRegistry} from 'react-native';
import App from './src/App/App.tsx';
import {name as appName} from './app.json';
import './src/i18n/i18n.config.ts';
AppRegistry.registerComponent(appName, () => App);
