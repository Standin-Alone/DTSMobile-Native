import React, {Component} from 'react';
import {StyleSheet, Text, View, Pressable,ScrollView} from 'react-native';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import SocketConnection from '../constants/SocketConnection';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Popup} from 'react-native-popup-confirm-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import * as ipConfig from '../ipconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-spinkit';


export default class ReceiveScreen extends Component {
  constructor(props) {
    super(props);
    console.warn(this.props.route.params);
    this.state = {
      scanned: false,
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
        headerTitle: 'Receive Document',
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

    console.warn( this.state.params)
    this.props.navigation.setOptions(this.state.receiveFormOptions);
  }

  navigateToRoot = () => {
    this.props.navigation.replace('Root');
  };

  // handle receive button
  handleReceive = async () => {
    // show confirmation before receive the document
    Popup.show({
      type: 'confirm',
      title: 'Confirmation',
      textBody: 'Are you sure you want to receive this document?',
      buttonText: 'Confirm',
      confirmText: 'Cancel',
      okButtonStyle: styles.confirmButton,
      okButtonTextStyle: styles.confirmButtonText,
      callback: () => {
        this.setState({isAppLoading: true});
        NetInfo.fetch().then(async response => {
          let data = {
            document_number: this.state.params.document_info[0].document_number,
            office_code: await AsyncStorage.getItem('office_code'),
            user_id: await AsyncStorage.getItem('user_id'),
            full_name: await AsyncStorage.getItem('full_name'),
            info_division: await AsyncStorage.getItem('division'),
            info_service: await AsyncStorage.getItem('service'),
          };

          if (response.isConnected) {
            // perform axios here
            axios
              .post(
                ipConfig.ipAddress + 'MobileApp/Mobile/receive_document',
                data,
              )
              .then(async response => {
        

             

                if (response.data['Message'] == 'true') {
                    
                  // push notification
                  SocketConnection.socket.emit('push notification', {
                    channel: response.data['doc_info'][0].sender_office_code,
                    message:
                      data.info_division + ' sucessfully received the document',
                  });

                  Popup.show({
                    type: 'success',
                    title: 'Success!',
                    textBody: 'Successfully received the document',
                    buttonText: 'Go back to My Documents.',
                    okButtonStyle: styles.confirmButton,
                    okButtonTextStyle: styles.confirmButtonText,

                    callback: () => {
                      Popup.hide();
                      this.setState({isAppLoading: false});
                      this.navigateToRoot();
                    },
                  });
                } else {
                  Popup.show({
                    type: 'danger',
                    title: 'Error!',
                    textBody:
                      'Sorry you are not valid to receive this document.',
                    buttonText: 'I understand',
                    okButtonStyle: styles.confirmButton,
                    okButtonTextStyle: styles.confirmButtonText,

                    callback: () => {
                      Popup.hide();
                      this.setState({isAppLoading: false});
                    },
                  });
                }
              })
              .catch(err => {
                console.warn(err.response.data);
                this.setState({isAppLoading: false});
                Popup.hide();
              });
          } else {
            Popup.show({
              type: 'danger',
              title: 'Error!',
              textBody: 'No Internet Connection. Please try again. ',
              confirmText: 'I understand',
              okButtonStyle: styles.confirmButton,
              okButtonTextStyle: styles.confirmButtonText,

              callback: () => {
                this.setState({isAppLoading: false});
                Popup.hide();
              },
            });
          }
        });
      },
    });
  };

  render() {
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
                  <Text style={styles.titleValue}>
                    {item.sender_division}
                    {'\n'}
                    {item.sender_service}
                  </Text>
                </View>

                <View>
                  <Text style={styles.detailTitle}>Remarks:</Text>
                </View>
                <View style={styles.titleView}>
                  <Text style={styles.titleValue} >{item.remarks} 
                  
                  </Text>
                </View>
              </ScrollView>
            ))}
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
              onPress={this.handleReceive}>
              Receive
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
    fontSize: 14,    
    color: Colors.new_color_palette.title,
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
    backgroundColor: Colors.new_color_palette.orange,
  },
  saveText: {
    fontWeight: 'bold',
    color: Colors.light,
  },
  titleValue: {
    fontSize: 18,

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
    height: (Layout.window.height / 100) * 76,
    borderRadius: 15,
    minHeight: (Layout.window.height / 100) * 72
    
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
});
