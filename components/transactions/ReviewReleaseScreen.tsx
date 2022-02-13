import React, {Component} from 'react';
import {StyleSheet, Text, View, Pressable,ScrollView,TextInput} from 'react-native';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import StepIndicatorStyle from '../../constants/StepIndicatorStyle';
import SocketConnection from '../../constants/SocketConnection';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Root, Popup,Toast } from 'react-native-popup-confirm-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import * as ipConfig from '../../ipconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-spinkit';
import io from 'socket.io-client';
import StepIndicator from 'react-native-step-indicator';
import ModalSelector from 'react-native-modal-selector';
import {List} from 'react-native-paper';
import FileViewer from 'react-native-file-viewer';


  

export default class ReviewReleaseScreen extends Component {
  constructor(props) {
    super(props);
    console.warn(this.props.route.params.selectedRecipients);
    this.state = {
      remarks:'',
      isFocus:false,
      files_to_upload: [],
      isLoading: false,
      openActionPicker:false,
      hasPermission: false,
      params: this.props.route.params,
      isAppLoading: false,
      spinner: {
        isVisible: true,
        color: Colors.light,
        size: 60,
      },
      actions: [
        {key: 0, section: true, label: 'Select Action'},
        {key: 1, label: 'Approved'},
        {key: 2, label: 'Disapproved'},
        {key: 3, label: 'Endorsed'},
        {key: 4, label: 'Return to Sender'},
        {key: 5, label: 'No Action'},
      ],
      receiveFormOptions: {
        headerTitle: 'Document Releasing',
        headerTransparent: true,
        headerTitleStyle: styles.bottomTitle,
        headerTintColor: Colors.new_color_palette.orange,
        headerLeft: () => (
          <Pressable
            onPress={() => this.props.navigation.goBack()}
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
          <Pressable
            onPress={async () => {
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
        ),
      },
    };
  }

  componentDidMount() {

    console.warn(this.state.params.base64_files)
    this.props.navigation.setOptions(this.state.receiveFormOptions);
  }

  // handle select action 
  handleSelectAction = ()=>  {

    
    
    
  }   
  //handle Release Document
  handleRelease = async () => {
    let consolidate_recipients = this.state.params.action ==  'Return to Sender' ? this.state.params.selectedRecipients.concat(this.state.params.document_info[0].sender_office_code) : this.state.params.selectedRecipients ;
    
    // check if it has selected recipients
    if (consolidate_recipients.length != 0  ) {
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
          Popup.hide();
          this.setState({isAppLoading: true});
            
          setTimeout(()=>{

          NetInfo.fetch().then(async response => {

          //   Toast.show({
          //     title: 'Message!',
          //     text: 'Processing...',
          //     color: '#702c91',
          //     timeColor: '#440f5f',
          //     timing: 5000,
          //     icon: <Icon name={'check'} color={'#fff'} size={31}/>,
          //     position: 'bottom',
          // })
            // Initialize Form Data
            let fd = new FormData();
            let division = await AsyncStorage.getItem('division');
            
            fd.append(
              'document_number',
              JSON.stringify(
                this.state.params.document_info[0].document_number
              ),
            );
            fd.append(
              'office_code',
              JSON.stringify(await AsyncStorage.getItem('office_code')),
            );
            fd.append(
              'user_id',
              JSON.stringify(await AsyncStorage.getItem('user_id')),
            );
            fd.append(
              'full_name',
              JSON.stringify(await AsyncStorage.getItem('full_name')),
            );
            fd.append(
              'info_division',
              JSON.stringify(await AsyncStorage.getItem('division')),
            );
            fd.append(
              'info_service',
              JSON.stringify(await AsyncStorage.getItem('service')),
            );

            fd.append('doc_prefix', JSON.stringify(this.state.params.document_info[0].document_type));
            fd.append('action', JSON.stringify(this.state.params.action));
            fd.append('remarks', JSON.stringify(this.state.remarks));
            
            fd.append(
              'recipients_office_code',
              JSON.stringify( consolidate_recipients),
            );
            fd.append(
              'file_attachments',
              JSON.stringify(this.state.params.base64_files),
            );
              
            if (response.isConnected) {
              
              // perform axios here
              axios
                .post(
                  ipConfig.ipAddress + '/MobileApp/Mobile/release_document',
                  fd,
                  {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  },
                )
                .then(response => {
                  console.warn(response)
                  this.setState({isAppLoading: false});
                  Toast.hide();
                  // check if status code is 200
                  if(response.status == 200){
                    console.warn(response.data['Message']);
                    if (response.data['Message'] == 'true') {
                      console.warn( this.state.params.selectedRecipients)


                      this.state.params.selectedRecipients.map(item =>
                        SocketConnection.socket.emit('push notification', {
                          channel:[item],
                          message: 'You have incoming document from '+division,
                          document_number:  this.state.params.document_info[0].document_number
                        }),
                      );

                   
                      Popup.show({
                        type: 'success',
                        title: 'Success!',
                        textBody: 'Successfully released the document',
                        buttonText: 'Go back to My Documents.',
                        okButtonStyle: styles.confirmButton,
                        okButtonTextStyle: styles.confirmButtonText,
                        modalContainerStyle: styles.confirmModal,
                        callback: () => {
                          Popup.hide();
                          this.setState({isAppLoading: false});                        
                          this.props.navigation.reset({
                            index: 0,
                            routes: [{ name: 'Root' }]
                          });
                          
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
                          Popup.hide();
                          this.props.navigation.reset({
                            index: 0,
                            routes: [{ name: 'Root' }]
                          });


                          this.setState({isAppLoading: false});
                          
                        },
                      });
                    }
                }else{
                  Popup.show({
                    type: 'danger',
                    title: 'Error!',
                    textBody: 'Something went wrong. Please try again. ',
                    confirmText: 'Okay',
                    okButtonStyle: styles.confirmButton,
                    okButtonTextStyle: styles.confirmButtonText,
                    modalContainerStyle: styles.confirmModal,
                    callback: () => {
                      
                      this.props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'Root' }]
                      });


                      this.setState({isAppLoading: false});
                      Popup.hide();
                    },
                  });                  
                }
                })
                .catch(error => {
                  this.setState({isAppLoading: false});
                  console.log(error.response.data);
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

          
        },3000);
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

   renderStepIndicator = (params: any) => (
    <Icon {...StepIndicatorStyle.getStepIndicatorIconConfig(params)} />
  );


  // Remove document from file upload
  removeDocument = (documents, index) => {
    try {
      let array = documents.slice();
      let get_index = array.indexOf(index);

      let remove = array.splice(get_index, 1);
      var get_params = {...this.state.params};
      get_params.base64_files  = array.map(item => ({uri: item.uri, name: item.name}));

      console.warn( get_params.base64_files);
      this.setState({
        params:get_params
      }).catch(err => {
        console.warn(err);
      });
    } catch (err) {}
  };


  viewFile = file => {
    FileViewer.open(file)
      .then(() => {})
      .catch(err => console.warn(err));
  }

  
  render() {
    return (
      <View style={styles.container}>

        <View style={{top:50}}>
            <StepIndicator
                stepCount={4}
                customStyles={StepIndicatorStyle.customStyles}
                currentPosition={3}
                labels={StepIndicatorStyle.labels}            
                renderStepIndicator  = {this.renderStepIndicator}            
        
            />
        </View>
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
          {this.state.params.document_info &&
            this.state.params.document_info.map(item => (
              <ScrollView style={styles.infoCard}>
                <View>
                  <Text style={styles.detailTitle}>Document Number:</Text>
                </View>
                <View style={styles.titleView}>
                  {/* <Text style={styles.detailValue}>DA-CO-IAS-MO20211025-00001</Text> */}
                  <Text style={styles.detailValue}>{item.document_number}</Text>
                </View>

                <View>
                  <Text style={styles.detailTitle}>Title:</Text>
                </View>
                <View style={styles.titleView}>
                  {/* <Text style={styles.titleValue}>RFFA-IMC-On-Boarding-File-Structure </Text> */}
                  <Text style={styles.titleValue}>{item.subject} </Text>
                </View>

                <View>
                  <Text style={styles.detailTitle}>From:</Text>
                </View>
                <View style={styles.titleView}>
                  {/* <Text style={styles.titleValue}>ICTS SysAdd</Text> */}
                  <Text style={styles.titleValue} numberOfLines={10}>
                    {item.sender_division}
                    {' '}
                    {item.sender_service}
                  </Text>
                </View>

                {/* <View>
                  <Text style={styles.detailTitle}>Remarks:</Text>
                </View>
                <View style={styles.titleView}>
                  <Text style={styles.titleValue}>{item.rcl_remarks}
                                    
                  </Text>                  
                </View> */}

            

              </ScrollView>
             ))} 

               <ScrollView style={[styles.moreInfoCard]}>
               <View>
                  <Text style={styles.detailTitle}>Remarks (Optional):</Text>
                </View>

                <View>
                  <TextInput 

                    multiline={true}
                    style={[styles.remarks,{borderColor: this.state.isFocus == true ? Colors.new_color_palette.blue : Colors.new_color_palette.title,color:Colors.new_color_palette.orange}]}
                    onFocus = {()=>this.setState({isFocus:true})}
                    onBlur={()=>this.setState({isFocus:false})}
                    onChangeText={(value)=>this.setState({remarks:value})}
                    
                  
                  />
                  
                </View>
                        
              </ScrollView>

              {/* <ScrollView style={[styles.moreInfoCard]}>
                  <List.Accordion                    
                        style={[
                            styles.detailTitle,
                            {
                            top:20,
                            borderRadius:20,
                           
                            backgroundColor:Colors.new_color_palette.main_background,
                            overflow: 'scroll',
                            },
                        ]}
                        
                        titleStyle={{color: Colors.primary}}
                        title={'Files to Upload ('+this.state.params.base64_files.length+')'}>
                        {this.state.params.base64_files.map(item_base64 => (
                            <List.Item
                            titleStyle={styles.file_item}
                            title={item_base64.name}
                            // left={() => (
                            //     <Icon
                            //     name="eye"
                            //     color={Colors.warning}
                            //     size={30}
                            //     onPress={() => this.viewFile(item_base64.path)}
                            //     />
                            // )}
                            // right={() => (
                            //     <Icon
                            //     name="times-circle"
                            //     color={Colors.danger}
                            //     size={30}
                            //     onPress={() =>
                            //         this.removeDocument(
                            //         this.state.params.base64_files,
                            //         item_base64,
                            //         )
                            //     }
                            //     />
                            // )}
                            />
                        ))}
                        </List.Accordion>


                        
              </ScrollView> */}




              
        </View>

        <View style={{flex: 1}}>

          <ModalSelector
                data={this.state.actions}
                onChange={option => this.handleRelease(option.label)}
                visible={this.state.openActionPicker}
                initValue="Release"          
                selectedItemTextStyle={styles.selectedText}
                initValueTextStyle={styles.saveText}
                selectStyle={[styles.saveButton,{display:'none'}]}
                selectTextStyle={styles.saveText}
                optionTextStyle={{color: Colors.dark}}
                sectionTextStyle={{color: Colors.new_color_palette.orange}}
                onModalClose = {()=>{this.setState({openActionPicker:false})
              }}
              />
          <View style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>
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
    fontWeight: 'Bold',
    color: Colors.new_color_palette.text,
    padding: 20,
    top: 5,
  },
  docuInfo: {
    fontSize: 18,
    fontWeight: 'Bold',
    color: Colors.new_color_palette.orange,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.new_color_palette.orange,
    left: 20,
    width: (Layout.window.width / 100) * 80,
  },
  saveButton: {
    borderColor: Colors.new_color_palette.orange,
    backgroundColor: Colors.new_color_palette.orange,
  },
  saveText: {
    fontWeight: 'bold',
    color: Colors.light,
  },
  titleValue: {
    fontSize: 14,
    fontWeight: 'Bold',
    color: Colors.new_color_palette.orange,
    left: 20,
    width: (Layout.window.width / 100) * 80,
  },
  titleView: {
    width: (Layout.window.width / 100) * 30,
  },
  infoCard: {
    overflow:'hidden',
    top: 20,
    backgroundColor: Colors.new_color_palette.main_background,
    width: (Layout.window.width / 100) * 95,
    height: (Layout.window.height / 100) * 40,
    borderRadius: 15,
    minHeight: (Layout.window.height / 100) * 40,
  },
  moreInfoCard: {
    top:30,
    backgroundColor: Colors.new_color_palette.main_background,
    width: (Layout.window.width / 100) * 95,
    height: (Layout.window.height / 100) * 19,
    borderRadius: 15,
    minHeight: (Layout.window.height / 100) * 19,
  },
  innerContainer: {
    top: 60,
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
  selectedText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: Colors.new_color_palette.yellow,
  },
  file_item: {
    color: Colors.new_color_palette.orange
  },
  remarks: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius:10
  },
});
