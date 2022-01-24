import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
    StyleSheet,    
  } from 'react-native';

import IncomingScreen from '../components/top_navigator/IncomingScreen';
import OutgoingScreen from '../components/top_navigator/OutgoingScreen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
const Tab = createMaterialTopTabNavigator();


export default function TopTabNavigator(props) {
  
  const  handleTabPress = ({navigation})=>{
    navigation.popToTop();
    navigation.navigate(navigation.state.routeName);
  }
  return (
    
    <Tab.Navigator screenOptions={{tabBarStyle:styles.screen }}  
    
  
    >
      
      <Tab.Screen name="Incoming" component={({navigation})=><IncomingScreen docType={props.docType.type_id} searchValue = {props.searchValue} navigation = {navigation}/>}
          
      
      options={{
          
          tabBarItemStyle:styles.tabBarCard,
          tabBarContentContainerStyle:styles.content,
          tabBarActiveTintColor:Colors.new_color_palette.brown,                   
          tabBarLabelStyle:styles.label, 
          tabBarIcon: ()=><Icon name="file-download" size={20} color={Colors.new_color_palette.orange}/>,
      }}
      
        listeners={({navigation,defaultHandler})=>({tabPress:e=>{

          e.preventDefault();                     
          navigation.navigate('Incoming');
        }})}
      />      

      <Tab.Screen name="Outgoing" 
          component={({navigation})=><OutgoingScreen docType={props.docType.type_id} searchValue = {props.searchValue}  navigation = {navigation}/>}
      
      
      options ={{
          tabBarItemStyle:styles.tabBarCard,
          tabBarContentContainerStyle:styles.content,
          tabBarActiveTintColor:Colors.new_color_palette.brown,
          tabBarLabelStyle:styles.label,
          tabBarIcon: ()=><Icon name="file-upload" size={20} color={Colors.new_color_palette.orange}/>
      }}
      
      />      
    </Tab.Navigator>
  );


}


const styles = StyleSheet.create({
tabBarCard:{
    borderRadius:20,
    fontWeight:'bold',    

    marginRight:20,
    left:(Layout.window.width / 100 ) * 2,
    backgroundColor:'#EEEEEE'
    
},
content:{
    backgroundColor:Colors.light,
    color:Colors.new_color_palette.orange,
    elevation:0,
    
},
label:{
    fontWeight:'bold',
},
screen:{
    elevation:0,    
    marginBottom:20
}

});
