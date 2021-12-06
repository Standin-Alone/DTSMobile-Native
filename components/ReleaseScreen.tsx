import React from 'react';
import {StyleSheet, Text, View, Pressable, ScrollView,ToastAndroid, Alert} from 'react-native';

import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import * as Yup from 'yup';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Popup} from 'react-native-popup-confirm-toast';
import Button from 'apsl-react-native-button';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import * as ipConfig from '../ipconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import DocumentPicker from 'react-native-document-picker';
import {Formik} from 'formik';
import Spinner from 'react-native-spinkit';
import {launchCamera} from 'react-native-image-picker';
import * as RNFS from 'react-native-fs';
import { List } from 'react-native-paper';
import FileViewer from "react-native-file-viewer";
import base64 from 'react-native-base64';
export default class ReleaseScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selectedRecipients: [],
      recipients: [],
      base64_files: [] ,
      params: this.props.route.params,
      files_to_upload: [],
      isAppLoading: false,
      spinner: {
        isVisible: true,
        color: Colors.color_palette.orange,
        size: 60,
      },

      releaseFormOptions: {
        headerTitle: 'Release Document',
        headerTransparent: true,
        headerTitleStyle: styles.bottomTitle,
        headerTintColor: Colors.new_color_palette.orange,
        headerLeft: () => (
          <Pressable
            onPress={() => this.props.navigation.replace('Root')}
            style={({pressed}) => ({
              opacity: pressed ? 0.5 : 1,
            })}>
            <FontAwesome
              name="arrow-left"
              size={25}
              color={Colors.color_palette.orange}
            />
          </Pressable>
        ),
        headerRight: () => (
          <View style={{flexDirection: 'row'}}>
            <Pressable
              onPress={() => {
                this.props.navigation.navigate('History', {
                  document_info: this.state.params.document_info,
                });
              }}
              style={({pressed}) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="history"
                size={25}
                color={Colors.color_palette.orange}
                style={{marginRight: 15}}
              />
            </Pressable>
          </View>
        ),
      },

      multiSelectStyle: {
        scrollView: {height: 20},
        chipContainer: {left: 15, width: (Layout.window.width / 100) * 85},
        chipsWrapper: {top: 30, height: 1000},
        button: {backgroundColor: Colors.new_color_palette.yellow},
        selectToggle: {
          width: (Layout.window.width / 100) * 85,
          left: 20,
          borderWidth: 1,
          borderColor: Colors.new_color_palette.orange,
        },
      },
    };
  }


  removeDocument = (documents,index) =>{


    try{
        let array = documents.slice();
        let get_index = array.indexOf(index);
        
        
        let remove = array.splice(get_index,1)
        
      
          this.setState({
                  
            base64_files: array.map(item => ({uri: item.uri,name:item.name}))
          }).catch((err)=>{ console.warn(err)});
        }catch(err){

        };
  }
  // attach document or file
  pickDocument = async () => {
    const results = await DocumentPicker.pickMultiple({
      allowMultiSelection: true,
      type: [
        DocumentPicker.types.docx,
        DocumentPicker.types.doc,
        DocumentPicker.types.xls,
        DocumentPicker.types.xlsx,
        DocumentPicker.types.pdf,
        DocumentPicker.types.doc,
        DocumentPicker.types.csv,
        DocumentPicker.types.plainText,
      ],
    });
    console.warn(results);
    
    // get results of file
    results.map( async (item_file)=>{

      // check if file is less than 10 mb
      if(item_file.size <= 10000000){
        const convert_to_base64 = await RNFS.readFile(item_file.uri,'base64');      
        
        this.setState(prevState =>({base64_files: [...prevState.base64_files,{uri: convert_to_base64,name:item_file.name,path:item_file.uri}]}));

      }else{
        ToastAndroid.showWithGravity('Your file should not exceed 10MB.',ToastAndroid.SHORT,ToastAndroid.BOTTOM);
      }
      
    })


    
    
  };


  // take photo
  takePhoto = async () => {
    const results = await launchCamera({
      mediaType: 'photo',
      includeBase64: true,
    });

    
    // get results of file
    results.assets.map( async (item_file)=>{

      // check if file is less than 10 mb
      if(item_file.fileSize <= 10000000){
        
        
        this.setState(prevState =>({base64_files: [...prevState.base64_files,{uri: item_file.base64,name:item_file.fileName,path:item_file.uri}]}));

      }else{
        ToastAndroid.showWithGravity('Your file should not exceed 10MB.',ToastAndroid.SHORT,ToastAndroid.BOTTOM);
      }
      
    })

  };

  // execute when first load of screen
  componentDidMount() {
    this.props.navigation.setOptions(this.state.releaseFormOptions);
    axios
      .get(ipConfig.ipAddress + 'MobileApp/Mobile/get_offices')
      .then(response => {
        this.setState({recipients: response.data['offices']});
      });
  }

  // handle release button
  handleRelease = async () => {
    

    if (this.state.selectedRecipients.length != 0) {
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
          this.setState({isAppLoading: true});
          NetInfo.fetch().then(async response => {
        

            // Initialize Form Data
            let fd = new FormData();

            fd.append('document_number',this.state.params.document_info[0].document_number);
            fd.append('office_code',await AsyncStorage.getItem('office_code'));
            fd.append('user_id', await AsyncStorage.getItem('user_id'));
            fd.append('full_name',await AsyncStorage.getItem('full_name'));
            fd.append('info_division', await AsyncStorage.getItem('division'));
            fd.append('info_service', await AsyncStorage.getItem('service'));
            fd.append('recipients_office_code', this.state.selectedRecipients);
            fd.append('file_attachments' ,this.state.base64_files);

           
            if (response.isConnected) {
              // perform axios here
              axios
                .post(
                  ipConfig.ipAddress + 'MobileApp/Mobile/release_document',
                  fd,
                )
                .then(response => {
                  this.setState({isAppLoading: false});
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
                        this.setState({isAppLoading: false});
                        Popup.hide();
                        this.state.navigation.replace('Root');
                      },
                    });
                  } else {
                    console.warn(response.data);
                    Popup.show({
                      type: 'danger',
                      title: 'Error!',
                      textBody:
                        'Sorry you are not valid to release this document.',
                      buttonText: 'I understand',
                      okButtonStyle: styles.confirmButton,
                      okButtonTextStyle: styles.confirmButtonText,
                      modalContainerStyle: styles.confirmModal,
                      callback: () => {
                        this.setState({isAppLoading: false});
                        Popup.hide();
                      },
                    });
                  }
                })
                .catch(err => {
                  this.setState({isAppLoading: false});
                  console.warn(err.response.data);
                  Popup.hide();
                });
            } else {
              this.setState({isAppLoading: false});
              Popup.show({
                type: 'danger',
                title: 'Error!',
                textBody: 'No Internet Connection. Please try again. ',
                confirmText: 'I understand',
                okButtonStyle: styles.confirmButton,
                okButtonTextStyle: styles.confirmButtonText,
                modalContainerStyle: styles.confirmModal,
                callback: () => {
                  this.setState({isAppLoading: false});
                  Popup.hide();
                },
              });
            }
          });
        },

        modalContainerStyle: styles.confirmModal,
      });
    } else {
      Popup.show({
        type: 'danger',
        title: 'Error!',
        textBody: 'Select recipients first.',
        confirmText: 'I understand',
        okButtonStyle: styles.confirmButton,
        okButtonTextStyle: styles.confirmButtonText,
        modalContainerStyle: styles.confirmModal,
        callback: () => {
          Popup.hide();
        },
      });
    }
  };

  handleSelectedChange = value => {
    console.warn(value);
    this.setState({selectedRecipients: value});
  };

  viewFile = (file)=>{
    
    FileViewer.open(file).then(()=>{

    }).catch((err)=>console.warn(err));
  }

  render() {
    // design start here
    return (
      <View style={styles.container}>
        
            <View style={styles.innerContainer}>
              <View>
                <Text style={styles.docuInfo}>
                  {' '}
                  <Icon
                    name="file"
                    size={20}
                    color={Colors.color_palette.orange}
                  />{' '}
                  Document Information
                </Text>
              </View>
              {/* {this.state.params.document_info &&
                this.state.params.document_info.map(item => ( */}
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

                <View>
                  <Text style={styles.detailTitle}>From:</Text>
                </View>
                <View style={styles.titleView}>
                  {/* <Text style={styles.titleValue}>ICTS SysAdd</Text> */}
                  {/* <Text style={styles.titleValue}>{item.INFO_DIVISION}{'\n'}{item.INFO_SERVICE}</Text> */}
                </View>

                <View>
                  {/* <Text style={styles.detailTitle}>Remarks:</Text> */}
                </View>
                <View style={styles.titleView}>
                  {/* <Text style={styles.titleValue}>None</Text> */}
                </View>

                <View>
                  {/* <Text style={styles.detailTitle}>
                    Uploaded Files (Optional):
                  </Text> */}
                    { this.state.base64_files.length != 0  ?
                      <List.Accordion
                      expanded={true}
                      style={[styles.detailTitle,{backgroundColor:Colors.new_color_palette.main_background}]}                    
                      titleStyle={{color:Colors.primary}}
                      title=" Uploaded Files (Optional):"
                      >
                        {
                          this.state.base64_files.map((item_base64) => (
                            <List.Item  
                                titleStyle={styles.file_item} 
                                title={item_base64.name}                                 
                                left={()=><Icon name="eye" color={Colors.warning}  size={30} onPress={()=>this.viewFile(item_base64.path)} />} 
                                right={()=><Icon name="close" color={Colors.danger} size={30} onPress={()=>this.removeDocument(this.state.base64_files,item_base64)}    />} 
                                
                            />                      
                          ))
                        }
                      
                    </List.Accordion>
                    : null
                    }                 
                </View>

                <View style={styles.titleView}>
            
                </View>

                <View>
                  <Text style={styles.detailTitle}>Choose Recipients</Text>
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
                    onSelectedItemsChange={value =>
                      this.setState({selectedRecipients: value})
                    }
                    selectedItems={this.state.selectedRecipients}
                    highlightChildren={true}
                    styles={this.state.multiSelectStyle}
                  />
                </ScrollView>

                {/*release button */}
              </ScrollView>
              {/* ))} */}
            </View>        

        <View style={{flex: 1}}></View>
        <View
          style={{
            position: 'absolute',
            left: 10,
            right: 0,
            bottom: 20,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
            width: (Layout.window.width / 100) * 95,
            top: (Layout.window.height / 100) * 89,
            flexDirection: 'row',
          }}>
          <View style={{marginRight: 20}}>
            <Icon
              name="paperclip"
              size={25}
              color={Colors.color_palette.orange}
              onPress={this.pickDocument}
            />
          </View>
          <View style={{marginRight: 20}}>
            <Icon
              name="camera"
              size={25}
              color={Colors.color_palette.orange}
              onPress={this.takePhoto}
            />
          </View>

          <View style={{marginRight: 20}}>
            <Button
              textStyle={styles.saveText}
              style={styles.saveButton}
              activityIndicatorColor={Colors.light}
              activeOpacity={100}
              isLoading={this.state.isLoading}
              disabledStyle={{opacity: 1}}
              onPress={this.handleRelease}>
              Release Document
            </Button>
          </View>
        </View>

        {/* loading screen */}

        {this.state.isAppLoading && (
          <View style={styles.loading}>
            <Spinner
              isVisible={this.state.spinner.isVisible}
              size={this.state.spinner.size}
              type={'Wave'}
              color={this.state.spinner.color}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 10,
    backgroundColor: Colors.new_color_palette.blue_background,
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
    width: (Layout.window.width / 100) * 80,
  },
  saveButton: {
    borderColor: Colors.new_color_palette.orange,
    width: (Layout.window.width / 100) * 65,
    bottom: 10,
    backgroundColor: Colors.new_color_palette.orange,
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
    width: (Layout.window.width / 100) * 80,
  },
  titleView: {
    width: (Layout.window.width / 100) * 30,
  },
  infoCard: {
    top: 20,
    backgroundColor: Colors.new_color_palette.main_background,

    width: (Layout.window.width / 100) * 95,
    height: (Layout.window.height / 100) * 66,
    borderRadius: 15,
    minHeight: (Layout.window.height / 100) * 72,
    overflow: 'hidden',
    paddingBottom: 100,
  },
  innerContainer: {
    top: 50,
  },
  bottomTitle: {
    color: Colors.new_color_palette.orange,
    fontSize: 20,
  },
  confirmButton: {
    backgroundColor: 'white',
    color: Colors.new_color_palette.orange,
    borderColor: Colors.new_color_palette.orange,
    borderWidth: 1,
  },
  confirmButtonText: {
    color: Colors.new_color_palette.orange,
  },
  confirmModal: {},
  recipient_office_select: {
    top: 30,
    height: (Layout.window.height / 100) * 75,
  },
  uploadButton: {
    borderColor: Colors.warning,
    backgroundColor: Colors.warning,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  file_item:{
    color:Colors.new_color_palette.orange
  }
});
