import React,{Component} from 'react';
import { StyleSheet,Image,KeyboardAvoidingView,View,Text, Alert } from 'react-native';

import { Formik } from 'formik';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi  } from 'react-native-textinput-effects';
import Button from 'apsl-react-native-button';
import axios from 'axios';
import * as ipConfig from '../ipconfig';
import * as Yup from 'yup';
import NetInfo from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/FontAwesome';

import { useNavigation } from '@react-navigation/native'

// constants
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
 
export default class LoginScreen extends Component {
  constructor(props){
    super(props);
  
    
    this.state = {
        error:false,
        isLoading:false,
        validation : Yup.object({
          username: Yup.string().required("Please enter username").email("Username must be valid email."),
          password: Yup.string().required("Please enter password")
      
        })
    }
  } 


  // login function
   handleLogin = (values,navigation)=>{
  
    
    let data = {
        username:values.username,
        password:values.password
    }

    this.setState({isLoading:true,error:false});
    
    // axios post here

    NetInfo.fetch().then(async (response)=>{
      if(response.isConnected){
        
        axios.post(ipConfig.ipAddress+'MobileApp/Mobile/sign_in',data).then((response)=>{
          console.warn(response.data);                  
          if(response.data['Message'] == 'true'){
            
           
            this.setState({isLoading:false,error:false});
            this.props.navigation.replace('OTP',{user_id : response.data['user_id'], email : response.data['email']})
          }else{
        
            this.setState({isLoading:false,error:true})
            
          } 
        }).catch((err)=>{
          console.warn(err.response);
          this.setState({isLoading:false})
        });
    }else{
      alert('No internet connection');
    }
  });
      
  }



 
  render(){
    const navigation = this.props.navigation;
    return(


      <View style={styles.container}>
      <Image source={Images.splash_screen_logo} style={styles.logo} resizeMode={'contain'} />        
        <View style={styles.login_form}>
          <Formik
            initialValues = {{username:'',password:''}}
            validationSchema = {this.state.validation}
            onSubmit= {(values)=>this.handleLogin(values,navigation)} 
            // validateOnChange={false}           
          >
          {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) =>(
            <KeyboardAvoidingView style={styles.formBody}>
                 <Fumi
                    label={'Username'}
                    iconClass={FontAwesomeIcon}
                    iconName={'user'}
                    iconColor={Colors.new_color_palette.orange}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    style={styles.loginTextInput}
                    onChangeText={handleChange('username')}           
                    keyboardType="email-address"
                  />
                  {errors.username  && touched.username ?
                    <Text style={styles.warning}><Icon name="exclamation-triangle" size={20}/> {errors.username}</Text> : null
                  }

                  <Fumi                                            
                    label={'Password'}
                    iconClass={FontAwesomeIcon}
                    iconName={'key'}
                    iconColor={Colors.new_color_palette.orange}
                    iconSize= {20}
                    iconWidth={40}
                    inputPadding={16}
                    style={styles.loginTextInput}
                    secureTextEntry={true}
                    onChangeText={handleChange('password')}                                           
                  />
                   {errors.password && touched.password ?
                    <Text style={styles.warning}><Icon name="exclamation-triangle" size={20}/> {errors.password}</Text> :null
                  }


                  
                  {this.state.error && 
                    <Text style={styles.error}>Incorrect username or password  </Text>
                  }
                  <Button 
                    textStyle={styles.textButton} 
                    style={{borderColor:Colors.new_color_palette.orange,backgroundColor:Colors.new_color_palette.orange}} 
                    activityIndicatorColor={'white'} 
                    isLoading={this.state.isLoading}
                    disabledStyle={{opacity:1}}
                    onPress ={handleSubmit}
                  > 
                    Login
                  </Button>
            </KeyboardAvoidingView>  
            )}
            
          </Formik>


          {/* error alert */}



        </View>
  </View>
    )
  }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor:Colors.new_color_palette.second_background,
        minHeight: Math.round(Layout.window.height)
      },
      title: {
        marginVertical: (Layout.window.height / 100) * 20,
        fontSize: 24,
        fontWeight: 'bold',
      },
      login_form:{      
        marginVertical: (Layout.window.height / 100) * 1  },
      logo:{
          width:300,
          height:300,            
      },
      link: {
        marginTop: 15,
        paddingVertical: 15,
      },
      linkText: {
        fontSize: 14,
        color: '#2e78b7',
      },
      loginTextInput:{  
        color:Colors.color_palette.orange_smoke,
        width: (Layout.window.width / 100 ) * 90,
        borderRadius:5,
        alignSelf:'center', 
        marginBottom:20
           
      },
      formBody:{
        backgroundColor:Colors.new_color_palette.second_background
      },
      textButton:{
        fontSize: 18,
        color:'white',
        
        height:50,
        paddingTop:10,    
        width: (Layout.window.width / 100 ) * 90,
      },
      error:{ 
        color: Colors.light,
        backgroundColor:Colors.danger,
        borderRadius:5, 
        width: Layout.window.width - 40,
        padding:10,
        marginBottom:20
      },
      warning:{ 
        color: Colors.danger,
        borderRadius:5, 
        width: Layout.window.width - 40,
        marginBottom:20
      }

});