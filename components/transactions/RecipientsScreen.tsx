import React, {Component, useRef} from 'react';
import {StyleSheet, Text, View, Pressable, ScrollView} from 'react-native';
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
import {createFilter} from 'react-native-search-filter';
import ModalSelector from 'react-native-modal-selector';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {Card, List} from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';


export default class RecipientsScreen extends Component {
  constructor(props) {
    super(props);
    console.warn(this.props.route.params);
    this.state = {
      offices_loading: true,
      selected_action:'Set Action',
      recipients: [],
      selectedRecipients: [],
      isLoading: false,
      hasPermission: false,
      params: this.props.route.params,
      isAppLoading: false,
      defaultRecipients: [],
      default_recipients_info:[],
      openActionPicker: false,
      openSelectRecipient: false,
      ref: null,
      actions: [
        {key: 0, section: true, label: 'Select Action'},
        {key: 1, label: 'Approved'},
        {key: 2, label: 'Disapproved'},
        {key: 3, label: 'Endorsed'},
        {key: 4, label: 'Return to Sender'},
        {key: 5, label: 'No Action'},
      ],
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
        searchTextInput: {
          color: '#050A0D',
        },
        chipContainer: {
          left: 15,
          width: (Layout.window.width / 100) * 85,
          height: 100,
          padding: 20,
          backgroundColor: Colors.new_color_palette.main_background,
        },
        chipsWrapper: {
          top: 30,
          height: (Layout.window.height / 100) * 80,
          overflow: 'scroll',
          marginBottom:100,
        },
        button: {backgroundColor: Colors.new_color_palette.yellow},
        selectToggle: {
          display:'none',
          borderRadius: 20,
          width: (Layout.window.width / 100) * 85,
          padding: 20,
          left: 20,
          borderWidth: 1,
          borderColor: Colors.new_color_palette.orange,
          backgroundColor: 'white',    
        },
        
      },
    };
  }


get_offices = async()=>{

  let document_number = this.state.params.document_info[0].document_number;
  let my_office_code = await AsyncStorage.getItem('office_code');
  axios
    .get(
      ipConfig.ipAddress +
        'MobileApp/Mobile/get_offices/' +
        document_number +
        '/' +
        my_office_code,
    )
    .then(response => {
      
      this.setState({isAppLoading: false,offices_loading:false});

      let clean_office = response.data['offices'].filter((item)=>item.children.length != 0)
      console.log(response.data['default_recipients_info']);
      this.setState({recipients: clean_office});
      this.setState({
        defaultRecipients: response.data['default_recipients'],
        default_recipients_info: response.data['default_recipients_info'],            
      });
            
      
    }).catch(err=>{this.setState({isAppLoading: false})
    console.warn(err.response.data)
  });

  }
 async componentDidMount() {

    this.setState({isAppLoading:true});
    this.props.navigation.addListener('focus', async () => {
      this.get_offices();

      
    });

    this.props.navigation.setOptions(this.state.receiveFormOptions);
    this.setState({isAppLoading: false});
  }

  emptyComponent = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>No other recipients.</Text>
    </View>
  );



  // handle  go to review release screen
  handleGoToReviewReleaseScreen = async () => {
    let selectedRecipients = this.state.selectedRecipients;
    let defaultRecipients = this.state.defaultRecipients;
    console.warn(this.state.params.base64_files);
    
    this.setState({isAppLoading: true});
    // check if the action is not set action and return to se  nder
    if(this.state.selected_action != 'Set Action' || this.state.selected_action == 'Return to Sender' ){


      if(this.state.selectedRecipients.length == 0 && this.state.default_recipients_info.length  != 0 ){


          
        this.props.navigation.push('ReviewRelease', {
          document_info: this.state.params.document_info,
          base64_files: this.state.params.base64_files,
          selectedRecipients: defaultRecipients.concat(selectedRecipients),
          action: this.state.selected_action
        });

      }else if (this.state.selectedRecipients.length == 0 && this.state.default_recipients_info.length  == 0 &&  this.state.selected_action != 'Return to Sender' ){
        this.setState({isAppLoading: false});
        Popup.show({
          type: 'danger',              
          title: 'Warning!',
          textBody: "Please select Recipients.",                
          buttonText:'Ok',
          okButtonStyle:styles.confirmButton,
          okButtonTextStyle: styles.confirmButtonText,
          callback: () => {    
            
            Popup.hide()                                    
          },              
        })
      }else{

        this.props.navigation.push('ReviewRelease', {
          document_info: this.state.params.document_info,
          base64_files: this.state.params.base64_files,
          selectedRecipients: defaultRecipients.concat(selectedRecipients),
          action: this.state.selected_action
        });

      }
      
      
    }else{
      
      this.setState({isAppLoading: false});
      Popup.show({
        type: 'danger',              
        title: 'Warning!',
        textBody: "Please set action first.",                
        buttonText:'Ok',
        okButtonStyle:styles.confirmButton,
        okButtonTextStyle: styles.confirmButtonText,
        callback: () => {    
          
          Popup.hide()                                    
        },              
      })
      
    }
    


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
            currentPosition={2}
            labels={StepIndicatorStyle.labels}
            renderStepIndicator={this.renderStepIndicator}
          />
        </View>
        <View style={styles.innerContainer}>
        <Button
              textStyle={styles.select_action}
              style={{
                borderColor: Colors.new_color_palette.blue_background,
                backgroundColor: Colors.new_color_palette.blue,
              }}
              activityIndicatorColor={'white'}
              isLoading={this.state.isLoading}
              disabledStyle={{opacity: 1}}
              onPress={() =>
                this.setState({
                  openActionPicker:
                    this.state.openActionPicker == false ? true : false,
                })
              }>
              {this.state.selected_action}
            </Button>
            <Text style={styles.list_of_recipients_title}>
                <FontAwesome
                    name="info-circle"
                    size={18}
                    color={Colors.color_palette.orange}
                  /> Additional Recipients


                  
            </Text>

            {this.state.selected_action != 'Return to Sender' && this.state.selected_action != 'Set Action' ?

                <FontAwesome
                name="edit"
                size={18}
                color={Colors.new_color_palette.blue}                    
                style={{left:(Layout.window.width /100 ) * 85,bottom:(Layout.window.height /100 ) * 0.5}}                    
                onPress={()=>this.refs.multiSelect._toggleSelector()}
                /> :
                null


            
            }
         

            
          <ScrollView style={styles.recipient_office_select} showsVerticalScrollIndicator>
            <ModalSelector
            
              data={this.state.actions}
              onChange={option => {
                console.warn(option.label);
                if(this.state.recipients.length == 0){
                  this.get_offices()
                }                

                if(option.label != 'Return to Sender'){
                  this.refs.multiSelect._toggleSelector();
                }else{

                  this.setState({selectedRecipients:[]});
                }
                
                
                this.setState({selected_action:option.label})
              }}
              visible={this.state.openActionPicker}
              initValue="Release"
              selectedItemTextStyle={styles.selectedText}
              initValueTextStyle={styles.saveText}
              selectStyle={[styles.saveButton, {display: 'none'}]}
              selectTextStyle={styles.saveText}
              optionTextStyle={{color: Colors.dark}}
              sectionTextStyle={{color: Colors.new_color_palette.orange}}
              onModalClose={() => {
                this.setState({openActionPicker: false});
              }}
            />

         
        
            <SectionedMultiSelect
              loading={this.state.offices_loading}
              ref="multiSelect"
              searchPlaceholderText="Search by Office or Division"
              items={this.state.recipients}
              IconRenderer={MaterialIcons}
              
              uniqueKey="id"
              subKey="children"
              selectText="Select recipients..."
              showDropDowns={true}
              readOnlyHeadings={true}
              onSelectedItemsChange={value => {
                console.warn(value);
                this.setState({selectedRecipients: value});
              }}
              showRemoveAll={true}
              filterItems={searchTerm => {
                console.warn(this.state.recipients);
                const filteredRecipients = this.state.recipients.filter(
                  (item, index) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
                );

                return filteredRecipients;
              }}
              selectedItems={this.state.selectedRecipients}
              highlightChildren={true}
              styles={this.state.multiSelectStyle}

            
            />
          </ScrollView>

          
   
        </View>


        {/* default recipients */}
        <Text style={styles.add_recipients_title}>
                <FontAwesome
                    name="info-circle"
                    size={18}
                    color={Colors.color_palette.orange}
                  /> Other Recipients
        </Text>
        
        <FlatList
          horizontal
          
          data={this.state.default_recipients_info}
          ListEmptyComponent={()=>this.emptyComponent()}
          renderItem={({item})=>(
            <Card style={styles.default_recipients_list}>
              <Card.Title title={item.info_division}  titleStyle={styles.info_service} 
                subtitle={item.info_service}
              />
              
            </Card>
          )}

          contentContainerStyle={styles.flatListContainer}
          
        />



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
  topButton: {
    width: 200,
    backgroundColor: Colors.new_color_palette.yellow,
    marginLeft: 15,
  },
  recipient_office_select: {
    height: (Layout.window.height / 100) * 27,    
    top: (Layout.window.height / 100) * 5,   
    paddingBottom:20 
  },
  select_action:{
    color:'white'
  },
  list_of_recipients_title:{
    color:Colors.light,
    fontWeight:'bold',
    fontSize:18,
    top: (Layout.window.height / 100) * 2,
  },
  default_recipients_title:{    
    bottom:(Layout.window.height / 100) * 23,
    
  },
  add_recipients_title:{
    top: (Layout.window.height / 100) * 20,
    color:Colors.light,
    fontWeight:'bold',
    fontSize:18,
  },
  empty: {
    
    backgroundColor:'white',
    width:(Layout.window.width / 100) * 90,
    padding:20,
    borderRadius:20,
    left: (Layout.window.height / 100) * 1,
  },
  emptyText: {
    color: Colors.new_color_palette.text,
    fontSize: 23,
    fontWeight: 'bold',
  },
  default_recipients_list:{    
    left:10,
    marginRight:20,
    width: (Layout.window.width / 100) * 92,
    height:(Layout.window.height / 100) *10,    
  },
  flatListContainer: {
    flexGrow: 0,
    top: (Layout.window.height / 100) * 23,
    paddingBottom: (Layout.window.height / 100) * 35,
    paddingRight: (Layout.window.height / 100) * 15,
    paddingTop:20,
        
  },
  info_service:{
    fontWeight:'bold',
    fontSize:14,
  }
});
