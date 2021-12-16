import React from 'react';
import {BottomFabBar} from 'rn-wave-bottom-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet,Pressable } from 'react-native';
import { Root, Popup } from 'react-native-popup-confirm-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome  from 'react-native-vector-icons/FontAwesome';




import HomeScreen from '../components/HomeScreen';
import QRCodeScreen from '../components/QRCodeScreen';
import ProfileScreen from '../components/ProfileScreen';


export default function BottomTabNavigator() {
    const Tabs = createBottomTabNavigator();
    return(
    <Tabs.Navigator
      // default configuration from React Navigation
      screenOptions={{
        tabBarActiveBackgroundColor: Colors.new_color_palette.orange,
        tabBarInactiveBackgroundColor: 'red',
        tabBarActiveTintColor: Colors.new_color_palette.yellow,
        tabBarInactiveTintColor: "#222222",          
      }}

      

      tabBar={(props) => (
        <BottomFabBar
          // Add Shadow for active tab bar button
          focusedButtonStyle={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.41,
            shadowRadius: 9.11,
            elevation: 14,
          }}
          // - You can add the style below to show content screen under the tab-bar
          // - It will makes the "transparent tab bar" effect.
          bottomBarContainerStyle={{            
            position: 'absolute',           
            bottom: 0,
            left: 0,
            right: 0,
          }}
          {...props}
        />
      )}


    >
  
  
    <Tabs.Screen  options={({ navigation })=>({
      title: 'My Documents',
      headerTransparent:true,
      headerTitleStyle:styles.bottomTitle,
      headerTintColor:Colors.new_color_palette.orange,
      tabBarIcon: ()=> <Icon name="home" size={40} color={'white'}/>,
      headerRight: () => (            
        <Pressable
          onPress={  () => {                    
                Popup.show({
                  type: 'confirm',
                  title: 'Warning',
                  textBody: 'Do you want to sign out?',
                  
                  buttonText: 'Sign Out',
                  confirmText:'Cancel',                                 
                  callback: () => {
                    Popup.hide()
                    AsyncStorage.clear();
                    navigation.replace('Authentication');
                    
                  },
                  okButtonStyle:styles.confirmButton,
                  okButtonTextStyle: styles.confirmButtonText
                
                })
          }}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}>
          <FontAwesome
            name="sign-out"
            size={25}
            color={Colors.color_palette.orange}
            style={{ marginRight: 15 }}
          />
        </Pressable>
      )
    })}  
     name="Home" component={HomeScreen}/>


  <Tabs.Screen  options={({navigation})=>({
      tabBarIcon: ()=> <Icon name="qrcode" size={40}  color={'white'}/>,
      headerTitle:'Scan Route Slip QR Code',
      headerTransparent:true,
      headerTitleStyle:styles.bottomTitle,
      headerTintColor:Colors.new_color_palette.orange,
      headerRight: () => (            
        <Pressable
          onPress={  () => {                    
                Popup.show({
                  type: 'confirm',
                  title: 'Warning',
                  textBody: 'Do you want to sign out?',
                  
                  buttonText: 'Sign Out',
                  confirmText:'Cancel',                                 
                  callback: () => {
                    Popup.hide()
                    AsyncStorage.clear();
                    navigation.replace('Authentication');
                    
                  },
                  okButtonStyle:styles.confirmButton,
                  okButtonTextStyle: styles.confirmButtonText
                
                })
          }}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}>
          <FontAwesome
            name="sign-out"
            size={25}
            color={Colors.color_palette.orange}
            style={{ marginRight: 15 }}
          />
        </Pressable>
      )
    })}  
    
     name="qrcode" component={QRCodeScreen} />


  <Tabs.Screen  options={({ navigation })=>({
      title: 'Profile',
      headerTransparent:true,
      headerTitleStyle:styles.bottomTitle,
      headerRight: () => (            
        <Pressable
          onPress={  () => {                    
                Popup.show({
                  type: 'confirm',
                  title: 'Warning',
                  textBody: 'Do you want to sign out?',
                  
                  buttonText: 'Sign Out',
                  confirmText:'Cancel',                                 
                  callback: () => {
                    Popup.hide()
                    AsyncStorage.clear();
                    navigation.replace('Authentication');
                    
                  },
                  okButtonStyle:styles.confirmButton,
                  okButtonTextStyle: styles.confirmButtonText
                
                })
          }}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}>
          <FontAwesome
            name="sign-out"
            size={25}
            color={Colors.color_palette.orange}
            style={{ marginRight: 15 }}
          />
        </Pressable>
      ),
      tabBarIcon: ()=> <Icon name="user" size={40}  color={'white'}/>,
    })}  
     name="profile" component={ProfileScreen}/>
      
      
  
 

    </Tabs.Navigator>
  )
    }



    const styles = StyleSheet.create({
      confirmButton:{
        backgroundColor:'white',
        color:Colors.new_color_palette.orange,
        borderColor:Colors.new_color_palette.orange,
        borderWidth:1
      },
      confirmButtonText:{  
        color:Colors.new_color_palette.orange,    
      },
      bottomTitle:{
        color:Colors.new_color_palette.orange,
        fontSize:20,
      }
      
      });