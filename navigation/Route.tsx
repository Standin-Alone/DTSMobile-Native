import { createStackNavigator } from '@react-navigation/stack';
import  React,{Component} from 'react';
import {
  CardStyleInterpolators,
} from '@react-navigation/stack';


// 
import HomeScreen from '../components/HomeScreen';
import LoginScreen from '../components/LoginScreen';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}}   >
      <Stack.Screen name="Home" component={HomeScreen} />            
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />                  
    </Stack.Navigator>
  );
}



export default function Route() {


  return (
    <NavigationContainer>
    
    <MyStack />
    
  </NavigationContainer>
  )



  
};