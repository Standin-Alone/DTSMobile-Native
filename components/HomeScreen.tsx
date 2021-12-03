import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import {Fumi} from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import * as ipConfig from '../ipconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Card} from 'react-native-elements';
import PushNotification from 'react-native-push-notification';
import {Alert} from 'react-native';
import io from 'socket.io-client';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: false,
      currentPage: 1,
    };
  }

  handleRefreshData = async () => {
    let user_id = await AsyncStorage.getItem('user_id');

    NetInfo.fetch().then(async response => {
      let payload = {
        office_code: await AsyncStorage.getItem('office_code'),
      };
      if (response.isConnected) {
        axios
          .post(ipConfig.ipAddress + 'MobileApp/Mobile/my_documents', payload)
          .then(response => {
            if (response.data['Message'] == 'true') {
              response.data['doc_info'].map(item => {
                this.setState({
                  data: [
                    {
                      document_number: item.document_number,
                      info_region: item.info_region,
                      type: item.type,
                      subject: item.subject,
                      status: item.active,
                    },
                  ],
                });
              });
              this.setState({refreshing: false});
            }
          })
          .catch(error => {
            console.warn(error.response.data);
            console.warn(error.response);
            this.setState({refreshing: false});
          });
      }
    });
  };

  componentDidMount() {
    let socket = io('http://172.17.150.112' + ':7980', {
      transports: ['websocket'],
    });
    socket.on('connect', msg => {
      socket.on('get notification', async message => {
        let user_id = await AsyncStorage.getItem('user_id');
        if (message.channel == user_id) {
          console.warn('connected');

          // create channel for notification
          PushNotification.createChannel({
            channelId: message.channel,
            channelName: message.channel,
            soundName: 'default',
            importance: 4,
            vibrate: true,
          });

          // create channel for notification
          PushNotification.localNotification({
            channelId: message.channel, // (required)
            channelName: message.channel,
            autoCancel: true,

            subText: 'Local Notification Demo',
            title: 'Document Tracking System',
            message: message.message,
            vibrate: true,
            vibration: 300,
            playSound: true,
            soundName: 'default',
          });
        }
      });
    });

    socket.on('connect_error', err => {
      console.warn(err);
    });

    this.setState({refreshing: true});
    this.handleRefreshData();
  }

  // old render item
  // handleRenderItem = ({item}) =>(
  //     <View style={styles.card}>
  //         <Text style={styles.documentNumber}>{item.document_number}</Text>
  //         <Text style={styles.documentTypeLabel}>Document Type</Text>
  //         <Text style={styles.itemValue}>{item.type}</Text>
  //         <Text style={styles.documentTypeLabel}>Subject</Text>
  //         <Text style={styles.itemValue}>{item.subject}</Text>
  //         <Text style={styles.documentTypeLabel}>Status</Text>
  //         <Text style={styles.itemValue}>{item.status}</Text>
  //         <Text>{'\n'}</Text>
  //         <View style={{borderBottomWidth:2,borderBottomColor:Colors.new_color_palette.divider}}></View>
  //     </View>
  // )

  handleRenderItem = ({item}) => (
    <View style={styles.card}>
      <View style={{flexDirection: 'row', width: '100%'}}>
        <FontAwesome
          name="file"
          size={50}
          color={Colors.color_palette.orange}
          style={{marginLeft: 60, top: 10, right: 0, left: 0}}
        />
        <Text style={styles.documentNumber} adjustsFontSizeToFit>
          {item.subject}
        </Text>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('History', {document_info: [item]})
          }>
          <Text style={styles.viewHistory}>View</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          left: 115,
          fontSize: 10,
          bottom: 20,
          color: Colors.new_color_palette.text,
        }}
        adjustsFontSizeToFit>
        {item.subject}
      </Text>
      <Text>{'\n'}</Text>
      <View
        style={{
          borderBottomWidth: 2,
          borderBottomColor: Colors.new_color_palette.divider,
        }}></View>
    </View>
  );

  //this component will show if flatlist is empty
  emptyComponent = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>You have no documents received.</Text>
    </View>
  );

  loadMore = () => {
    // let addPage = this.state.currentPage + 1;
    // const supplier_id = await AsyncStorage.getItem("supplier_id");
    // NetInfo.fetch().then((response: any) => {
    //   if (response.isConnected) {
    //     axios
    //       .get(
    //         ip_config.ip_address + "evoucher/api/get-scanned-vouchers/"+supplier_id+"/"+addPage
    //       )
    //       .then((response) => {
    //         if (response.status == 200) {
    //           if(response.data.length){
    //             let new_data = response.data;
    //             setScannedVouchers([...scannedVouchers,new_data[0]]);
    //           }
    //         }
    //         setRefreshing(false);
    //       })
    //       .catch((error) => {
    //         Alert.alert('Error!','Something went wrong.')
    //         console.warn(error.response);
    //         setRefreshing(false);
    //       });
    //   } else {
    //     Alert.alert("Message", "No Internet Connection.");
    //   }
    // });
  };

  render() {
    return (
      <View style={styles.container}>
        <Fumi
          label={'Search by tracking number'}
          iconClass={FontAwesomeIcon}
          iconName={'search'}
          iconColor={Colors.new_color_palette.orange}
          iconSize={20}
          iconWidth={40}
          inputPadding={16}
          style={styles.searchTextInput}
          keyboardType="email-address"
        />

        <View style={{flex: 1}}>
          <View style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>
            <View style={styles.documentsContainer}>
              <FlatList
                scrollEnabled
                data={this.state.data}
                renderItem={this.handleRenderItem}
                style={{top: 20, height: 100}}
                ListEmptyComponent={() => this.emptyComponent()}
                contentContainerStyle={styles.flatListContainer}
                onRefresh={this.handleRefreshData}
                refreshing={this.state.refreshing}
                onEndReachedThreshold={0.1} // so when you are at 5 pixel from the bottom react run onEndReached function
                onEndReached={async ({distanceFromEnd}) => {
                  if (distanceFromEnd > 0) {
                    await setCurrentPage(prevState => prevState + 1);
                    loadMore();
                  }
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.new_color_palette.blue_background,
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
  documentsContainer: {
    bottom: 0,
    width: (Layout.window.width / 100) * 102,
    height: (Layout.window.height / 100) * 75,
    right: (Layout.window.width / 100) * 50,
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    backgroundColor: Colors.new_color_palette.main_background,
  },
  searchTextInput: {
    top: 100,
    borderRadius: 40,
    width: (Layout.window.width / 100) * 90,
    position: 'absolute',
  },
  card: {
    top: 20,
    width: (Layout.window.width / 100) * 120,
    height: (Layout.window.height / 100) * 30,
    minHeight: (Layout.window.height / 100) * 30,
    right: 40,
    // backgroundColor:Colors.color_palette.base
  },
  documentNumber: {
    top: 5,
    color: Colors.new_color_palette.text,
    fontSize: 15,
    fontWeight: 'bold',
    left: 10,
  },
  viewHistory: {
    top: 20,
    color: Colors.new_color_palette.yellow,
    fontSize: 15,
    alignSelf: 'flex-end',
  },
  documentTypeLabel: {
    top: 5,
    color: Colors.new_color_palette.text,
    fontSize: 18,
    fontWeight: 'bold',
    left: 60,
  },
  itemValue: {
    color: Colors.new_color_palette.text,
    fontSize: 14,
    left: 80,
  },
  flatListContainer: {
    flexGrow: 0,
    paddingBottom: 90,
  },
  empty: {
    top: 5,
    left: (Layout.window.height / 100) * 3,
  },
  emptyText: {
    color: Colors.new_color_palette.text,
    fontSize: 23,
    fontWeight: 'bold',
  },
});
