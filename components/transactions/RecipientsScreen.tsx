import React, {Component} from 'react';
import {StyleSheet, Text, View, Pressable,ScrollView} from 'react-native';
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
import { createFilter } from "react-native-search-filter";

import SectionedMultiSelect from 'react-native-sectioned-multi-select';


  

export default class RecipientsScreen extends Component {
  constructor(props) {
    super(props);
    console.warn(this.props.route.params);
    this.state = {
      scanned: false,
      recipients:[],
      selectedRecipients:[],
      isLoading: false,
      hasPermission: false,
      params: this.props.route.params,
      isAppLoading: false,
      spinner: {
        isVisible: true,
        color: Colors.color_palette.orange,
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
      multiSelectStyle: {
        
        chipContainer: {
          left: 15,
          width: (Layout.window.width / 100) * 85,
          height: 100,
          padding: 20,
          backgroundColor:Colors.new_color_palette.main_background
          
        },
        chipsWrapper: {top: 30,height:(Layout.window.height / 100) * 80 ,overflow:'scroll',marginBottom:100},
        button: {backgroundColor: Colors.new_color_palette.yellow},
        selectToggle: {          
          
          borderRadius:20,
          width: (Layout.window.width / 100) * 85,
          padding:20,
          left: 20,
          borderWidth: 1,
          borderColor: Colors.new_color_palette.orange,
          backgroundColor:'white',          
        },
      },
    };
  }

  componentDidMount() {

    
    this.props.navigation.setOptions(this.state.receiveFormOptions);

    axios
    .get(ipConfig.ipAddress + 'MobileApp/Mobile/get_offices')
    .then(response => {
      this.setState({recipients: response.data['offices']});
    });
  }


  // handle  go to review release screen
  handleGoToReviewReleaseScreen = async () => {
    console.warn(this.state.selectedRecipients.length)
    if(this.state.selectedRecipients.length != 0 ){
        this.props.navigation.push('ReviewRelease',{
          document_info:this.state.params.document_info,
          base64_files:this.state.params.base64_files,
          selectedRecipients:this.state.selectedRecipients,

        });
    }else{
      Popup.show({
        type: 'danger',
        title: 'Error!',
        textBody:
          'Please select recipients.',
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
  };

 

   renderStepIndicator = (params: any) => (
    <Icon {...StepIndicatorStyle.getStepIndicatorIconConfig(params)} />
  );

  render() {
    return (
        <View style={styles.container}>

        <View style={{top:50}}>
            <StepIndicator
                stepCount={4}
                customStyles={StepIndicatorStyle.customStyles}
                currentPosition={2}
                labels={StepIndicatorStyle.labels}            
                renderStepIndicator  = {this.renderStepIndicator}            
        
            />
        </View>
        <View style={styles.innerContainer}>
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
                filterItems = {(searchTerm)=>{
                  const filteredRecipients = this.state.recipients.filter(
                    createFilter(searchTerm, ['division','name'])
                  );

                  return filteredRecipients
                }}
                selectedItems={this.state.selectedRecipients}
                highlightChildren={true}
                styles={this.state.multiSelectStyle}
            />
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
              onPress={this.handleGoToReviewReleaseScreen}>
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
      top: 80,
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
        width:200,        
        backgroundColor:Colors.new_color_palette.yellow,
        marginLeft:15
        
    },
    recipient_office_select: {

      height: (Layout.window.height / 100) * 65,
    },
  });
  