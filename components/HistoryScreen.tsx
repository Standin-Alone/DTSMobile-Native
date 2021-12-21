import React, {Component} from 'react';
import {StyleSheet, Text, View, Pressable, RefreshControl} from 'react-native';

import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import Loader from '../constants/Loader';
import Icon from 'react-native-vector-icons/FontAwesome';

import Timeline from 'react-native-timeline-flatlist';
import NetInfo from '@react-native-community/netinfo';

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
      params: this.props.route.params,
      historyOptions: {
        headerTitle: 'Document History',
        headerTransparent: true,
        headerTitleStyle: styles.bottomTitle,
        headerTintColor: Colors.new_color_palette.orange,
      },
    };

    console.warn(this.props.route.params)
  }

  get_history = () => {
    this.setState({history:[]});
    let document_number = this.state.params.document_info[0].document_number;

    axios
      .get(
        ipConfig.ipAddress + 'MobileApp/Mobile/get_history/' + document_number,
      )
      .then(response => {
        this.setState({history: response.data['history'], refreshing: false});
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
                  rowData.type == 'Released' ? Colors.primary : rowData.rcl_status == 1 ? Colors.green : Colors.danger ,
                borderColor:
                  rowData.type == 'Released' ? Colors.primary : rowData.rcl_status == 1 ? Colors.green : Colors.danger,
                borderWidth: 1,
                marginBottom: 20,
              },
            ],
          ]}>

          {' '}
          <Icon
            name={rowData.type == 'Released' ? 'envelope-open-o' :  rowData.rcl_status == 1 ? 'check-circle-o' : 'exclamation-triangle'}
            size={10}
            color={rowData.type == 'Released' ? Colors.primary : rowData.rcl_status == 1 ? Colors.green : Colors.danger}
          />{' '}
          {rowData.rcl_status == 1 ? rowData.type + ' By'  : 'Not Authorize to Receive'}
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
        <Text style={styles.cardHeader}>
          {' '}
          <Icon
            name="building"
            size={10}
            color={Colors.color_palette.orange}
          />{' '}
          {rowData.INFO_SERVICE} {'\n'} {rowData.INFO_DIVISION} {'\n'}
        </Text>
        {rowData.type == 'Released'  ?
        <Text style={styles.cardHeader}>
          {' '}
          
          <Icon
            name="wechat"
            size={10}
            color={Colors.color_palette.orange}
          />{' '}
          {rowData.rcl_remarks == null ? 'None' : rowData.rcl_remarks} {'\n'}
        </Text>
        : null
        }
      </View>
    );
  };

  render() {
    // design start here
    return (
      <View style={styles.container}>

      <Card style={{width:(Layout.window.width / 100) * 95,marginTop:(Layout.window.height / 100) * 5,backgroundColor:Colors.light}} elevation={2}>
            <Card.Title           
                title= {'Document Number:'}
                titleStyle = {styles.title}
                subtitle={this.state.params.document_info[0].document_number}
                subtitleStyle={styles.subtitle}
                subtitleNumberOfLines={10}     
                           
                
            />
                            
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
  subtitle: {    
    color: Colors.new_color_palette.orange,
    fontSize: 16,
    fontWeight: 'bold',
  }
});
