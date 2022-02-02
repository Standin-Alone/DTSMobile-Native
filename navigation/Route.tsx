import { createStackNavigator } from '@react-navigation/stack';
import {  useColorScheme } from 'react-native'
import  React,{Component} from 'react';
import {
  CardStyleInterpolators,
} from '@react-navigation/stack';
import PushNotification from "react-native-push-notification";

// 

import LoginScreen from '../components/LoginScreen';
import OTPScreen from '../components/OTPScreen';
import SplashScreen from '../components/SplashScreen';

// transaction screens
import ReceiveScreen from '../components/ReceiveScreen';
import ReleaseScreen from '../components/ReleaseScreen';
import HistoryScreen from '../components/HistoryScreen';

//  New Release Screen
import DocInfoScreen from '../components/transactions/DocInfoScreen';
import AttachmentScreen from '../components/transactions/AttachmentScreen';
import ReviewReleaseScreen from '../components/transactions/ReviewReleaseScreen';
import RecipientsScreen from '../components/transactions/RecipientsScreen';



import BottomTabNavigator from './BottomTabNavigator';
import TopTabNavigator from './TopTabNavigator';
import { Root, Popup } from 'react-native-popup-confirm-toast';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import io from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SocketConnection from '../constants/SocketConnection';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';




const Stack = createStackNavigator();

function MyStack() {

  const navigation = useNavigation();
  
PushNotification.configure({
  onNotification: function(notification) {
      const { data } = notification;
 

      navigation.navigate('History',{document_info:[{document_number :data.document_number}]})
      
    

  }
});



SocketConnection.socket.on('connect', msg => {  
      
  SocketConnection.socket.on('get notification', async message => {
    let user_id = await AsyncStorage.getItem('user_id');
    let office_code = await AsyncStorage.getItem('office_code');
    if (message.channel.includes(office_code) ) {        


      message.channel.map(channel_item=>{

           // create channel for notification
      PushNotification.createChannel({
        channelId: channel_item,
        channelName: channel_item,
        soundName: 'default',     
        vibrate: true,
      });

      // create channel for notification
      PushNotification.localNotification({
        channelId: channel_item, // (required)
        channelName: channel_item,
        autoCancel: true,
        userInfo: {document_number:message.document_number},
        subText: 'Notification',
        title: 'Document Tracking System',
        message: message.message,
        vibrate: true,
        vibration: 300,
        playSound: true,
        soundName: 'default',
      });


      })
   
    }
  });
});

  return (
    <Root>
      <Stack.Navigator initialRouteName="Authentication" screenOptions={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}}   >               
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />                  
        <Stack.Screen name="OTP" component={OTPScreen} options={{headerShown:false}} />                          
        <Stack.Screen name="Authentication" component={SplashScreen} options={{headerShown:false}} />                  
        <Stack.Screen name="Root" component={BottomTabNavigator} options={{headerShown:false,headerTransparent:true}}  />       
        <Stack.Screen name="Receive" component={ReceiveScreen}  />                             
        <Stack.Screen name="Release" component={ReleaseScreen}  />


        {/* transactions */}
        <Stack.Screen name="DocInfo" component={DocInfoScreen}  />
        <Stack.Screen name="Attachment" component={AttachmentScreen}  />
        <Stack.Screen name="ReviewRelease" component={ReviewReleaseScreen}  />
        <Stack.Screen name="Recipients" component={RecipientsScreen}  />

        
        <Stack.Screen name="History" component={HistoryScreen}  />
      </Stack.Navigator>
    </Root>
  );
}


export default function Route(){




  
  // SocketConnection.socket.on("disconnect", (reason) => {
  //   console.warn(JSON.stringify(reason.message));
  // });

  // SocketConnection.socket.on('connect_failed', function(err) {
  //   console.warn(JSON.stringify(err.message));
  // });

  return (
    <NavigationContainer>
    
    <MyStack />
    
  </NavigationContainer>
  )



  
};