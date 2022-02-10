import React, {Component} from 'react';
import {StyleSheet, FlatList, Text, View, TouchableOpacity} from 'react-native';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import {Fumi} from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import * as ipConfig from '../ipconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {createFilter} from 'react-native-search-filter';
import {Card} from 'react-native-paper';

import Loader from '../constants/Loader';
import TopTabNavigator from '../navigation/TopTabNavigator';
import * as Animatable from 'react-native-animatable';
import {Dropdown} from 'react-native-element-dropdown';
export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDropdown: false,

      data: [],
      isAppLoading: false,
      refreshing: false,
      currentPage: 1,
      selectedDocType: [],
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
      if (response.isConnected) {
        axios
          .get(ipConfig.ipAddress + 'MobileApp/Mobile/get_doc_type')
          .then(response => {
            if (response.data['Message'] == 'true') {
              

              response.data['doc_type'].unshift({type_id: 'All', type: 'All'});
              
              this.setState({data: response.data['doc_type']});

              this.setState({refreshing: false});
            }
          })
          .catch(error => {
            console.warn(error);
            this.setState({refreshing: false});
          });
      } else {
      }
    });
  };

  componentDidMount() {
    this.setState({refreshing: true});

    this.handleRefreshData();
  }

  render() {
    return (
      <View style={styles.container}>
        <Animatable.View
          animation="slideInLeft"
          easing="ease-in-out"
     
          delay={500}>
          <Fumi
            label={'Search by tracking number'}
            iconClass={FontAwesomeIcon}
            iconName={'search'}
            iconColor={Colors.new_color_palette.orange}
            iconSize={20}
            iconWidth={40}
            inputPadding={16}
            style={[
              styles.searchTextInput,
              {
                borderColor:
                  this.state.isFocus == true
                    ? Colors.new_color_palette.blue
                    : Colors.new_color_palette.divider,
                
              },
            ]}
            onBlur={() => this.setState({isFocus: false})}
            onFocus={() => this.setState({isFocus: true})}
            onChangeText={value => this.setState({search: value})}
            keyboardType="email-address"
          />
        </Animatable.View>

        <View style={{flex: 1, top: (Layout.window.height / 100) * 10}}>
          <Dropdown
            style={styles.dropDown}
            data={this.state.data}
            search
            maxHeight={300}
            containerStyle={{color: Colors.new_color_palette.title}}
            selectedTextStyle={{
              color: Colors.new_color_palette.title,
              left: 25,
            }}
            placeholderStyle={{color: Colors.new_color_palette.title, left: 25}}
            labelField="type"
            valueField="type_id"
            placeholder="Filter by type of document"
            searchPlaceholder="Search..."
            onChange={item => this.setState({selectedDocType: item})}
            renderLeftIcon={() => (
              <FontAwesome
                color="black"
                name="file-text"
                color={Colors.new_color_palette.blue}
                size={20}
                style={{left: 20}}
              />
            )}
          />

          <TopTabNavigator docType={this.state.selectedDocType} searchValue={this.state.search} />
        </View>
      </View>
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

  searchTextInput: {
    borderRadius: 10,
    width: (Layout.window.width / 100) * 95,
    borderWidth: 1,
    borderColor: '#ddd',
    top:(Layout.window.height / 100) * 10 ,
    left: 10,
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
    paddingBottom: (Layout.window.height / 100) * 15,
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
  viewButton: {
    left: 30,
    borderWidth: 1,
    borderColor: Colors.new_color_palette.orange,
    width: (Layout.window.width / 100) * 20,
    borderRadius: 20,
  },
  filterButton: {
    alignItems: 'center',
    borderColor: Colors.new_color_palette.blue,
    borderWidth: 1,
    width: (Layout.window.width / 100) * 20,
    borderRadius: 20,
    marginLeft: 20,
  },
  dropDown: {
    borderWidth: 1,
    borderRadius: 10,
    top: (Layout.window.height / 100) * 1,
    flexGrow: 0,
    zIndex: 1,
    left: 10,
    width: (Layout.window.width / 100) * 95,
    borderColor: Colors.new_color_palette.divider,
  },
});
