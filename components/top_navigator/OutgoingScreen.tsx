import React, {Component} from 'react';
import {StyleSheet, FlatList, Text, View, TouchableOpacity} from 'react-native';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import {Fumi} from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import * as ipConfig from '../../ipconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {createFilter} from 'react-native-search-filter';
import {Card} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Moment from 'react-moment';
import Loader from '../../constants/Loader';
import { withNavigation } from 'react-navigation';
export default class OutgoingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isAppLoading: false,
      refreshing: false,
      currentPage: 1,
      search: '',
      KEYS_TO_FILTERS: ['document_number'],
      spinner: {
        isVisible: true,
        color: Colors.light,
        size: 60,
      },
    };
    

  }

  handleRefreshData = async () => {
    let user_id = await AsyncStorage.getItem('user_id');
      
    NetInfo.fetch().then(async response => {
      let payload = {
        office_code: await AsyncStorage.getItem('office_code'),
        current_page: 1,
      };
      console.warn(payload.office_code)
      if (response.isConnected) {
        axios
          .get(ipConfig.ipAddress + 'MobileApp/Mobile/outgoing_documents/'+payload.office_code)
          .then(response => {
            
            if (response.data['Message'] == 'true') {
              console.warn(response);
              this.setState({data: response.data['doc_info']});
              this.setState({refreshing: false});
            }
          })
          .catch(error => {
            console.warn(error);
            this.setState({refreshing: false});
          });
      }
    });
  };

  componentDidMount() {
    this.setState({refreshing: true});
    this.handleRefreshData();
  }

  handleRenderItem = ({item}) => (

    this.props.docType == 'All'  ||  this.props.docType == undefined  ?
    <Animatable.View  animation="slideInDown" duration={1000}>
      <Card
        style={{
          width: (Layout.window.width / 100) * 95,
          left: 10,
          marginTop: 20,
          backgroundColor: Colors.new_color_palette.main_background,
          borderRadius: 20,
          borderWidth: 1,
        }}
        elevation={0}>
        <Card.Title
          title={item.document_number}
          titleStyle={styles.documentNumber}
          subtitle={'Subject: ' + item.subject}
          subtitleNumberOfLines={10}
          left={() => (
            <FontAwesome5
              name="file-upload"
              size={30}
              color={Colors.new_color_palette.blue}
            />
          )}
          right={() => (
            <FontAwesome5
              name="eye"
              size={30}
              color={Colors.new_color_palette.orange}
              onPress={() =>
              
                this.props.navigation.navigate('History', {
                  document_info: [item],
                })
              }
            />
          )}
          rightStyle={{right: 10}}
        />

      <Card.Content>
        <Moment element={Text}  
              style={{left: (Layout.window.width / 100) * 12,color:Colors.warning, fontSize:10}}
              fromNow>{ item.log_date}</Moment>
      </Card.Content>
      </Card>
    </Animatable.View>
    :  this.props.docType == item.document_type   ?
    <Animatable.View  animation="slideInDown" duration={1000}>
    <Card
      style={{
        width: (Layout.window.width / 100) * 95,
        left: 10,
        marginTop: 20,
        backgroundColor: Colors.new_color_palette.main_background,
        borderRadius: 20,
        borderWidth: 1,
      }}
      elevation={0}>
      <Card.Title
        title={item.document_number}
        titleStyle={styles.documentNumber}
        subtitle={'Subject: ' + item.subject}
        subtitleNumberOfLines={10}
        left={() => (
          <FontAwesome5
            name="file-upload"
            size={30}
            color={Colors.new_color_palette.blue}
          />
        )}
        right={() => (
          <FontAwesome5
            name="eye"
            size={30}
            color={Colors.new_color_palette.orange}
            onPress={() =>
              this.props.navigation.navigate('History', {
                document_info: [item],
              })
            }
          />
        )}
        rightStyle={{right: 10}}
      />
       <Card.Content>
        <Moment element={Text}  
              style={{left: (Layout.window.width / 100) * 12,color:Colors.warning, fontSize:10}}   
              fromNow>{ item.log_date}</Moment>
      </Card.Content>
    </Card>
  </Animatable.View> 
    :null
            
  
  );

  // old  render item
  // handleRenderItem = ({item}) => (
  //   <View style={styles.card}>
  //     <View style={{flexDirection: 'row', width: '100%'}}>
  //       <FontAwesome
  //         name="file"
  //         size={50}
  //         color={Colors.color_palette.orange}
  //         style={{marginLeft: 60, top: 10, right: 0, left: 0}}
  //       />
  //       <Text style={styles.documentNumber} adjustsFontSizeToFit>
  //         {item.document_number}
  //       </Text>
  //       <TouchableOpacity

  //         style={styles.viewButton}
  //         onPress={() =>{

  //           this.props.navigation.navigate('History', {document_info: [item]})

  //         }
  //         }>
  //         <Text style={styles.viewHistory}>View</Text>

  //       </TouchableOpacity>
  //     </View>
  //     <Text
  //       style={{
  //         left: 115,
  //         fontSize: 10,
  //         bottom: 20,
  //         color: Colors.new_color_palette.text,
  //       }}
  //       adjustsFontSizeToFit>
  //       {item.subject}
  //     </Text>
  //     <Text>{'\n'}</Text>
  //     <View
  //       style={{
  //         borderBottomWidth: 2,
  //         borderBottomColor: Colors.new_color_palette.divider,
  //       }}></View>
  //   </View>
  // );

  //this component will show if flatlist is empty
  emptyComponent = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>You have no outgoing documents.</Text>
    </View>
  );



  render() {
    const filteredDocuments = this.state.data.filter(
      createFilter(this.props.searchValue, this.state.KEYS_TO_FILTERS),
    );

    return (
      <Animatable.View
        style={styles.container}
        delay={1000}
        animation="fadeInDownBig"
        duration={2000}>
        <FlatList
          nestedScrollEnabled
          maxToRenderPerBatch={8}
          windowSize={11}
          initialNumToRender={8}
          scrollEnabled
          data={this.state.data ? filteredDocuments : null}
          renderItem={this.handleRenderItem}
          extraData={this.state.data}
          style={{top: 30, height: 100}}
          ListEmptyComponent={() => this.emptyComponent()}
          contentContainerStyle={styles.flatListContainer}
          onRefresh={this.handleRefreshData}
          refreshing={this.state.refreshing}
      
        />
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
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
    height: (Layout.window.height / 100) * 20,
    minHeight: (Layout.window.height / 100) * 30,
    right: 40,
    // backgroundColor:Colors.color_palette.base
  },
  documentNumber: {
    color: Colors.new_color_palette.title,
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewHistory: {
    top: 15,
    color: Colors.new_color_palette.yellow,
    fontSize: 15,

    alignSelf: 'center',
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
    paddingBottom: (Layout.window.height / 100) * 35,
  },
  empty: {
    top: 40,
    left: (Layout.window.height / 100) * 3,
  },
  emptyText: {
    color: Colors.new_color_palette.text,
    fontSize: 23,
    fontWeight: 'bold',
  },
  viewButton: {
    left: 30,
    borderWidth: 1,
    borderColor: Colors.new_color_palette.orange,
    width: (Layout.window.width / 100) * 20,
    borderRadius: 20,
  },
  view: {},
});
