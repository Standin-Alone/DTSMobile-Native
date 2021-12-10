import React,{useEffect,useState} from 'react';
import { StyleSheet, TouchableOpacity,Image,View} from 'react-native';



import Images from '../constants/Images';
import Layout from '../constants/Layout';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from '../constants/Colors';
import { Alert } from 'react-native';

export default class SplashScreenContainer extends React.Component {

    constructor(props){
        super(props);


    }

componentDidMount(){
    let self  = this;
    setTimeout(()=>{
        
     NetInfo.fetch().then(async (response)=>{
          if(response.isConnected){
            
            let user_id = await AsyncStorage.getItem('user_id');

            if(user_id){
              self.props.navigation.replace('Root');
            }else{
                self.props.navigation.replace('Login');
            }
            
          }else{
            alert('No Internet Connection.Pleae check your internet connection.')
            
          }
      });
    },3000);

}
 

  render(){



  
  return (
    <View style={styles.container}>
        <Image source={Images.splash_screen_logo} style={styles.logo}  resizeMode={'contain'}/>
        
    </View>
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
});



