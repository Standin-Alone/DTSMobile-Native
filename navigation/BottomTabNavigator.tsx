import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomFabBar } from 'rn-wave-bottom-bar';
import HomeScreen from '../components/HomeScreen';


export default function Root() {
    const Tabs = createBottomTabNavigator();
    return(
    <Tabs.Navigator
      // default configuration from React Navigation
      screenOptions={{
        tabBarActiveTintColor: "#2F7C6E",
        tabBarInactiveTintColor: "#222222"
      }}
    >
  
  
      <Tabs.Screen name="Home" component={HomeScreen} />
      
  
 

    </Tabs.Navigator>
  )
    }
