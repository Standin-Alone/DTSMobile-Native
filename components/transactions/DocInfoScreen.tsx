import React, {Component} from 'react';
import {StyleSheet, Text, View, Pressable,ScrollView} from 'react-native';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import StepIndicatorStyle from '../../constants/StepIndicatorStyle';
import SocketConnection from '../../constants/SocketConnection';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Popup} from 'react-native-popup-confirm-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import * as ipConfig from '../../ipconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-spinkit';
import io from 'socket.io-client';
import StepIndicator from 'react-native-step-indicator';
import LinearGradient from 'react-native-linear-gradient';

export default class DocInfoScreen extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      scanned: false,
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
            onPress={() =>
              this.props.navigation.reset({
                index: 0,
                routes: [{name: 'Root'}],
              })
            }
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
    console.warn(this.state.params.document_info);
    this.props.navigation.setOptions(this.state.receiveFormOptions);
  }

  navigateToAttachmentScreen = () => {
    this.props.navigation.navigate('Attachment', {
      document_info: this.state.params.document_info,
    });
  };

  //handle Button  go to Attachment Screen
  handleGoToAttachmentScreen = async () => {
    this.navigateToAttachmentScreen();
  };

  renderStepIndicator = (params: any) => (
    <Icon {...StepIndicatorStyle.getStepIndicatorIconConfig(params)} />
  );

  render() {
    return (
      <View style={styles.container}>
        <View style={{top: 50}}>
          <StepIndicator
            stepCount={4}
            customStyles={StepIndicatorStyle.customStyles}
            currentPosition={0}
            labels={StepIndicatorStyle.labels}
            renderStepIndicator={this.renderStepIndicator}
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
                  <Text style={styles.detailTitle}>Originating Office:</Text>
                </View>

                <View style={styles.titleView}>
                  <Text style={styles.titleValue} numberOfLines={10}>
                    {item.origin_division}

                    {item.origin_service}
                  </Text>
                </View>

                <View>
                  <Text style={styles.detailTitle}>From:</Text>
                </View>
                <View style={styles.titleView}>
                  {/* <Text style={styles.titleValue}>ICTS SysAdd</Text> */}
                  <Text style={styles.titleValue} numberOfLines={10}>
                    {item.sender_division}

                    {item.sender_service}
                  </Text>
                </View>

                <View>
                  <Text style={styles.detailTitle}>Remarks:</Text>
                </View>
                <View style={styles.titleView}>
                  <Text style={styles.titleValue}>{item.rcl_remarks}                  
                  </Text>


                  
                </View>
              </ScrollView>
            ))}
        </View>

        <View style={{flex: 1}}>

      


          <View style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>
          {/* <LinearGradient colors={[ '#fc575e', '#f7b42c' ,'#f7b42c']}  start={{ x: 0.4, y: 1 }} end={{ x: 3, y: 0.3 }} style={styles.linearGradient} >
          <Text style={styles.buttonText}>
           Upload Attachments
          </Text>
        </LinearGradient> */}
            <Button
              textStyle={styles.saveText}
              style={styles.saveButton}
              activityIndicatorColor={Colors.light}
              activeOpacity={100}
              isLoading={this.state.isLoading}
              disabledStyle={{opacity: 1}}
              onPress={this.handleGoToAttachmentScreen}>
              Go To Attachments
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
    top: 20,
    overflow: 'scroll',
    backgroundColor: Colors.new_color_palette.main_background,
    width: (Layout.window.width / 100) * 95,
    height: (Layout.window.height / 100) * 65,
    borderRadius: 15,
    minHeight: (Layout.window.height / 100) * 65,
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
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});
