import  React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
  } from 'react-native';
import Colors from '../constants/Colors';
import BarcodeMask from 'react-native-barcode-mask';
import NetInfo from "@react-native-community/netinfo";
import axios from 'axios';
import * as ipConfig from '../ipconfig';
import {  Popup} from 'react-native-popup-confirm-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RNCamera } from 'react-native-camera';
import { Alert } from 'react-native';

export default class QRCodeScreen extends Component{
    constructor(props) {        
        super(props);

        this.state = {
            scanned:false,
            isLoading:false,
            hasPermission:false,
            isBarcodeRead: true
        }        
       
    }
    

    navigateToReceiveScreen = (data)=>{
      this.props.navigation.replace('Receive',{document_info:data})
    }

    navigateToReleaseScreen = (data)=>{
      this.props.navigation.replace('Release',{document_info:data})
    }

    handleBarCodeRead = async (scanResult)=>{

      let payload = {
        document_number : scanResult.data,
        office_code : await AsyncStorage.getItem('office_code'),              
        full_name : await AsyncStorage.getItem('full_name'),
        user_id : await AsyncStorage.getItem('user_id'),        
      } 
      console.warn(payload);

      if(this.state.isBarcodeRead){
      NetInfo.fetch().then( (response)=>{
        if(response.isConnected){
          axios.post(ipConfig.ipAddress+'MobileApp/Mobile/get_scanned_document',payload).then((response)=>{
            this.setState({isBarcodeRead:false});
            if(response.data['Message'] == 'true'){

     
              
              Popup.show({
                type: 'success',              
                title: 'Success!',
                textBody: 'Sucessfully scanned the QR code.',                
                buttonText:'Ok',
                okButtonStyle:styles.confirmButton,
                okButtonTextStyle: styles.confirmButtonText,
                callback: () => {         
                  this.setState({isBarcodeRead:true});                       
                  Popup.hide()
                  if(response.data['type'] == 'receive'){
                      this.navigateToReceiveScreen(response.data['doc_info'])
                  }else if(response.data['type'] == 'release'){
                      this.navigateToReleaseScreen(response.data['doc_info'])
                  }
                  
                  
                },              
              })
  
            }else if(response.data['Message'] == 'Not Authorize'){
              
              Popup.show({
                type: 'danger',              
                title: 'Error!',
                textBody: "You don't have authorize to receive this document or you already received this document.",                
                buttonText:'Ok',
                okButtonStyle:styles.confirmButton,
                okButtonTextStyle: styles.confirmButtonText,
                callback: () => {    
                  this.setState({isBarcodeRead:true});              
                  Popup.hide()                                    
                },              
              })
              
            }else{
              Popup.show({
                type: 'danger',              
                title: 'Error!',
                textBody: "Something went wrong.",                
                buttonText:'Ok',
                okButtonStyle:styles.confirmButton,
                okButtonTextStyle: styles.confirmButtonText,
                callback: () => {   
                  this.setState({isBarcodeRead:true});                             
                  Popup.hide()                                    
                },              
              })
              
            } 
          }).catch((err)=>{
            console.warn(err.response.data);
            
          });
      }else{
        alert('No internet connection');
      }
    });
    } 
      

    }


    render(){
        return (
            <View style={styles.container}>        
        
            {this.state.scanned == false ? (        
            <RNCamera
            onBarCodeRead = {this.handleBarCodeRead.bind(this)}
            style={[StyleSheet.absoluteFillObject,styles.container]}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
            >        
  
            
              <BarcodeMask edgeColor={Colors.color_palette.orange} showAnimatedLine={false}/>                
            
            </RNCamera>
  
            ) : (
            <Text> No Access camera</Text>
            )}
        </View>

        )
    }


}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 20,
      backgroundColor:Colors.new_color_palette.blue_background
      
    },
    formBody:{
      flex: 1,
      backgroundColor:Colors.new_color_palette.blue_background
    },
    qrForm:{
      flex: 1,
      backgroundColor:Colors.new_color_palette.blue_background,
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