
window.navigator.userAgent = 'react-native';
import React, {Component} from 'react';
import io from 'socket.io-client/dist/socket.io';

//localhost
let socket = io('http://172.17.211.9' + ':7980', {
    transports: ['websocket'],
  });

// ssl
//let socket = io('wss://devsysadd.da.gov.ph:8080');




  

  
 




  export default {socket}