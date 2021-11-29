import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable,ScrollView} from 'react-native';


import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import * as Yup from 'yup';
import FontAwesome  from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';
import {  Popup } from 'react-native-popup-confirm-toast';
import Button from 'apsl-react-native-button';
import NetInfo from "@react-native-community/netinfo";
import axios from 'axios';
import * as ipConfig from '../ipconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import DocumentPicker from 'react-native-document-picker';
import { Formik } from 'formik';
const pickDocument = async () =>{

    const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.images],
    })
    console.warn(results);                
}


export default class ReleaseScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading:false,
            selectedRecipients:[],
            recipients:[],
            params:this.props.route.params,
            files_to_upload:[],
            
            releaseFormOptions:{
                headerTitle: 'Release Document',
                headerTransparent: true,
                headerTitleStyle: styles.bottomTitle,
                headerTintColor: Colors.new_color_palette.orange,
                headerRight: () => (
                <View style={{flexDirection:'row'}}>
                <Pressable
                    onPress={pickDocument}
                    style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                    })}>
                    <FontAwesome
                    name="upload"
                    size={25}
                    color={Colors.color_palette.orange}
                    style={{ marginRight: 15 }}
                    />
                </Pressable>

                <Pressable
                    onPress={ () => {
                    
                    // navigation.navigate('HistoryScreen', { document_info: params.document_info });
                    }}
                    style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                    })}>
                    <FontAwesome
                    name="history"
                    size={25}
                    color={Colors.color_palette.orange}
                    style={{ marginRight: 15 }}
                    />
                </Pressable>
                </View>
                
                ),

            },

            multiSelectStyle : {
                    scrollView:{height:20},
                    chipContainer:{left:15,width:(Layout.window.width / 100) * 85},
                    chipsWrapper:{top:30,height:1000},                            
                    button:{backgroundColor:Colors.new_color_palette.yellow},                      
                    selectToggle:{width: (Layout.window.width / 100) * 85,left:20,borderWidth:1,borderColor:Colors.new_color_palette.orange}                
            }     
            
        }
    }


    componentDidMount(){
        this.props.navigation.setOptions(this.state.releaseFormOptions)
        axios.get(ipConfig.ipAddress + 'MobileApp/Mobile/get_offices').then((response) => {
            this.setState({recipients:response.data['offices']})            
        });
    }   

 

  




  // handle release button
   handleRelease = async () => {
    
    if (this.state.selectedRecipients.length != 0 ) {
      // show confirmation before receive the document
      Popup.show({
        type: 'confirm',
        title: 'Confirmation',
        textBody: 'Are you sure you want to release this document?',
        buttonText: 'Confirm',
        confirmText: 'Cancel',
        okButtonStyle: styles.confirmButton,
        okButtonTextStyle: styles.confirmButtonText,
        callback: () => {

          NetInfo.fetch().then(async (response) => {
            let data = {
              document_number: this.state.params.document_info[0].document_number,
              office_code: await AsyncStorage.getItem('office_code'),
              user_id: await AsyncStorage.getItem('user_id'),
              full_name: await AsyncStorage.getItem('full_name'),
              info_division: await AsyncStorage.getItem('division'),
              info_service: await AsyncStorage.getItem('service'),
              recipients_office_code : this.state.selectedRecipients
            }

            if (response.isConnected) {
              // perform axios here
              axios.post(ipConfig.ipAddress + 'MobileApp/Mobile/release_document', data).then((response) => {

                if (response.data['Message'] == 'true') {


                  Popup.show({
                    type: 'success',
                    title: 'Success!',
                    textBody: 'Successfully released the document',
                    buttonText: 'Go back to My Documents.',
                    okButtonStyle: styles.confirmButton,
                    okButtonTextStyle: styles.confirmButtonText,
                    modalContainerStyle: styles.confirmModal,
                    callback: () => {
                      Popup.hide()
                      this.state.navigation.replace('Root');
                    },
                  })


                } else {
                  console.warn(response.data);
                  Popup.show({
                    type: 'danger',
                    title: 'Error!',
                    textBody: 'Sorry you are not valid to release this document.',
                    buttonText: 'I understand',
                    okButtonStyle: styles.confirmButton,
                    okButtonTextStyle: styles.confirmButtonText,
                    modalContainerStyle: styles.confirmModal,
                    callback: () => {
                      Popup.hide()
                    },
                  })
                }
              }).catch((err) => {
                console.warn(err.response.data)
                Popup.hide()
              })

            } else {

              Popup.show({
                type: 'danger',
                title: 'Error!',
                textBody: 'No Internet Connection. Please try again. ',
                confirmText: 'I understand',
                okButtonStyle: styles.confirmButton,
                okButtonTextStyle: styles.confirmButtonText,
                modalContainerStyle: styles.confirmModal,
                callback: () => {

                  Popup.hide()
                },
              })


            }
          });




        },

        modalContainerStyle: styles.confirmModal

      })
    }else{

      Popup.show({
        type: 'danger',
        title: 'Error!',
        textBody: 'Select recipients first.',
        confirmText: 'I understand',
        okButtonStyle: styles.confirmButton,
        okButtonTextStyle: styles.confirmButtonText,
        modalContainerStyle: styles.confirmModal,
        callback: () => {

          Popup.hide()
        },
      })

    }


  }


   handleSelectedChange = (value) => {
    console.warn(value)
    this.setState({selectedRecipients:value});
  }



  // validation function 
    validation = Yup.object({
    recipient_office_code: Yup.string().required("Please select"),


  });




render(){



  // design start here
  return (

    <View style={styles.container}>


      <Formik
        initialValues={{ recipients_office_code: [] }}
        validationSchema={this.validation}
        onSubmit={(values) => this.handleRelease(values)}
      // validateOnChange={false}           
      >
        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }) => (
          <View style={styles.innerContainer}>
            <View>
              <Text style={styles.docuInfo}> <Icon name="file" size={20} color={Colors.color_palette.orange} />   Document Information</Text>
            </View>
         {this.state.params.document_info && this.state.params.document_info.map((item)=>(

            <ScrollView style={styles.infoCard}>

              <View>
                <Text style={styles.detailTitle}>Document Number:</Text>
              </View>
              <View style={styles.titleView}>
                {/* <Text style={styles.detailValue}>DA-CO-IAS-MO20211025-00001</Text> */}
                {/* <Text style={styles.detailValue}>{item.document_number}</Text> */}
              </View>

              <View>
                <Text style={styles.detailTitle}>Title:</Text>
              </View>
              <View style={styles.titleView}>
                {/* <Text style={styles.titleValue}>RFFA-IMC-On-Boarding-File-Structure </Text> */}
                {/* <Text style={styles.titleValue}>{item.subject} </Text> */}
              </View>


              <View >
                <Text style={styles.detailTitle}>From:</Text>
              </View>
              <View style={styles.titleView}>
                {/* <Text style={styles.titleValue}>ICTS SysAdd</Text> */}
                {/* <Text style={styles.titleValue}>{item.INFO_DIVISION}{'\n'}{item.INFO_SERVICE}</Text> */}
              </View>


              <View >
                {/* <Text style={styles.detailTitle}>Remarks:</Text> */}
              </View>
              <View style={styles.titleView}>
                {/* <Text style={styles.titleValue}>None</Text> */}
              </View>
              
            
              
             
              
              <ScrollView style={styles.recipient_office_select}>
                <SectionedMultiSelect
                  items={this.state.recipients}
                  IconRenderer={MaterialIcons}
                  uniqueKey="id"
                  subKey="children"
                  selectText="Select recipients..."
                  showDropDowns={true}
                  readOnlyHeadings={true}
                  onSelectedItemsChange={(value)=> this.setState({selectedRecipients:value})}
                  selectedItems={this.state.selectedRecipients}
                  highlightChildren={true}
                  styles={this.state.multiSelectStyle}
                  
                />
              </ScrollView>
              
              

        
            {/*release button */}
     


            </ScrollView>
         ))} 


                <View style={{ flex: 1 }}>
              <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top:(Layout.window.height / 100) * 3  }}>
                <Button
                  textStyle={styles.saveText}
                  style={styles.saveButton}
                  activityIndicatorColor={Colors.light}
                  activeOpacity={100}
                  isLoading={this.state.isLoading}
                  disabledStyle={{ opacity: 1 }}
                  onPress={this.handleRelease}
                >
                  Release Document

                </Button>
              </View>
              </View>

          </View>


        )}
      </Formik>
    </View>
  );
}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 10,
    backgroundColor: Colors.new_color_palette.blue_background
  },
  detailTitle: {

    fontSize: 18,
    fontWeight: '200',
    color: Colors.new_color_palette.text,
    padding: 20,
    top: 5,
  },
  docuInfo: {

    fontSize: 18,
    fontWeight: '200',
    color: Colors.new_color_palette.orange,
  },
  detailValue: {

    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.new_color_palette.orange,
    left: 20,
    width: (Layout.window.width / 100) * 80
  },
  saveButton: {
    borderColor: Colors.new_color_palette.orange,
    backgroundColor: Colors.new_color_palette.orange
  },
  saveText: {
    fontWeight: 'bold',
    color: Colors.light,
  },
  titleValue: {

    fontSize: 18,
    fontWeight: '200',
    color: Colors.new_color_palette.orange,
    left: 20,
    width: (Layout.window.width / 100) * 80

  },
  titleView: {
    width: (Layout.window.width / 100) * 30
  },
  infoCard: {
    top: 20,
    backgroundColor: Colors.new_color_palette.main_background,

    width: (Layout.window.width / 100) * 95,
    height: (Layout.window.height / 100) * 75,
    borderRadius: 15,
    minHeight: (Layout.window.height / 100) * 72,
    overflow:'hidden',
    paddingBottom:100
  },
  innerContainer: {
    top: 100,
    
  },
  bottomTitle: {
    color: Colors.new_color_palette.orange,
    fontSize: 20,
    
  },
  confirmButton: {
    backgroundColor: 'white',
    color: Colors.new_color_palette.orange,
    borderColor: Colors.new_color_palette.orange,
    borderWidth: 1
  },
  confirmButtonText: {
    color: Colors.new_color_palette.orange,
  },
  confirmModal: {
    
  },
  recipient_office_select:{
    top:30,
    height: (Layout.window.height / 100) * 75,
   
    
    
  }


});
