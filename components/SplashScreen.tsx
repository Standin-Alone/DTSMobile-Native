import React,{useEffect,useState} from 'react';
import { StyleSheet, TouchableOpacity,Image,View,BackHandler} from 'react-native';



import Images from '../constants/Images';
import Layout from '../constants/Layout';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from '../constants/Colors';
import * as Animatable from 'react-native-animatable';

import axios from 'axios';
import * as ipConfig from '../ipconfig';
import DeviceInfo from 'react-native-device-info';
import {Popup} from 'react-native-popup-confirm-toast';
export default class SplashScreenContainer extends React.Component {

    constructor(props){
        super(props);


    }

// componentDidMount(){
//     let self  = this;
//     setTimeout(()=>{
        
//      NetInfo.fetch().then(async (response)=>{
//           if(response.isConnected){
            
//             let user_id = await AsyncStorage.getItem('user_id');

//             if(user_id){
//               self.props.navigation.replace('Root');
//             }else{
//                 self.props.navigation.replace('Login');
//             }
            
//           }else{
//             alert('No Internet Connection.Pleae check your internet connection.')
            
//           }
//       });
//     },3000);

// }



componentDidMount() {
  let self = this;
  setTimeout(() => {
    NetInfo.fetch().then(async response => {
      if (response.isConnected) {
        let user_id = await AsyncStorage.getItem('user_id');

        axios
          .get(
            ipConfig.ipAddress + 'MobileApp/Mobile/check_utility/' + DeviceInfo.getVersion(),
          )
          .then(async response => {
         
            
            // ENABLE THIS BEFORE GENERATING APK
            // check if the mobile application is on maintenance
            if (response.data['maintenance'] == '1') {
              Popup.show({
                type: 'danger',
                title: 'Error!',
                textBody:
                  'Sorry for the inconvenience. The mobile application is on maintenance. Please try again later.',
                buttonText: 'Ok',
                okButtonStyle: styles.confirmButton,
                okButtonTextStyle: styles.confirmButtonText,
                callback: () => {
                  BackHandler.exitApp();
                  Popup.hide();
                },
              });
            }
            // check if the mobile app has new version
            else if (response.data['active'] == '0') {
              Popup.show({
                type: 'danger',
                title: 'Message.',
                textBody:
                  'The mobile application has new update. please download the new mobile application in DTS website.',
                buttonText: 'Ok',
                okButtonStyle: styles.confirmButton,
                okButtonTextStyle: styles.confirmButtonText,
                callback: () => {
                  BackHandler.exitApp();
                  Popup.hide();
                },
              });
            } else {
              
              if(user_id){
                self.props.navigation.replace('Root');
              }else{
                  self.props.navigation.replace('Login');
              }
            }
          })
          .catch(err => console.warn(err.response));
      } else {        

        Popup.show({
          type: 'danger',
          title: 'Message.',
          textBody:
            'No internet connection. Please check your network.',
          buttonText: 'Ok',
          okButtonStyle: styles.confirmButton,
          okButtonTextStyle: styles.confirmButtonText,
          callback: () => {
            BackHandler.exitApp();
            Popup.hide();
          },
        });
      }
    });
  }, 3000);
}
 

  render(){



  
  return (
    <Animatable.View style={styles.container} animation= 'fadeInDownBig' duration={1000}>
        <Image source={Images.splash_screen_logo} style={styles.logo}  resizeMode={'contain'}/>        
    </Animatable.View>
  );

}

    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor:Colors.new_color_palette.second_background
  },
  title: {
    marginVertical: (Layout.window.height / 100) * -20,
    fontSize: 25,    
    color:'black',
    fontWeight: 'bold',
    textAlign:'center'
  },
  logo:{
      width:(Layout.window.width / 100) *  80,
      height:(Layout.window.height / 100) * 80,
      bottom:0,
      top:0,
        },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  confirmButton:{
    backgroundColor:'white',
    color:Colors.new_color_palette.orange,
    borderColor:Colors.new_color_palette.orange,
    borderWidth:1
  },
  confirmButtonText:{  
    color:Colors.new_color_palette.orange,    
  },
});



