import { createStackNavigator } from '@react-navigation/stack';
import  React,{Component} from 'react';
import {
  CardStyleInterpolators,
} from '@react-navigation/stack';


// 

import LoginScreen from '../components/LoginScreen';
import OTPScreen from '../components/OTPScreen';
import Root from './BottomTabNavigator';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Root" screenOptions={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}}   >
               
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />                  
      <Stack.Screen name="OTP" component={OTPScreen} options={{headerShown:false}} />                  
      <Stack.Screen name="Root" component={Root} />                  
    </Stack.Navigator>
  );
}



export default function Route(){


  return (
    <NavigationContainer
    
   >
    
    <MyStack />
    
  </NavigationContainer>
  )



  
};