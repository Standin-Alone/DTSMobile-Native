import  React,{Component} from 'react';
import {StyleSheet,ScrollView,KeyboardAvoidingView,FlatList,Text,View} from 'react-native';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import { Fumi  } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import NetInfo from "@react-native-community/netinfo";
import axios from 'axios';
import * as ipConfig from '../ipconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class HomeScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            refreshing:false
        }
        
    }



    handleRefreshData =  () =>{

        NetInfo.fetch().then(async (response)=>{

            let payload = {        
              office_code : await AsyncStorage.getItem('office_code'),              
            } 
            if(response.isConnected){
              axios.post(ipConfig.ipAddress+'MobileApp/Mobile/my_documents',payload).then((response)=>{
      
                if(response.data['Message'] == 'true'){
                  console.warn( response.data['doc_info'])
                  
                  response.data['doc_info'].map((item)=>{
                    this.setState({data:[{
                      document_number: item.document_number,
                      type:  item.type,
                      subject: item.subject,
                      status: item.status
                    }]});
      
                  })
                  this.setState({refreshing:false});
                }
              }).catch((error)=>{
                
                console.warn(error.response.data)
                console.warn(error.response)
                this.setState({refreshing:false});
              });
            }
          });

    }


    componentDidMount(){
        this.setState({refreshing:true});
        this.handleRefreshData();
    }   

    handleRenderItem = ({item}) =>(
        <View style={styles.card}>  
            <Text style={styles.documentNumber}>{item.document_number}</Text>
            <Text style={styles.documentTypeLabel}>Document Type</Text>
            <Text style={styles.itemValue}>{item.type}</Text>
            <Text style={styles.documentTypeLabel}>Subject</Text>
            <Text style={styles.itemValue}>{item.subject}</Text>
            <Text style={styles.documentTypeLabel}>Status</Text>
            <Text style={styles.itemValue}>{item.status}</Text>
            <Text>{'\n'}</Text>
            <View style={{borderBottomWidth:2,borderBottomColor:Colors.new_color_palette.divider}}></View>
        </View>
    )   


    //this component will show if flatlist is empty
    emptyComponent = () =>(
        <View      
          style= {styles.empty}      
        >
          <Text style= {styles.emptyText}>You have no documents received.</Text>
        </View>
      )
    

    render(){
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

            <View style={{flex:1}}>
            <View style={{position:'absolute', left: 0, right: 0, bottom: 0}}>
            <View style = {styles.documentsContainer}>
                
                <FlatList
                    scrollEnabled
                    data={this.state.data}
                    renderItem={this.handleRenderItem}
                    style={{top:20,height:100}}
                    ListEmptyComponent={() => this.emptyComponent()}
                    contentContainerStyle={styles.flatListContainer}              
                    onRefresh={this.handleRefreshData}
                    refreshing={this.state.refreshing}                                  
                />
            </View>
            </View>
            </View>
            </View>

        )
    }


}




const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:Colors.new_color_palette.blue_background
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
    documentsContainer:{
      bottom:0,
      width:(Layout.window.width / 100) * 102,
      height:(Layout.window.height / 100) * 75,
      right:(Layout.window.width / 100) * 50,        
      borderTopLeftRadius:65,
      borderTopRightRadius:65,
      backgroundColor:Colors.new_color_palette.main_background,        
    },
    searchTextInput:{
      top:100,
      borderRadius:40,
      width:(Layout.window.width / 100) * 90,
      position:'absolute'
    },
    card:{    
      top:20,      
      width:(Layout.window.width / 100) * 120,
      height:(Layout.window.height / 100) * 30,
      minHeight:(Layout.window.height / 100) * 30,
      right:40,
      // backgroundColor:Colors.color_palette.base
    },
    documentNumber:{
        top:5,
        color:Colors.new_color_palette.text,
        fontSize:23,
        fontWeight:'bold',
        left:60
    },
    documentTypeLabel:{
      top:5,
      color:Colors.new_color_palette.text,
      fontSize:18,
      fontWeight:'bold',
      left:60
  },
  itemValue:{
    color:Colors.new_color_palette.text,
    fontSize:14,  
    left:80
  },
  flatListContainer:{    
    flexGrow:0,
    paddingBottom:90,  
  },
  empty:{
    top:5,
    left:(Layout.window.height / 100) * 3
  },
  emptyText:{
    color:Colors.new_color_palette.text,
    fontSize:23,
    fontWeight:'bold',
  }
  });
  