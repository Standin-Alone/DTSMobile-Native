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



import BottomTabNavigator from './BottomTabNavigator';
import { Root, Popup } from 'react-native-popup-confirm-toast';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import io from "socket.io-client";
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Root>
      <Stack.Navigator initialRouteName="Authentication" screenOptions={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}}   >               
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />                  
        <Stack.Screen name="OTP" component={OTPScreen} options={{headerShown:false}} />                          
        <Stack.Screen name="Authentication" component={SplashScreen} options={{headerShown:false}} />                  
        <Stack.Screen name="Root" component={BottomTabNavigator} options={{headerShown:false}}  />       
        <Stack.Screen name="Receive" component={ReceiveScreen}  />                             
        <Stack.Screen name="Release" component={ReleaseScreen}  />
        <Stack.Screen name="History" component={HistoryScreen}  />
      </Stack.Navigator>
    </Root>
  );
}


export default function Route(){

    
 


  return (
    <NavigationContainer>
    
    <MyStack />
    
  </NavigationContainer>
  )



  
};