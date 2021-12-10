
window.navigator.userAgent = 'react-native';
import React, {Component} from 'react';
import io from 'socket.io-client/dist/socket.io';
// let socket = io('http://172.17.150.112' + ':7980', {
//     transports: ['websocket'],
//   });

  let socket = io.connect('wss://devsysadd.da.gov.ph' , {
    transports: ['websocket','polling'],        
    secure : true,
    reconnectionAttempts: Infinity,
    jsonp: false,
    reconnect: true,
    rejectUnauthorized : false,
    autoconnect:true,
    allowEIO3:true,
    withCredentials: true,
  });

  

  
  
  // socket.on('connect_failed', function(err) {
  //   console.warn(err.message);
  // });
  // socket.on('connect_error', function(err) {
  
  //   console.warn(JSON.stringify(err.message));
  // });

  // socket.on("disconnect", (reason) => {
  //   console.warn(reason);
  // });
  export default {socket}