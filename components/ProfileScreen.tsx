import  React,{Component} from 'react';
import {    
    StyleSheet,
    Text,    
    View,
    Image
  } from 'react-native';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class ProfileScreen extends Component{
    constructor(props) {
        super(props);

        this.state = {
            name:null,
            email:null,
            mobile:null,
            office:null,  
        };


    
    }

    handleSession = async () =>{
       this.setState({ 
           name: await AsyncStorage.getItem('full_name'),
           email: await AsyncStorage.getItem('email'),
           mobile: await AsyncStorage.getItem('mobile'),
           office: await AsyncStorage.getItem('division'),        
        });
  
    }

    componentDidMount(){

       this.handleSession();
    }


    render(){
        return (
            <View style={styles.container}>

            <View style={styles.innerContainer}>
              <View>
                    <Text style={styles.detailTitle}>Profile Info</Text>
              </View>
      
              <View style={styles.profileCard}>
                    <Image source={Images.user_icon} style={styles.user_icon}/>
                    <Text style={styles.user_name} numberOfLines={50}>{this.state.name}</Text>
                    <Text style={styles.role} numberOfLines={50}>{this.state.office}</Text>
              </View>
      
              <View>
                    <Text style={styles.detailTitle}>Account Info</Text>
              </View>
      
              <View style={styles.accountCard}>
                  <View style={styles.emailCard}>
                    <Text style={styles.emailTitle}>EMAIL</Text>
                    <Text style={styles.email}>{this.state.email}</Text>
                    {/* <Icon name="arrow-right" size={30}  style={styles.arrow} color={Colors.color_palette.orange} onPress={()=>{}}/> */}
                  </View>
                  <View style={styles.emailCard}>
                    <Text style={styles.emailTitle}>Contact Number</Text>
                    <Text style={styles.email}>{this.state.mobile}</Text>
                    {/* <Icon name="arrow-right" size={30}  style={styles.arrow} color={Colors.color_palette.orange} onPress={()=>{}}/> */}
                  </View>
              </View>
            </View>
           
          </View>

        )
    }


}



const styles = StyleSheet.create({
    container: {
      flex: 1,
          
      backgroundColor:Colors.new_color_palette.blue_background,
      
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
    detailTitle:{
      paddingBottom:50,
      fontSize:18,
      fontWeight:'900',
      color:Colors.color_palette.orange,
    },
    profileCard:{
      backgroundColor:Colors.new_color_palette.main_background,        
      width:(Layout.window.width / 100) * 90,
      height:(Layout.window.height / 100) * 10,
      borderRadius:15,
      marginBottom:30
    },
    user_icon:{
      alignSelf:'flex-start',
      padding:30,
      paddingRight:50,
      top:5,
      width:(Layout.window.width / 100) * 5,
      height:(Layout.window.height / 100) * 5,
    },
    user_name:{
      bottom:50,
      left:80,
      fontSize:18,
      fontWeight:'bold',
      color:Colors.color_palette.orange,
  
    },
    role:{
      bottom:50,
      left:80,
      fontSize:15,
      fontWeight:'100',
      color:Colors.new_color_palette.text ,
  
    },
    innerContainer:{
      top:100,
      left:20,
    },
  
  
  
    // account card css
    accountCard:{    
      backgroundColor:Colors.new_color_palette.main_background,        
      width:(Layout.window.width / 100) * 90,
      height:(Layout.window.height / 100) * 20,
      borderRadius:15,
    },
    arrow:{
      bottom:30,
      left:(Layout.window.height / 100) * 35,
    },
    emailCard:{
      backgroundColor:Colors.new_color_palette.main_background,        
      width:(Layout.window.width / 100) * 82,
      height:(Layout.window.height / 100) * 10,
      left:20
    },
    emailTitle:{
      justifyContent:'flex-start',
      color:Colors.new_color_palette.text,
      fontSize:15,
      padding:10
    },
    email:{
      top:2,
      left:10,
      color:Colors.color_palette.orange,
    }
  });
  