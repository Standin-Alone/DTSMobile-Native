import React, {Component} from 'react';
import {StyleSheet, Text, View, Pressable,  ToastAndroid,ScrollView} from 'react-native';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import StepIndicatorStyle from '../../constants/StepIndicatorStyle';
import SocketConnection from '../../constants/SocketConnection';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Popup} from 'react-native-popup-confirm-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import * as ipConfig from '../../ipconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-spinkit';
import io from 'socket.io-client';
import StepIndicator from 'react-native-step-indicator';
import {launchCamera} from 'react-native-image-picker';
import * as RNFS from 'react-native-fs';
import {List} from 'react-native-paper';
import FileViewer from 'react-native-file-viewer';
import DocumentPicker from 'react-native-document-picker';


  

export default class AttachmentScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      scanned: false,
      base64_files: [],    
      files_to_upload: [],
      isLoading: false,
      hasPermission: false,
      params: this.props.route.params,
      isAppLoading: false,
      spinner: {
        isVisible: true,
        color: Colors.light,
        size: 60,
      },
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

    this.props.navigation.addListener ('focus', async() =>{
      this.setState({isAppLoading:false})
       
    });
    
    this.props.navigation.setOptions(this.state.receiveFormOptions);
  }


  // handle receive button
  handleGoToRecipients = async () => {
    
    this.setState({isAppLoading:true});
    this.props.navigation.push('Recipients',{
      document_info: this.state.params.document_info,
      base64_files:this.state.base64_files
    });

    
  };



   // attach document or file
   pickDocument = async () => {
    this.setState({isAppLoading: true});
    try {
      const results = await DocumentPicker.pickMultiple({
        allowMultiSelection: true,
        type: [DocumentPicker.types.pdf],
      });

      // check if document viewer was launched
      if (results) {
        // get results of file
        results.map(async item_file => {
          // check if file is less than 10 mb
          if (item_file.size <= 30000000) {
            const convert_to_base64 = await RNFS.readFile(
              item_file.uri,
              'base64',
            );
            // check file if duplicate
            const check_file = this.state.base64_files.find(
              data => data.name === item_file.name,
            );
            if (!check_file) {

              const baseName = item_file.name.split('.').slice(0, -1).join('.');

              var file_extension = item_file.name.split('.').pop(); 
              this.setState(prevState => ({
                base64_files: [
                  ...prevState.base64_files,
                  {
                    uri: convert_to_base64,
                    name: item_file.name,
                    base_name:baseName,
                    file_extension:file_extension,
                    path: item_file.uri,
                    type: item_file.type,
                  },
                ],
              }));
            }
          } else {
            ToastAndroid.showWithGravity(
              'Your file should not exceed 10MB.',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          }
        });
        this.setState({isAppLoading: false});
      } else {
        
        this.setState({isAppLoading: false});
      }
      1;
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {        
        this.setState({isAppLoading: false});
      }
    }
  };




  // take photo
  takePhoto = async () => {
    // open loading screen
    this.setState({isAppLoading: true});

    const results = await launchCamera({
      mediaType: 'photo',
      includeBase64: true,
    });

    // check if camera was launched
    if (!results.didCancel) {
      this.setState({isAppLoading: false});
      // get results of file
      results.assets.map(async item_file => {
        // check if file is less than 10 mb
        if (item_file.fileSize <= 10000000) {
          
          const baseName = item_file.fileName.split('.').slice(0, -1).join('.');
          var file_extension = item_file.fileName.split('.').pop(); 

          this.setState(prevState => ({
            base64_files: [
              ...prevState.base64_files,
              {
                uri: item_file.base64,
                name: item_file.fileName,
                base_name: baseName,
                file_extension:file_extension,
                path: item_file.uri,
                type: item_file.type,
              },
            ],
          }));
        } else {
          ToastAndroid.showWithGravity(
            'Your file should not exceed 10MB.',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        }
      });
    } else {
      this.setState({isAppLoading: false});
    }
  };

  // Remove document from file upload
  removeDocument = (documents, index) => {
    try {
      let array = documents.slice();
      let get_index = array.indexOf(index);

      let remove = array.splice(get_index, 1);

      this.setState({
        base64_files: array.map(item => ({uri: item.uri, name: item.name,
          base_name: item.base_name,
          file_extension:item.file_extension,
          path: item.uri,
          type: item.type})),
      }).catch(err => {
        console.warn(err);
      });
    } catch (err) {}
  };


   renderStepIndicator = (params: any) => (
    <Icon {...StepIndicatorStyle.getStepIndicatorIconConfig(params)} />
  );

  viewFile = file => {
    FileViewer.open(file)
      .then(() => {})
      .catch(err => console.warn(err));
  };

  render() {
    return (
        <View style={styles.container}>

        <View style={{top:50}}>
            <StepIndicator
                stepCount={4}
                customStyles={StepIndicatorStyle.customStyles}
                currentPosition={1}
                labels={StepIndicatorStyle.labels}            
                renderStepIndicator  = {this.renderStepIndicator}            
        
            />
        </View>
        <View style={styles.innerContainer}>
          <View style={{flexDirection:'row',left:1}}>
            <Button 
              textStyle={styles.saveText}
              style={styles.topButton}
              activityIndicatorColor={Colors.light}
              activeOpacity={100}
              isLoading={this.state.isLoading}
              disabledStyle={{opacity: 1}}
              onPress={this.pickDocument}>
                <MaterialIcons  name="upload-file" color={Colors.light} size={25}/>        
            </Button>

            <Button 
              textStyle={styles.saveText}
              style={styles.topButton}
              activityIndicatorColor={Colors.light}
              activeOpacity={100}
              isLoading={this.state.isLoading}
              disabledStyle={{opacity: 1}}
              onPress={this.takePhoto}>
                  <MaterialIcons  name="add-a-photo" color={Colors.light} size={25}/>         
            </Button>
          </View>

                <ScrollView style={styles.infoCard}>
                    <List.Accordion
                        expanded={true}
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
                        title="List of Selected Files to Upload:">
                        {this.state.base64_files.map(item_base64 => (
                            <List.Item
                            titleStyle={styles.file_item}
                            title={item_base64.name}
                            left={() => (
                                <Icon
                                name="eye"
                                color={Colors.warning}
                                size={30}
                                onPress={() => this.viewFile(item_base64.path)}
                                />
                            )}
                            right={() => (
                                <Icon
                                name="times-circle"
                                color={Colors.danger}
                                size={30}
                                onPress={() =>
                                    this.removeDocument(
                                    this.state.base64_files,
                                    item_base64,
                                    )
                                }
                                />
                            )}
                            />
                        ))}
                        </List.Accordion>
       
              </ScrollView>      
        </View>

        <View style={{flex: 1}}>
          <View style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>
            <Button
              textStyle={styles.saveText}
              style={styles.saveButton}
              activityIndicatorColor={Colors.light}
              activeOpacity={100}
              isLoading={this.state.isLoading}
              disabledStyle={{opacity: 1}}
              onPress={this.handleGoToRecipients}>
                Next
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
      fontSize: 20,
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
      fontSize: 18,
      fontWeight: 'Bold',
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
      height: (Layout.window.height / 100) * 60,
      borderRadius: 15,
      minHeight: (Layout.window.height / 100) * 60,
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
    topButton:{
        width:(Layout.window.width / 100) * 40,        
        backgroundColor:Colors.new_color_palette.yellow,
        marginLeft:15
        
    },
    file_item: {
      color: Colors.new_color_palette.orange
    },
  });
  