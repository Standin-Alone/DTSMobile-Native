import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  RefreshControl,
  FlatList,
} from 'react-native';

import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import Loader from '../constants/Loader';
import Icon from 'react-native-vector-icons/FontAwesome';

import Timeline from 'react-native-timeline-flatlist';
import NetInfo from '@react-native-community/netinfo';
import Spinner from 'react-native-spinkit';
import axios from 'axios';
import * as ipConfig from '../ipconfig';
import {Card} from 'react-native-paper';
export default class HistoryScreen extends Component {
  constructor(props) {
    super(props);

    console.warn(this.props.route.params);
    this.state = {
      isLoading: false,
      refreshing: false,
      history: [],
      released_to: [],
      binded_doc_number:[],
      params: this.props.route.params,
      document_info: [],
      historyOptions: {
        headerTitle: 'Document History',
        headerTransparent: true,
        headerTitleStyle: styles.bottomTitle,
        headerTintColor: Colors.new_color_palette.orange,
      },
    };

    console.warn(this.props.route.params);
  }

  get_history = () => {
    this.setState({history: []});
    let document_number = this.state.params.document_info[0].document_number;

    axios
      .get(
        ipConfig.ipAddress + 'MobileApp/Mobile/get_history/' + document_number,
      )
      .then(response => {
        
        this.setState({
          history: response.data['history'],
          released_to: response.data['released_to'],
          document_info: response.data['document_info'],
          binded_doc_number: response.data['binded_doc_number'],
          refreshing: false,
        });
      })
      .catch(error => {
        console.warn(error.response.data);
      });
  };

  componentDidMount() {
    this.props.navigation.setOptions(this.state.historyOptions);
    this.get_history();
  }

  onEndReached = () => {
    //fetch next data
  };

  renderFooter = () => {};

  render_timeline = (rowData, index) => {
    
    let get_current_index = index + 1;
    return (
      <View style={{flex: 1}}>
        <Text
          style={[
            [
              styles.cardHeader,
              {
                backgroundColor: 'white',
                alignSelf: 'flex-start',
                padding: 10,
                borderRadius: 20,
                color:
                  rowData.type == 'Released'
                    ? Colors.primary
                    : rowData.rcl_status == 1
                    ? Colors.green
                    : Colors.danger,
                borderColor:
                  rowData.type == 'Released'
                    ? Colors.primary
                    : rowData.rcl_status == 1
                    ? Colors.green
                    : Colors.danger,
                borderWidth: 1,
                marginBottom: 20,
              },
            ],
          ]}>
          {' '}
          <Icon
            name={
              rowData.type == 'Released'
                ? 'envelope-open-o'
                : rowData.rcl_status == 1
                ? 'check-circle-o'
                : 'exclamation-triangle'
            }
            size={10}
            color={
              rowData.type == 'Released'
                ? Colors.primary
                : rowData.rcl_status == 1
                ? Colors.green
                : Colors.danger
            }
          />{' '}
          {rowData.rcl_status == 1
            ? rowData.type + ' By'
            : 'Not Authorize to Receive'}
        </Text>
        <Text style={[styles.cardHeader]}>
          {' '}
          <Icon
            name="user"
            size={10}
            color={Colors.color_palette.orange}
          />{' '}
          {rowData.transacting_user_fullname} {'\n'}
        </Text>
        <Text style={[styles.cardHeader]}>
          {' '}
          <Icon
            name="building"
            size={10}
            color={Colors.color_palette.orange}
          />{' '}
          {rowData.INFO_SERVICE} {'\n'} {rowData.INFO_DIVISION} {'\n'}
        </Text>
        {rowData.type == 'Released' ? (
          <Text style={styles.cardHeader}>
            {' '}
            <Icon
              name="wechat"
              size={10}
              color={Colors.color_palette.orange}
            />{' '}
            {rowData.rcl_remarks == null ? 'None' : rowData.rcl_remarks}  {'\n'} 
          </Text>
        ) : null}

        {/* show processing display when document current status is receive */}
        {rowData.type == 'Received' && index == 0 && this.state.params.document_info[0].status != 'Archived' && rowData.rcl_status == 1 ? (
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Spinner
                isVisible={true}
                size={16}
                type={'ChasingDots'}
                color={Colors.primary}
                style={{justifyContent: 'flex-start'}}
              />
            </View>

            <View style={{flex: 1}}>
              <Text
                style={[
                  [
                    styles.cardHeader,
                    {justifyContent: 'flex-end', right: (Layout.window.width / 100) * 22, top: 2},
                  ],
                ]}>
                Processing 
              </Text>
            </View>
          </View>
        ) :null }
        {rowData.type == 'Released' ? (
          <View>
            {/* <Text
            style={[
              [
                styles.cardHeader,
                {
                  backgroundColor: 'white',
                  alignSelf: 'flex-start',
                  padding: 10,
                  borderRadius: 20,
                  color:
                    rowData.type == 'Released' ? Colors.primary : rowData.rcl_status == 1 ? Colors.green : Colors.danger ,
                  borderColor:
                    rowData.type == 'Released' ? Colors.primary : rowData.rcl_status == 1 ? Colors.green : Colors.danger,
                  borderWidth: 1,
                  marginBottom: 20,
                },
              ],
            ]}>

            {' '}         
            {rowData.type == 'Released' ?  'To the following:'  : 'Not Authorize to Receive'}

          </Text>         */}

            {/*  list of next recipients */}
            {/* <FlatList
              data={this.state.released_to}
              renderItem={({item,index}) =>
              
               <Text style={styles.released_to_style}>{index+1}. {item.INFO_DIVISION}</Text>}
          /> */}
          </View>
        ) : null}
      </View>
    );
  };

  render() {

    // design start here
    return (
      <View style={styles.container}>
      
          {/* list binded doc number */}
          {/* check if it has binded document number */}
          {this.state.binded_doc_number.length > 0 && 
            <Card
            style={{
              width: (Layout.window.width / 100) * 95,
              marginTop: (Layout.window.height / 100) * 10,
              height: (Layout.window.height / 100) * 10,
              backgroundColor: Colors.light,
              overflow:'hidden'
       
            }}   
            elevation={2}
            >
            <Card.Title
              title= {<Text style={styles.binded_doc_number_title}>Binded Document Number: </Text>}                    
              titleStyle={styles.binded_doc_number_title}
              subtitle={
                <FlatList
                  scrollEnabled
                  data={this.state.binded_doc_number}
                  
                  renderItem={({item,index})=>
                    <Text 
                      style={styles.binded_doc_number}
                    onPress={()=>{                  
                      // go to binded document number history
                      this.props.navigation.push('History', {
                        document_info: [{document_number:item.orig_doc_number}],
                      });
                
                    }}>{item.orig_doc_number}</Text>
                  }
                />
              }
              subtitleStyle={{top:5}}
              subtitleNumberOfLines={10}            
            />            
          </Card>
        }
        {/* document info card */}
        <Card
          style={{
            width: (Layout.window.width / 100) * 95,
            marginTop: (Layout.window.height / 100) * 5,
            backgroundColor: Colors.light,
          }}
          elevation={2}>
          <Card.Title
            title= {<Text>Document Number: </Text>}
            right= {()=>
              this.state.document_info.status == 'Archived' ?(
            <Text style={styles.right}>  <Icon
              name={
                'check'
              }
              size={15}
              color={
               Colors.green
              }
            />
                Completed
            </Text> ): null }
            
            titleStyle={styles.title}
            subtitle={this.state.params.document_info[0].document_number}
            subtitleStyle={styles.subtitle}
            subtitleNumberOfLines={10}
          />
          <Card.Content>

            
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    justifyContent: 'flex-start',
                    fontFamily: 'Gotham_bold',
                  }}>
                  Document Type:
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={{justifyContent: 'flex-end', right: 60,fontWeight:'bold'}}>
                  {' '}
                  {this.state.document_info.type}
                </Text>
              </View>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    justifyContent: 'flex-start',
                    fontFamily: 'Gotham_bold',
                  }}
                  numberOfLines={2}>
                  Origin Type:{' '}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={{justifyContent: 'flex-end', right: 60,fontWeight:'bold'}}>
                  {this.state.document_info.origin_type}{' '}
                </Text>
              </View>
            </View>

            {/* if the origin type is external */}
            {this.state.document_info.origin_type == 'External' && (
              <View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        justifyContent: 'flex-start',
                        fontFamily: 'Gotham_bold',
                      }}
                      numberOfLines={2}>
                      Sender Name:{' '}
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{justifyContent: 'flex-end', right: 60,fontWeight:'bold'}}>
                      {this.state.document_info.sender_name}{' '}
                    </Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        justifyContent: 'flex-start',
                        fontFamily: 'Gotham_bold',
                      }}
                      numberOfLines={2}>
                      Sender Name:{' '}
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{justifyContent: 'flex-end', right: 60,fontWeight:'bold'}}>
                      {this.state.document_info.sender_name}{' '}
                    </Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        justifyContent: 'flex-start',
                        fontFamily: 'Gotham_bold',
                      }}
                      numberOfLines={2}>
                      Sender Position:{' '}
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{justifyContent: 'flex-end', right: 60,fontWeight:'bold'}}>
                      {this.state.document_info.sender_position}{' '}
                    </Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        justifyContent: 'flex-start',
                        fontFamily: 'Gotham_bold',
                      }}
                      numberOfLines={2}>
                      Sender Address:{' '}
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{justifyContent: 'flex-end', right: 60,fontWeight:'bold'}}>
                      {this.state.document_info.sender_address}{' '}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    justifyContent: 'flex-start',
                    fontFamily: 'Gotham_bold',
                  }}>
                  Title:
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{justifyContent: 'flex-end', right: 60,fontWeight:'bold'}}
                  numberOfLines={100}>
                  {this.state.document_info.subject}{' '}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        <View style={styles.innerContainer}>
          <Timeline
            data={this.state.history}
            dotSize={10}
            options={{
              refreshControl: (
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.get_history}
                />
              ),
              renderFooter: this.renderFooter,
              onEndReached: this.onEndReached,
            }}
            renderDetail={this.render_timeline}
            showTime={true}
            innerCircle={'dot'}
            style={styles.timeline}
            detailContainerStyle={styles.cards}
            timeContainerStyle={{minWidth: 52, marginTop: -5}}
            listViewContainerStyle={{
              paddingTop: 20,
              paddingBottom: (Layout.window.height / 100) * 10,
              
              
              
            }}
            timeStyle={styles.time}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.new_color_palette.main_background,
  },

  innerContainer: {
    top: 5,
    width: (Layout.window.width / 100) * 95,
    height: (Layout.window.height / 100) * 80,
    
    // backgroundColor:'yellow'
  },
  timeline: {
    // backgroundColor:'red',
    
    top: 20,
    width: (Layout.window.width / 100) * 95,
    
  },
  cardHeader: {
    fontWeight: 'bold',
    fontSize: 10,
    color: Colors.new_color_palette.text,
  },
  cards: {
    backgroundColor: Colors.new_color_palette.second_background,
    width: (Layout.window.width / 100) * 60,
    marginBottom: 30,
    borderRadius: 10,
    paddingLeft: 20,
    elevation: 20,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },

  time: {
    fontSize: 10,
    width: 90,
    textAlign: 'center',
    borderColor: Colors.new_color_palette.yellow,
    backgroundColor: 'white',
    borderWidth: 1,
    color: Colors.new_color_palette.yellow,
    padding: 7,
    borderRadius: 13,
  },
  title: {
    color: '#050A0D',
    fontSize: 12,
    fontWeight: 'bold',
  },

  right: {
    right:(Layout.window.width / 100) * 2,
    bottom:(Layout.window.height / 100) * 2,
    color: Colors.green,
    fontSize: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.new_color_palette.orange,
    fontSize: 16,
    fontWeight: 'bold',
  },
  binded_doc_number: {
    color: Colors.new_color_palette.blue,
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  binded_doc_number_title: {
    
    fontSize: 12,
    fontWeight: 'bold',
  },
  released_to_style: {
    fontSize: 10,
  },
});
