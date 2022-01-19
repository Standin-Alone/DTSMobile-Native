/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import Route from './navigation/Route';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';




AppRegistry.registerComponent(appName, () => Route);
