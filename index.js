/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import Route from './navigation/Route';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import PushNotification from "react-native-push-notification";
import SocketConnection from './constants/SocketConnection';
import AsyncStorage from '@react-native-async-storage/async-storage';

SocketConnection.socket.on('connect', msg => {
      
  SocketConnection.socket.on('get notification', async message => {
    let user_id = await AsyncStorage.getItem('user_id');
    let office_code = await AsyncStorage.getItem('office_code');
    if (message.channel == office_code) {        

      // create channel for notification
      PushNotification.createChannel({
        channelId: message.channel,
        channelName: message.channel,
        soundName: 'default',     
        vibrate: true,
      });

      // create channel for notification
      PushNotification.localNotification({
        channelId: message.channel, // (required)
        channelName: message.channel,
        autoCancel: true,

        subText: 'Notification',
        title: 'Document Tracking System',
        message: message.message,
        vibrate: true,
        vibration: 300,
        playSound: true,
        soundName: 'default',
      });
    }
  });
});


AppRegistry.registerComponent(appName, () => {
          
 
    
    return Route});
